import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, SafeAreaView,
  ActivityIndicator, StatusBar, Image, Alert,
  ScrollView, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Constants from "expo-constants";

const rawKey = Constants.expoConfig?.extra?.GROQ_API_KEY || process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_KEY = (rawKey || '').replace(/['";\s]/g, '');

export default function ChatbotScreen() {
  const router = useRouter();
  const { doctor } = useAuth();
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setMessages([]);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const flatListRef = useRef(null);

  const CANDIDATE_MODELS = ['groq/compound-mini', 'groq/compound', 'qwen/qwen3.6-27b'];

  const sendMessage = async (text) => {
    const msgText = text || input;
    if (!msgText.trim()) return;

    const currentLangName = i18n.language === 'hi' ? 'Hindi (हिंदी)' : i18n.language === 'mr' ? 'Marathi (मराठी)' : 'English';
    const SYSTEM_PROMPT = `You are Aakriti AI, an expert medical assistant specializing in radiology, medical imaging, and clinical diagnosis. You help doctors with X-Ray analysis, MRI scan findings, CT scan diagnosis, fracture identification, tumor detection, and treatment recommendations. Always give accurate, professional medical information. Be concise but thorough. CRITICAL REQUIREMENT: Respond to the doctor in ${currentLangName}.`;

    const userMsg = { id: Date.now().toString(), role: 'user', text: msgText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    let lastError = null;
    let aiText = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...newMessages.map(m => ({
                  role: m.role === 'assistant' ? 'assistant' : 'user',
                  content: m.text
                }))
              ],
              temperature: 0.7,
              max_tokens: 1024,
            }),
          }
        );

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        aiText = data.choices?.[0]?.message?.content;
        if (aiText) break;
      } catch (err) {
        console.log(`API Error with model ${model}:`, err.message);
        lastError = err;
      }
    }

    if (aiText) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', text: aiText }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          text: '⚠️ Unable to connect to AI assistant. Details: ' + (lastError?.message || 'Unknown error'),
        }
      ]);
    }

    setLoading(false);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
  };

  const clearChat = () => {
    Alert.alert(t('clearChat'), t('deleteMessages'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('clear'), style: 'destructive',
        onPress: () => setMessages([])
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

        {/* Header */}
        <View style={styles.premiumHeader}>
          <View style={styles.leftHeader}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri:'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185694/logo_xoaxud.png'
                }}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.aiTitle}>
                AAkriti AI
              </Text>
              <Text style={styles.aiSubtitle}>
                {t('radiologyAssistant')}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.clearBtn} onPress={clearChat}>
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Messages List */}
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              progressViewOffset={80}
            />
          }
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.chatList,
            { paddingBottom: 100 }
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListHeaderComponent={
            <View style={styles.welcomeCard}>
              <Image
                source={{
                  uri: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185694/logo_xoaxud.png',
                }}
                style={styles.welcomeLogo}
              />
              <Text style={styles.welcomeTitle}>
                AAkriti AI
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {t('advancedPlatform')}
              </Text>

              <View style={styles.featureContainer}>
                <TouchableOpacity
                  style={styles.featureChip}
                  onPress={() => sendMessage('Can you help me interpret an X-Ray image?')}
                >
                  <Text style={styles.featureText}>
                    🩻 {t('xray')} Interpretation
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featureChip}
                  onPress={() => sendMessage('How do you analyze MRI scan findings?')}
                >
                  <Text style={styles.featureText}>
                    🧠 {t('mriScan')} Analysis
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featureChip}
                  onPress={() => sendMessage('Explain CT scan diagnosis for clinical cases')}
                >
                  <Text style={styles.featureText}>
                    🫁 {t('ctScanTab')} Understanding
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featureChip}
                  onPress={() => sendMessage('How to identify bone fractures in medical scans?')}
                >
                  <Text style={styles.featureText}>
                    🦴 {t('fracture')} Explanation
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.welcomeHint}>
                {t('askRadiology')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubbleRow,
                item.role === 'user'
                  ? styles.userRow
                  : styles.aiRow,
              ]}
            >
              {item.role === 'assistant' && (
                <View style={styles.aiAvatar}>
                  <Image
                    source={{
                      uri: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185694/logo_xoaxud.png',
                    }}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                  />
                </View>
              )}

              <View
                style={[
                  styles.bubble,
                  item.role === 'user'
                    ? styles.userBubble
                    : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    item.role === 'user' &&
                      styles.userText,
                  ]}
                >
                  {item.text}
                </Text>
              </View>

              {item.role === 'user' && (
                <Image
                  source={{
                    uri:
                      doctor?.profilePhoto ||
                      'https://ui-avatars.com/api/?name=Doctor',
                  }}
                  style={styles.userProfileAvatar}
                />
              )}
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <View style={styles.typingRow}>
                <View style={styles.aiAvatar}>
                  <Image
                    source={{ uri: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185694/logo_xoaxud.png' }}
                    style={{ width: 22, height: 22 }}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator color={COLORS.primary} size="small" />
                  <Text style={styles.typingText}> {t('analyzing')}</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={t('askRadiology')}
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#aaa"
            multiline
            maxHeight={100}
            onFocus={() =>
              setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300)
            }
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safe:{
 flex:1,
 backgroundColor:'#F8FAFC'
},
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12, paddingBottom: 14,
    paddingTop: Platform.OS === 'android' ? 44 : 50,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerLogo: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ade80' },
  clearBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  clearIcon: { fontSize: 16 },
  chatList: { padding: 16, gap: 12, paddingBottom: 16, flexGrow: 1 },
  quickWrap: { marginBottom: 20 },
  quickTitle: { fontSize: 13, color: '#888', marginBottom: 10, fontWeight: '600' },
  quickBtn: {
    backgroundColor: '#fff', borderRadius: 12, padding: 13,
    marginBottom: 8, borderWidth: 1.5, borderColor: COLORS.primaryLight,
    elevation: 1,
  },
  quickText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
aiAvatar:{
  width:42,
  height:42,

  borderRadius:14,

  backgroundColor:'#FFFFFF',

  borderWidth:1,
  borderColor:'#E2E8F0',

  justifyContent:'center',
  alignItems:'center',

  shadowColor:'#0F172A',
  shadowOffset:{
    width:0,
    height:3,
  },
  shadowOpacity:0.08,
  shadowRadius:10,

  elevation:5,
},
  userAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center', alignItems: 'center',
  },
  userAvatarText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  bubble: { maxWidth: '82%', borderRadius: 28, padding: 12 },
