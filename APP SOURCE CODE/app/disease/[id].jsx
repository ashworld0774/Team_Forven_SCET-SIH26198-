import React, { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Image, Modal, Dimensions, StatusBar, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { COLORS } from '../../constants/colors';
import { DISEASE_MODELS } from '../../constants/models';
import ModelViewer from '../../components/ModelViewer';

const { width, height } = Dimensions.get('window');

export default function DiseaseDetail() {
  const { t } = useTranslation();
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const TABS = [
    { key: 'Description', label: t('description') },
    { key: 'Prevention', label: t('prevention') },
    { key: 'Tips', label: t('tips') }
  ];
  const [activeTab, setActiveTab] = useState('Description');
  const [wireframeVisible, setWireframeVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [expandImg, setExpandImg] = useState(false);
  const [liked, setLiked] = useState(false);

  const item = data ? JSON.parse(data) : {
    title: 'Disease Detail', subtitle: '',
    image: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185681/brainstock_n7gfjn.jpg',
    wireframe: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185683/brainstockwireframe_ip4p0v.jpg',
    location: 'Unknown', type: 'Unknown',
    description: 'No description available.', prevention: 'No data.', tips: 'No data.',
  };

  const modelUrl = DISEASE_MODELS[item.id] || DISEASE_MODELS['colles'];

  const renderPoints = (text) => {
    if (!text) return null;
    const points = text.split('.').filter(p => p.trim().length > 2);
    return points.map((point, index) => (
      <View key={index} style={styles.pointRow}>
        <View style={styles.bulletDot} />
        <Text style={styles.pointText}>{point.trim()}.</Text>
      </View>
    ));
  };

  const getTabContent = () => {
    if (activeTab === 'Description') return item.description;
    if (activeTab === 'Prevention') return item.prevention;
    return item.tips;
  };

  const handleShare = async (imageUri) => {
    try {
      const filename = imageUri.split('/').pop()?.split('?')[0] || 'image.jpg';
      const localUri = FileSystem.cacheDirectory + filename;
      const { uri } = await FileSystem.downloadAsync(imageUri, localUri);
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Share not available', 'Sharing is not supported on this device');
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'image/jpeg', dialogTitle: 'Share Image' });
    } catch (error) {
      Alert.alert('Error', 'Failed to share image');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Wireframe Modal */}
      <Modal visible={wireframeVisible} animationType="fade" statusBarTranslucent>
        <View style={styles.modalBg}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setWireframeVisible(false)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t("wireframeView")}</Text>
          <Image source={{ uri: item.wireframe }} style={styles.modalImg} resizeMode="contain" />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="download-outline" size={20} color="#000" />
              <Text style={styles.downloadText}>{t("download")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare(item.wireframe)}>
              <Ionicons name="share-social-outline" size={20} color="#fff" />
              <Text style={styles.shareText}>{t("share")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3D Model Modal */}
      <Modal
        visible={modelVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
      >
        <ModelViewer
          modelUrl={modelUrl}
          modelName={item.title}
          onClose={() => setModelVisible(false)}
        />
      </Modal>

      {/* Expand Image Modal */}
      <Modal visible={expandImg} animationType="fade" statusBarTranslucent>
        <View style={styles.modalBg}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setExpandImg(false)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{item.title}</Text>
          <Image source={{ uri: item.image }} style={styles.modalImg} resizeMode="contain" />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="download-outline" size={20} color="#000" />
              <Text style={styles.downloadText}>{t("download")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare(item.image)}>
              <Ionicons name="share-social-outline" size={20} color="#fff" />
              <Text style={styles.shareText}>{t("share")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: item.image }} style={styles.heroImg} resizeMode="cover" />

          {/* Dark gradient overlay */}
          <View style={styles.heroGradient} />

          {/* Back */}
          <TouchableOpacity style={styles.floatBtnLeft} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Like + Share */}
          <View style={styles.floatBtnsRight}>
            <TouchableOpacity style={styles.floatBtn} onPress={() => setLiked(!liked)}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={22}
                color={liked ? '#ff4d4d' : '#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatBtn} onPress={() => handleShare(item.image)}>
              <Ionicons name="share-social-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Expand */}
          <TouchableOpacity style={styles.expandBtn} onPress={() => setExpandImg(true)}>
            <MaterialCommunityIcons name="fullscreen" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Title overlay on image */}
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroTitle}>{item.title}</Text>
            <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
          </View>
        </View>

        <View style={styles.content}>

          {/* Action Cards */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard} onPress={() => setWireframeVisible(true)}>
              <View style={styles.actionIconBox}>
                <MaterialCommunityIcons name="vector-polyline" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>{t("wireframe")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setModelVisible(true)}>
              <View style={styles.actionIconBox}>
                <MaterialCommunityIcons name="cube-scan" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>{t("view3D")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconBox}>
                <MaterialCommunityIcons name="augmented-reality" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>{t("arView")}</Text>
            </TouchableOpacity>
          </View>

          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <View style={styles.infoLabelRow}>
                <Ionicons name="pin" size={16} color={COLORS.primary} />
                <Text style={styles.infoLabel}>{t("location")}</Text>
              </View>
              <Text style={styles.infoValue}>{item.location}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoBox}>
              <View style={styles.infoLabelRow}>
                <Ionicons name="folder-open-outline" size={16} color={COLORS.primary} />
                <Text style={styles.infoLabel}>{t("category")}</Text>
              </View>
              <Text style={styles.infoValue}>{item.subtitle || item.type}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.pointsContainer}>
            {renderPoints(getTabContent())}
          </View>

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // Hero
  heroWrap: { width, height: 320, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 140,
    backgroundColor: 'transparent',
    // Simulated gradient
    backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  },
  heroTitleWrap: {
    position: 'absolute', bottom: 16, left: 16, right: 80,
  },
  heroTitle: {
    fontSize: 22, fontWeight: 'bold', color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 3,
    textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },

  floatBtnLeft: {
    position: 'absolute', top: 48, left: 16,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  floatBtnsRight: { position: 'absolute', top: 48, right: 16, flexDirection: 'row', gap: 10 },
  floatBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  expandBtn: {
    position: 'absolute', bottom: 14, right: 14,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },

  // Content
  content: { padding: 20 },

  // Action Cards
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  actionCard: {
    flex: 1, backgroundColor: COLORS.primaryLight,
    borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(30,158,116,0.15)',
  },
  actionIconBox: { width: 40, height: 36, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 11, color: COLORS.primary, fontWeight: '700', textAlign: 'center' },

  // Info Row
  infoRow: {
    flexDirection: 'row', backgroundColor: '#f8f8f8',
    borderRadius: 14, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#eee',
  },
  infoBox: { flex: 1 },
  infoLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  infoLabel: { fontSize: 12, color: '#999' },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  infoDivider: { width: 1, backgroundColor: '#ddd', marginHorizontal: 14 },

  // Tabs
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: '#f0f0f0' },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, color: '#666', fontWeight: '600' },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },

  // Points
  pointsContainer: { marginTop: 4 },
  pointRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  bulletDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: COLORS.primary, marginRight: 12, marginTop: 8,
  },
  pointText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 24 },

  // Modals
  modalBg: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  modalClose: {
    position: 'absolute', top: 50, right: 20, zIndex: 10,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalTitle: {
    position: 'absolute', top: 55, left: 0, right: 70,
    textAlign: 'center', color: '#fff', fontSize: 16,
    fontWeight: '600', paddingLeft: 20,
  },
  modalImg: { width, height: height * 0.72 },
  modalActions: {
    position: 'absolute', bottom: 40,
    flexDirection: 'row', gap: 14,
  },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', paddingHorizontal: 20,
    paddingVertical: 12, borderRadius: 12,
  },
  downloadText: { color: '#000', fontWeight: '600', fontSize: 14 },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingHorizontal: 20,
    paddingVertical: 12, borderRadius: 12,
  },
  shareText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});