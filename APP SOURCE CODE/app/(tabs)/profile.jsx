import React, { useState, useEffect } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather
} from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  StatusBar,
  Modal,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../../i18n";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../../constants/colors";
import api from "../../constants/api";

export default function ProfileScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [langVisible, setLangVisible] = useState(false);

  // ✅ doctor pehle nikala — ab kahin bhi neeche use karne mein dikkat nahi
  const { doctor, logout, setDoctor, updateDoctor } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(doctor?.name || "Dr. Name");
  const [note, setNote] = useState("Neuroscience Note");
  const [dashboardMode, setDashboardMode] = useState("mostViewed");
  const [notificationsOn, setNotificationsOn] = useState(true);

  // ✅ fullName ab doctor ke baad safely initialize hota hai
  const [fullName, setFullName] = useState(doctor?.name || "");

  // ✅ jab bhi doctor context update ho (login/photo update/name update), fullName sync karo
  useEffect(() => {
    if (doctor?.name) {
      setFullName(doctor.name);
    }
  }, [doctor?.name]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  // ✅ updateDoctor use kiya — AsyncStorage + state dono save hoga
  const handlePhotoChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      try {
        const uri = result.assets[0].uri;
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        const formData = new FormData();
        formData.append("photo", {
          uri,
          name: filename,
          type,
        });
        const res = await api.put("/doctor/profile/photo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // ✅ AsyncStorage + state dono update
        await updateDoctor({ profilePhoto: res.data.profilePhoto });

        Alert.alert("Success", "Photo updated!");
      } catch (error) {
        console.log("Photo upload error:", error?.response?.data);
        console.log("Status:", error?.response?.status);
        console.log("Message:", error?.message);
        Alert.alert("Error", error?.response?.data?.message || error?.message || "Failed to update photo");
      }
    }
  };

  const changeLanguage = async (lang) => {
    await setAppLanguage(lang);
    setLangVisible(false);
  };

  const initials = (doctor?.name || "DR")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const currentLangLabel =
    i18n.language === "hi" ? "हिंदी" :
    i18n.language === "mr" ? "मराठी" : "English";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primaryLight} />

      {/* Header */}
    <View style={styles.header}>
  <View style={styles.headerLeft}>
    <View style={styles.logoContainer}>
      <Image
        source={{
          uri: "https://res.cloudinary.com/dk2novgh2/image/upload/v1780560468/logo_xoaxud-removebg-preview_yby4yt.png",
        }}
        style={styles.headerLogo}
        resizeMode="contain"
      />
    </View>

    <Text style={styles.headerTitle}>AAkriti</Text>
  </View>

  <View style={styles.headerRight}>
    <TouchableOpacity style={styles.iconBtn}>
      <Ionicons
        name="notifications-outline"
        size={22}
        color={COLORS.primary}
      />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.iconBtn}
      onPress={() => setMenuVisible(true)}
    >
      <Feather
        name="menu"
        size={22}
        color={COLORS.primary}
      />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.avatarBtn}
      onPress={handlePhotoChange}
    >
      {doctor?.profilePhoto ? (
        <Image
          source={{ uri: doctor.profilePhoto }}
          style={styles.avatarImg}
        />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>
            {initials}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  </View>
</View>

      {/* ── Drawer Menu Modal ── */}
        <Modal visible={menuVisible} transparent animationType="fade">
              <View style={styles.drawerOverlay}>
                <View style={styles.drawer}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                  >
                    {/* Drawer Header */}
                    <View style={styles.drawerHeader}>
               <View style={styles.drawerHeaderLeft}>
        <View style={styles.drawerLogoContainer}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dk2novgh2/image/upload/v1780560468/logo_xoaxud-removebg-preview_yby4yt.png",
            }}
            style={styles.drawerLogo}
            resizeMode="contain"
          />
        </View>
      
        <Text style={styles.drawerTitle}>AAkriti</Text>
      </View>
                      <TouchableOpacity
                        onPress={() => setMenuVisible(false)}
                        style={styles.drawerClose}
                      >
                        <Text style={styles.drawerCloseText}>✕</Text>
                      </TouchableOpacity>
                    </View>
      
                    {/* Doctor Info */}
             <View style={styles.profileCard}>
        <Image
          source={{ uri: doctor.profilePhoto }}
          style={styles.drawerAvatar}
        />
      
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={styles.drawerUserName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            DR. {doctor?.name || "Doctor"}
          </Text>
      
          <Text
            style={styles.drawerUserSpec}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {doctor?.speciality || "Specialist"}
          </Text>
        </View>
      </View>
                    <View style={styles.drawerDivider} />
      
                    {/* Menu Items */}
                    {[
                      {
                        icon: (
                          <Feather
                            name="home"
                            size={22}
                            color={COLORS.primary}
                          />
                        ),
                        label: t("home"),
                        action: () => {
                          setMenuVisible(false);
                          router.replace("/(tabs)");
                        },
                      },
                      {
                        icon: (
                          <Ionicons
                            name="language-outline"
                            size={22}
                            color="#6366F1"
                          />
                        ),
                        label: t("language"),
                        action: () => {
                          setMenuVisible(false);
                          setLangVisible(true);
                        },
                      },
                      {
                        icon: <Feather name="user" size={22} color="#10B981" />,
                        label: t("profile"),
                        action: () => {
                          setMenuVisible(false);
                          router.push("/(tabs)/profile");
                        },
                      },
                      {
                        icon: (
                          <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={22}
                            color="#F59E0B"
                          />
                        ),
                        label: t("chatbot"),
                        action: () => {
                          setMenuVisible(false);
                          router.push("/(tabs)/chatbot");
                        },
                      },
                      {
                        icon: (
                          <Ionicons
                            name="information-circle-outline"
                            size={22}
                            color="#3B82F6"
                          />
                        ),
                        label: t("about"),
                        action: () => {
                          setMenuVisible(false);
                          router.push("/(tabs)/about");
                        },
                      },
                      {
                        icon: (
                          <MaterialCommunityIcons
                            name="line-scan"
                            size={22}
                            color="#EF4444"
                          />
                        ),
                        label: t("scanner3D"),
                        action: () => setMenuVisible(false),
                      },
                    ].map((item, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.drawerItem}
                        onPress={item.action}
                      >
                        <View style={styles.drawerItemIcon}>{item.icon}</View>
                        <Text style={styles.drawerItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
      
                    <View style={styles.drawerDivider} />
      
                    {/* Logout */}
                    <TouchableOpacity
                      style={styles.drawerLogout}
                      onPress={handleLogout}
                    >
                      <Ionicons name="log-out-outline" size={22} color="#fff" />
                      <Text style={styles.drawerLogoutText}>{t("logout")}</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </Modal>
      
            {/* Language Modal */}
            <Modal visible={langVisible} transparent animationType="fade">
              <TouchableOpacity
                style={styles.langOverlay}
                onPress={() => setLangVisible(false)}
              >
                <View style={styles.langCard}>
                  <Text style={styles.langTitle}>{t("selectLanguage")}</Text>
                  {[
                    { code: "en", label: "English" },
                    { code: "hi", label: "हिंदी" },
                    { code: "mr", label: "मराठी" },
                  ].map((l) => (
                    <TouchableOpacity
                      key={l.code}
                      style={styles.langItem}
                      onPress={() => changeLanguage(l.code)}
                    >
                      <Text style={styles.langItemText}>{l.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
      

     <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 30 }}
>
  {/* Profile Card */}
  <View style={styles.heroCard}>

  <View style={styles.heroTop}>

    <TouchableOpacity onPress={handlePhotoChange}>
      {doctor?.profilePhoto ? (
        <Image
          source={{ uri: doctor.profilePhoto }}
          style={styles.heroAvatar}
        />
      ) : (
        <View style={styles.heroAvatarFallback}>
          <Text style={styles.heroAvatarText}>
            {initials}
          </Text>
        </View>
      )}
    </TouchableOpacity>

    <View style={{ flex: 1 }}>
    <Text
  style={styles.heroDoctorName}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  Dr. {doctor?.name || "Doctor"}
</Text>

      <Text style={styles.heroDoctorSpec}>
        {doctor?.speciality || "Healthcare Specialist"}
      </Text>

      <View style={styles.verifiedBadge}>
        <Ionicons
          name="shield-checkmark"
          size={14}
          color="#fff"
        />
        <Text style={styles.verifiedText}>
          {t("verifiedDoctor")}
        </Text>
      </View>
    </View>

  </View>

  <View style={styles.heroStatsRow}>
    <View style={styles.heroStat}>
      <Text style={styles.heroStatNumber}>
        120+
      </Text>
      <Text style={styles.heroStatLabel}>
        {t("patients")}
      </Text>
    </View>

    <View style={styles.heroStat}>
      <Text style={styles.heroStatNumber}>
        5+
      </Text>
      <Text style={styles.heroStatLabel}>
        {t("years")}
      </Text>
    </View>

    <View style={styles.heroStat}>
      <Text style={styles.heroStatNumber}>
        4.9★
      </Text>
      <Text style={styles.heroStatLabel}>
        {t("rating")}
      </Text>
    </View>
  </View>

</View>

  {/* Information */}
<View style={styles.sectionCard}>

<View
  style={{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:16,
  }}
>

<Text style={styles.sectionHeading}>
  {t("personalInfo")}
</Text>

<TouchableOpacity
onPress={async () => {

  if(editing){

    try{

      await api.put("/doctor/profile",{
        name:fullName,
      });

      await updateDoctor({
        ...doctor,
        name:fullName,
      });

      Alert.alert(
        "Success",
        "Profile Updated"
      );

    }catch(error){

      Alert.alert(
        "Error",
        "Update Failed"
      );

    }

  }

  setEditing(!editing);

}}
>
  <Text
    style={{
      color:COLORS.primary,
      fontWeight:"700",
    }}
  >
    {editing ? t("save") : t("edit")}
  </Text>
</TouchableOpacity>

</View>

<View style={styles.infoCard}>
  <Ionicons
    name="person-outline"
    size={22}
    color={COLORS.primary}
  />

  <View style={{ flex:1, marginLeft:12 }}>
    <Text style={styles.infoTitle}>
      {t("name")}
    </Text>

    {editing ? (
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        style={styles.editInput}
      />
    ) : (
      <Text style={styles.infoDescription}>
        {fullName}
      </Text>
    )}
  </View>
</View>

  <View style={styles.infoCard}>
  <Ionicons
    name="mail-outline"
    size={22}
    color={COLORS.primary}
  />

  <View style={{ marginLeft: 12 }}>
    <Text style={styles.infoTitle}>
      {t("email")}
    </Text>

    <Text style={styles.infoDescription}>
      {doctor?.email}
    </Text>
  </View>
</View>

   <View style={styles.infoCard}>
  <Ionicons
    name="call-outline"
    size={22}
    color={COLORS.primary}
  />

  <View style={{ marginLeft: 12 }}>
    <Text style={styles.infoTitle}>
      {t("phone")}
    </Text>

    <Text style={styles.infoDescription}>
      {doctor?.phone || "Not Added"}
    </Text>
  </View>
</View>

   <View style={styles.infoCard}>
  <Ionicons
    name="medkit-outline"
    size={22}
    color={COLORS.primary}
  />

  <View style={{ marginLeft: 12 }}>
    <Text style={styles.infoTitle}>
      {t("speciality")}
    </Text>

    <Text style={styles.infoDescription}>
      {doctor?.speciality || "General"}
    </Text>
  </View>
</View>
  </View>

  {/* Quick Actions */}
 <View style={styles.sectionCard}>

<Text style={styles.sectionHeading}>
  {t("accountSettings")}
</Text>

<TouchableOpacity style={styles.settingRow}>
  <Ionicons
    name="create-outline"
    size={22}
    color="#2563EB"
  />

  <Text style={styles.settingText}>
    {t("editProfile")}
  </Text>

  <Ionicons
    name="chevron-forward"
    size={20}
    color="#94A3B8"
  />
</TouchableOpacity>

<TouchableOpacity style={styles.settingRow}>
  <Ionicons
    name="lock-closed-outline"
    size={22}
    color="#7C3AED"
  />

  <Text style={styles.settingText}>
    {t("changePassword")}
  </Text>

  <Ionicons
    name="chevron-forward"
    size={20}
    color="#94A3B8"
  />
</TouchableOpacity>

<TouchableOpacity style={styles.settingRow}>
  <Ionicons
    name="help-circle-outline"
    size={22}
    color="#F59E0B"
  />

  <Text style={styles.settingText}>
    {t("helpSupport")}
  </Text>

  <Ionicons
    name="chevron-forward"
    size={20}
    color="#94A3B8"
  />
</TouchableOpacity>

</View>

<View style={styles.sectionCard}>

<Text style={styles.sectionHeading}>
  {t("preferences")}
</Text>
<View style={styles.notificationCard}>

<View>
  <Text style={styles.notificationTitle}>
    {t("pushNotifications")}
  </Text>

  <Text style={styles.notificationSub}>
    {t("receivePatientUpdates")}
  </Text>
</View>

<Switch
  value={notificationsOn}
  onValueChange={setNotificationsOn}
  trackColor={{
    false:"#CBD5E1",
    true:"#16A34A",
  }}
/>

</View>

</View>

</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safe: {
  flex: 1,
  backgroundColor: "#F1F5F9",
},

 header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  paddingHorizontal: 24,
  paddingTop: 45,
  paddingBottom: 15,

  backgroundColor: "#FFFFFF",

  borderBottomWidth: 1,
  borderBottomColor: "#F1F5F9",
},

headerLeft: {
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
},

logoContainer: {
  width: 55,
  height: 55,
  borderRadius: 18,

  backgroundColor: "#FFFFFF",

  borderWidth: 1,
  borderColor: "#E2E8F0",

  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#0F172A",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 10,

  elevation: 6,
},

headerLogo: {
  width: 50,
  height: 50,
},

headerTitle: {
  fontSize: 26,
  fontWeight: "800",
  color: COLORS.primary,
  letterSpacing: 0.2,
  marginLeft: -3,
},

headerRight: {
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  marginRight: -12,
},

iconBtn: {
  width: 40,
  height: 40,
  borderRadius: 20,

  backgroundColor: "#FFFFFF",

  borderWidth: 1,
  borderColor: "#E2E8F0",

  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.06,
  shadowRadius: 8,

  elevation: 3,
},

avatarBtn: {
  width: 42,
  height: 42,
  borderRadius: 21,

  overflow: "hidden",

  borderWidth: 2,
  borderColor: "#FFFFFF",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 6,

  elevation: 3,
},

avatarImg: {
  width: "100%",
  height: "100%",
  borderRadius: 21,
},

avatarFallback: {
  width: "100%",
  height: "100%",
  borderRadius: 21,

  backgroundColor: COLORS.primary,

  justifyContent: "center",
  alignItems: "center",
},

avatarText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 14,
},
drawerOverlay:{
  flex:1,
  backgroundColor:"rgba(15,23,42,0.45)",
  flexDirection:"row",
  justifyContent:"flex-end",
},
drawer:{
  width:"80%",
  height:"100%",
  backgroundColor:"#FFFFFF",
},
 drawerHeader:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",

  paddingHorizontal:24,
  paddingTop:24,
  paddingBottom:20,

  backgroundColor:"#FFFFFF",

  borderBottomWidth:1,
  borderBottomColor:"#F1F5F9",
},
drawerLogoContainer: {
  width: 55,
  height: 55,
  borderRadius: 18,

  backgroundColor: "#FFFFFF",

  borderWidth: 1,
  borderColor: "#E2E8F0",

  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#0F172A",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 10,

  elevation: 6,
},

drawerLogo: {
  width: 50,
  height: 50,
},

drawerHeaderLeft:{
  flexDirection:"row",
  alignItems:"center",
  gap:12,
},
drawerTitle: {
  fontSize: 26,
  fontWeight: "800",
  color: COLORS.primary,
  letterSpacing: 0.2,
  marginLeft: -3,
},
drawerUser:{
 flexDirection:"row",
 alignItems:"center",

 paddingHorizontal:24,
 paddingVertical:20,
},
drawerAvatar:{
  width:60,
  height:60,
  borderRadius:30,

  marginRight:14,

  borderWidth:2,
  borderColor:"#DCFCE7",
},
  drawerAvatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
drawerClose:{
  width:40,
  height:40,
  borderRadius:20,
  backgroundColor:"#F8FAFC",

  justifyContent:"center",
  alignItems:"center",
},
  drawerAvatarIcon: { fontSize: 28 },
drawerUserName:{
  fontSize:20,
  fontWeight:"800",
  color:"#0F172A",

  flexShrink:1,
  width:"100%",
},
profileCard:{
  flexDirection:"row",
  alignItems:"center",

  marginHorizontal:20,
  marginTop:20,
  padding:16,

  borderRadius:18,
  backgroundColor:"#FFFFFF",

  borderWidth:1,
  borderColor:"#E2E8F0",

  overflow:"hidden",
},
drawerUserSpec:{
  fontSize:14,
  color:"#16A34A",
  marginTop:4,
},
drawerDivider:{
  height:1,

  backgroundColor:"#E2E8F0",

  marginHorizontal:20,

  marginVertical:18,
},
drawerItem:{
  flexDirection:"row",
  alignItems:"center",

  marginHorizontal:12,
  marginVertical:3,

  paddingVertical:14,
  paddingHorizontal:16,

  borderRadius:14,
},
drawerItemIcon:{
  width:32,
  alignItems:"center",
  marginRight:10,
},
drawerItemText:{
  fontSize:15,

  fontWeight:"600",

  color:"#1E293B",
},
drawerLogout:{
  flexDirection:"row",
  alignItems:"center",
  justifyContent:"center",

  marginHorizontal:20,
  marginTop:25,

  height:52,

  borderRadius:14,

  backgroundColor:"#EF4444",
},
drawerLogoutIcon: {
    fontSize: 22,
    width: 28,
    textAlign: "center",
    color: "#EF4444",
  },
drawerLogoutText:{
  color:"#FFFFFF",
  fontSize:15,
  fontWeight:"700",
  marginLeft:8,
},

  langOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  langCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: 260,
  },
  langTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 16,
    textAlign: "center",
  },
  langItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  langItemText: { fontSize: 16, color: "#333", textAlign: "center" },
profileHero: {
  marginHorizontal: 16,
  marginTop: 20,
  backgroundColor: "#FFFFFF",
  borderRadius: 24,
  paddingVertical: 28,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#EEF2F7",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.04,
  shadowRadius: 6,
  elevation: 2,
},

profileImage: {
  width: 110,
  height: 110,
  borderRadius: 55,

  borderWidth: 4,
  borderColor: "#E2E8F0",
},

profileName: {
  marginTop: 14,

  fontSize: 24,
  fontWeight: "800",

  color: "#0F172A",
},

profileSpeciality: {
  marginTop: 4,

  fontSize: 14,

  color: "#64748B",
},

profileBadge: {
  marginTop: 12,

  backgroundColor: COLORS.primary,

  paddingHorizontal: 16,
  paddingVertical: 8,

  borderRadius: 20,
},

profileBadgeText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 12,
},