aiBubble:{
 backgroundColor:'#FFFFFF',
 borderBottomLeftRadius:8,
 borderWidth:1,
 borderColor:'#E2E8F0',
 shadowColor:'#000',
 shadowOpacity:0.03,
 shadowRadius:10,
 elevation:2,
},
userBubble:{
backgroundColor:'#0F172A',

  borderBottomRightRadius:8,
},
  bubbleText: { fontSize: 14, color: '#222', lineHeight: 22 },
  userText: { color: '#fff' },
typingRow:{
  flexDirection:'row',
  alignItems:'flex-end',

  gap:12,

  paddingTop:10,
},
typingBubble:{
  flexDirection:'row',
  alignItems:'center',

  backgroundColor:'#FFFFFF',

  borderRadius:24,

  paddingHorizontal:18,
  paddingVertical:12,

  borderWidth:1,
  borderColor:'#E2E8F0',

  shadowColor:'#000',
  shadowOpacity:0.03,
  shadowRadius:8,

  elevation:2,
},
  typingText: { fontSize: 13, color: '#888' },
inputRow:{
 flexDirection:'row',

 paddingHorizontal:12,
 paddingVertical:10,

 backgroundColor:'#F8FAFC',

 borderTopWidth:1,
 borderTopColor:'#E2E8F0',

 alignItems:'center',
},
 input:{
 flex:1,
 fontSize:15,
 color:'#0F172A',
 paddingHorizontal:14,
 maxHeight:100,
},
sendBtn:{
 width:48,
 height:48,

 borderRadius:24,

 backgroundColor:'#0F172A',

 justifyContent:'center',
 alignItems:'center',
},
  sendBtnDisabled: { backgroundColor: '#ccc' },
  sendIcon: { color: '#fff', fontSize: 18 },
premiumHeader:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",

  paddingHorizontal:24,
paddingTop: Platform.OS === 'android' ? 45 : 48,
  paddingBottom:15,

  backgroundColor:"#FFFFFF",

  borderBottomWidth:1,
  borderBottomColor:"#F1F5F9",
},

leftHeader:{
  flexDirection:"row",
  alignItems:"center",
  gap:14,
},
headerLogo:{
  width:42,
  height:42,
},
logoContainer:{
  width:54,
  height:54,
  borderRadius:18,

  backgroundColor:"#FFFFFF",

  borderWidth:1,
  borderColor:"#E2E8F0",

  justifyContent:"center",
  alignItems:"center",

  shadowColor:"#0F172A",
  shadowOffset:{
    width:0,
    height:4,
  },
  shadowOpacity:0.08,
  shadowRadius:10,

  elevation:6,
},
aiLogoBox:{
  justifyContent:'center',
  alignItems:'center',
},
aiTitle:{
  fontSize:22,
  fontWeight:"800",
  color:COLORS.primary,
  letterSpacing:0.2,
  marginLeft:-3,
},
headerProfile:{
  width:40,
  height:40,

  borderRadius:22,

  overflow:'hidden',
borderWidth:1,
borderColor:'#E2E8F0',

shadowColor:'#000',
shadowOffset:{
  width:0,
  height:2,
},
shadowOpacity:0.08,
shadowRadius:8,
elevation:4,
},

profileImage:{
  width:'100%',
  height:'100%',
},
userProfileAvatar:{
  width:34,
  height:34,

  borderRadius:17,

  marginLeft:6,

  borderWidth:1,
  borderColor:'#E2E8F0',
},
aiSubtitle:{
  fontSize:11,
  color:'#64748B',
  marginTop:-4,
},
welcomeCard:{
  alignItems:'center',

  marginTop:50,

  backgroundColor:'#FFFFFF',

  borderRadius:30,

  padding:30,

  borderWidth:1,
  borderColor:'#E2E8F0',

  shadowColor:'#000',
  shadowOpacity:0.04,
  shadowRadius:15,

  elevation:4,
},

welcomeLogo:{
  width:80,
  height:80,

  marginBottom:18,
},

welcomeTitle:{
  fontSize:28,
  fontWeight:'800',

  color:'#0F172A',
},

welcomeSubtitle:{
  fontSize:14,

  color:'#64748B',

  marginTop:6,
},

featureContainer:{
  marginTop:25,
  width:'100%',
  gap: 8,
},

featureChip: {
  backgroundColor: '#F8FAFC',
  borderRadius: 14,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  alignItems: 'center',
},

featureText:{
  fontSize:14,
  fontWeight: '600',
  color:'#334155',
  textAlign:'center',
},

welcomeHint:{
  marginTop:15,

  textAlign:'center',

  color:'#94A3B8',

  lineHeight:22,

  fontSize:13,
},
});