statsRow: {
  flexDirection: "row",

  justifyContent: "space-between",

  marginHorizontal: 16,
  marginTop: 18,
},

statCard: {
  flex: 1,

  marginHorizontal: 4,

  backgroundColor: "#FFFFFF",

  borderRadius: 18,

  paddingVertical: 20,

  alignItems: "center",

  borderWidth: 1,
  borderColor: "#EEF2F7",
},

statNumber: {
  fontSize: 22,
  fontWeight: "800",

  color: COLORS.primary,
},

statLabel: {
  marginTop: 4,

  fontSize: 12,

  color: "#64748B",
},

sectionCard: {
  marginHorizontal:16,
  marginTop:18,

  backgroundColor:"#FFFFFF",

  borderRadius:24,

  padding:20,

  shadowColor:"#0F172A",
  shadowOffset:{
    width:0,
    height:4,
  },
  shadowOpacity:0.06,
  shadowRadius:10,

  elevation:5,

  borderWidth:1,
  borderColor:"#F1F5F9",
},

sectionHeading: {
  fontSize: 17,
  fontWeight: "800",

  color: "#0F172A",

  marginBottom: 14,
},

infoRow: {
  marginBottom: 16,
},

infoLabel: {
  fontSize: 12,

  color: "#94A3B8",
},

infoValue: {
  marginTop: 3,

  fontSize: 15,

  fontWeight: "600",

  color: "#0F172A",
},

actionCard: {
  flexDirection: "row",

  alignItems: "center",

  paddingVertical: 14,

  borderBottomWidth: 1,

  borderBottomColor: "#F1F5F9",
},

actionText: {
  marginLeft: 12,
  fontSize: 15,
  fontWeight: "600",
  color: "#0F172A",
},
  avatarWrap: { position: "relative", marginBottom: 14 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: COLORS.primary },
  editBadge: {
    position: "absolute", bottom: 0, right: 0,
    backgroundColor: COLORS.primary,
    width: 26, height: 26, borderRadius: 13,
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  heroName: { fontSize: 22, fontWeight: "bold", color: "#111" },
  heroEmail: { fontSize: 13, color: "#888", marginTop: 4 },
  heroPhone: { fontSize: 13, color: "#888", marginTop: 2 },

  listSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4,
    elevation: 2,
  },
  listSectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "#f5f5f5",
  },
  listSectionTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  editBtnText: { fontSize: 14, color: COLORS.primary, fontWeight: "700" },
  listItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  listIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  listContent: { flex: 1 },
  listLabel: { fontSize: 14, color: "#222", fontWeight: "500" },
  listValue: { fontSize: 13, color: "#888", marginTop: 1 },
  listInput: {
    fontSize: 13, borderBottomWidth: 1,
    borderBottomColor: COLORS.primary, color: "#222", paddingVertical: 2,
  },
  listDivider: { height: 1, backgroundColor: "#f5f5f5", marginLeft: 50 },

  toggleRow: { flexDirection: "row", gap: 6 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: "#f0f0f0" },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 11, color: "#555", fontWeight: "600" },
  dashSub: { fontSize: 12, color: "#999", marginBottom: 12 },

  logoutBtn: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: "#fff", borderRadius: 14, padding: 16,
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "#EF4444", elevation: 2,
  },
  logoutText: { fontSize: 15, color: "#EF4444", fontWeight: "bold" },
heroCard:{
  margin:16,

  padding:22,

  borderRadius:32,

  backgroundColor:"#FFFFFF",

  borderWidth:1.5,

  borderColor:"#E2E8F0",
},

heroTop:{
  flexDirection:"row",
  alignItems:"center",
},

heroAvatar:{
  width:90,
  height:90,
  borderRadius:45,
  marginRight:18,
},

heroAvatarFallback:{
  width:90,
  height:90,
  borderRadius:45,
  backgroundColor:COLORS.primary,
  justifyContent:"center",
  alignItems:"center",
  marginRight:18,
},

heroAvatarText:{
  color:"#fff",
  fontSize:28,
  fontWeight:"800",
},

heroDoctorName:{
  fontSize:22,
  fontWeight:"800",
  color:"#0F172A",

  flexShrink:1,

  width:"100%",
},

heroDoctorSpec:{
  fontSize:14,
  color:"#16A34A",
  marginTop:4,
},

verifiedBadge:{
  flexDirection:"row",
  alignSelf:"flex-start",

  marginTop:10,

  backgroundColor:"#16A34A",

  paddingHorizontal:12,
  paddingVertical:6,

  borderRadius:30,
},

verifiedText:{
  color:"#fff",
  fontSize:12,
  fontWeight:"700",
  marginLeft:4,
},

heroStatsRow:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginTop:25,
},

heroStat:{
  alignItems:"center",
},

heroStatNumber:{
  fontSize:24,
  fontWeight:"800",
  color:COLORS.primary,
},

heroStatLabel:{
  color:"#64748B",
  marginTop:4,
},

infoCard:{
  flexDirection:"row",
  alignItems:"center",

  padding:16,

  backgroundColor:"#F8FAFC",

  borderRadius:18,

  marginBottom:12,
},

infoTitle:{
  fontSize:13,
  color:"#64748B",
},

infoDescription:{
  fontSize:15,
  fontWeight:"700",
  color:"#0F172A",
  marginTop:2,
},

quickGrid:{
  flexDirection:"row",
  flexWrap:"wrap",
  justifyContent:"space-between",
},

quickCard:{
  width:"48%",

  backgroundColor:"#F8FAFC",

  borderRadius:22,

  paddingVertical:24,

  alignItems:"center",

  marginBottom:12,
},

quickText:{
  marginTop:10,
  fontSize:14,
  fontWeight:"700",
  color:"#0F172A",
},
settingRow:{
  flexDirection:"row",
  alignItems:"center",

  paddingVertical:16,

  borderBottomWidth:1,
  borderBottomColor:"#F1F5F9",
},

settingText:{
  flex:1,

  marginLeft:14,

  fontSize:15,
  fontWeight:"600",

  color:"#0F172A",
},

editInput:{
  marginTop:4,

  borderBottomWidth:1,
  borderBottomColor:"#CBD5E1",

  paddingVertical:4,

  fontSize:15,

  color:"#0F172A",
},
notificationCard:{
  flexDirection:"row",

  justifyContent:"space-between",

  alignItems:"center",

  padding:18,

  backgroundColor:"#F8FAFC",

  borderRadius:18,
},

notificationTitle:{
  fontSize:15,
  fontWeight:"700",
  color:"#0F172A",
},

notificationSub:{
  fontSize:13,
  color:"#64748B",
  marginTop:4,
},

});