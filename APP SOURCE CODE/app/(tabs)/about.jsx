import React, { useState } from "react";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../../i18n";
import { COLORS } from "../../constants/colors";

const FEATURES = [
  {
    icon: "hardware-chip-outline",
    title: "Artificial Intelligence",
  },
  {
    icon: "scan-outline",
    title: "Medical Imaging",
  },
  {
    icon: "cube-outline",
    title: "3D Reconstruction",
  },
  {
    icon: "glasses-outline",
    title: "Augmented Reality",
  },
];

const TEAM = [
  {
    group: "AI Team",
    groupIcon: "hardware-chip-outline",
    members: [
     {
  name: 'Sahil Ramteke',
  role: 'AI & ML Engineering',
  image: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/calvic_oqvr5f.png',
  detail: 'Leads AI model development...'
},
      {
        name: "Aishwarya Dhole",
        role: "AI & ML Engineering",
  image: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/calvic_oqvr5f.png',
        detail: "Specializes in deep learning and diagnostic AI pipelines.",
      },
      {
        name: "Tushar Kherde",
        role: "AI & ML Engineering",
  image: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/calvic_oqvr5f.png',
        detail: "Focuses on model training, evaluation, and optimization.",
      },
    ],
  },
  {
    group: "Dev Team",
    groupIcon: "code-slash-outline",
    members: [
      {
        name: "Piyush Nipane",
        role: "App Development",
  image: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/calvic_oqvr5f.png',
        detail: "Mobile developer specializing in React Native and UI/UX.",
      },
      {
        name: "Shubham Munde",
        role: "App Development",
         image: 'https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/calvic_oqvr5f.png',
        detail: "Full-stack developer handling backend and API integrations.",
      },
    ],
  },
  
];

export default function AboutScreen() {
  const router = useRouter();
  const { doctor, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [selectedMember, setSelectedMember] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [langVisible, setLangVisible] = useState(false);

  const initials = (doctor?.name || "DR")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    router.replace("/(auth)/login");
  };

  const changeLanguage = async (lang) => {
    await setAppLanguage(lang);
    setLangVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.primaryLight}
      />

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
            <Feather name="menu" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => router.push("/(tabs)/profile")}
          >
            {doctor?.profilePhoto ? (
              <Image
                source={{ uri: doctor.profilePhoto }}
                style={styles.avatarImg}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Drawer Menu Modal */}
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
                    <Feather name="home" size={22} color={COLORS.primary} />
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroLogoContainer}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dk2novgh2/image/upload/v1780560468/logo_xoaxud-removebg-preview_yby4yt.png",
              }}
              style={styles.heroLogo}
            />
          </View>

          <Text style={styles.heroTitle}>AAkriti AI</Text>

          <Text style={styles.heroSubtitle}>
            AI Powered Medical Visualization Platform
          </Text>

          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 2.0</Text>
          </View>
        </View>

        {/* Mission */}
        <View style={styles.missionCard}>
          <View style={styles.missionIconBox}>
            <Ionicons
              name="telescope-outline"
              size={28}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.missionTitle}>{t("ourMission")}</Text>

          <Text style={styles.missionText}>
            {t("missionText")}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="star-outline"
              size={18}
              color={COLORS.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.sectionTitle}>{t("keyFeatures")}</Text>
          </View>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureCard}>
                <Ionicons
                  name={f.icon}
                  size={26}
                  color={COLORS.primary}
                  style={{ marginBottom: 6 }}
                />
                <Text style={styles.featureTitle}>{f.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="people-outline"
              size={18}
              color={COLORS.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.sectionTitle}>{t("ourTeam")}</Text>
          </View>
         {TEAM
  .filter(group => group.group !== "Clinical Advisors")
  .map((group, gi) => (
            <View key={gi} style={styles.teamGroup}>
              <View style={styles.teamGroupHeader}>
                <Ionicons
                  name={group.groupIcon}
                  size={16}
                  color={COLORS.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.teamGroupTitle}>{group.group}</Text>

                <View style={{ flex: 1 }} />

                <Text
                  style={{
                    fontSize: 12,
                    color: "#64748B",
                    fontWeight: "600",
                  }}
                >
                  {group.members.length} Members
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingVertical: 8,
                  paddingRight: 20,
                }}
              >
                {group.members.map((member, mi) => (
                  <TouchableOpacity
                    key={mi}
                    style={styles.teamCardHorizontal}
                    activeOpacity={0.9}
                    onPress={() => setSelectedMember(member)}
                  >
               <Image
  source={{ uri: member.image }}
  style={styles.teamAvatarImage}
/>

                    <Text style={styles.teamCardName} numberOfLines={1}>
                      {member.name}
                    </Text>

                    <Text style={styles.teamCardRole} numberOfLines={2}>
                      {member.role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
       </View>
<View style={styles.footer}>
  <View style={styles.footerRow}>


    <Text style={styles.footerText}>
      Built for Better Healthcare in India 🇮🇳
    </Text>
  </View>
</View>

</ScrollView>

      {/* Team Member Modal */}
      <Modal
        visible={!!selectedMember}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMember(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedMember(null)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Ionicons
              name="person-circle-outline"
              size={64}
              color={COLORS.primary}
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.modalName}>{selectedMember?.name}</Text>
            <Text style={styles.modalRole}>{selectedMember?.role}</Text>
            <View style={styles.modalDivider} />
            <Text style={styles.modalDetail}>{selectedMember?.detail}</Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedMember(null)}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  hero: {
    width: "100%",

    marginTop: 0,
    marginBottom: 16,

    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,

    alignItems: "center",

    backgroundColor: COLORS.primaryLight,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 4,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 20,

    backgroundColor: "#16A34A",

    marginTop: 12,
  },

  aiText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 6,
  },

  statBox: {
    flex: 1,
    marginHorizontal: 5,

    backgroundColor: "#fff",

    borderRadius: 20,

    paddingVertical: 22,

    alignItems: "center",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
  },

  statLabel: {
    color: "#64748B",
    marginTop: 4,
  },
  // ── Header ──
  header: {
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerLogo: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: COLORS.primary },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(30,158,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarImg: { width: 38, height: 38 },
  avatarFallback: {
    width: 38,
    height: 38,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 14, fontWeight: "bold" },

  // ── Drawer ──
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  drawerHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  drawerLogo: { width: 34, height: 34 },
  drawerTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.primary },
  drawerClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  drawerCloseText: { fontSize: 16, color: "#555" },
  drawerUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  drawerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  drawerAvatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  drawerUserName: { fontSize: 18, fontWeight: "bold", color: "#111" },
  drawerUserSpec: { fontSize: 14, color: COLORS.primary, marginTop: 2 },
  drawerDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
    marginVertical: 8,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  drawerItemIcon: { width: 34, alignItems: "center", justifyContent: "center" },
  drawerItemText: { fontSize: 17, color: "#222", fontWeight: "500" },
  drawerLogout: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 25,
    backgroundColor: "#EF4444",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  drawerLogoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  // ── Language Modal ──
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

  // ── Hero ──
  heroLogoContainer: {
    width: 90,
    height: 90,

    borderRadius: 22,

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

    marginBottom: 16,
  },

  heroLogo: {
    width: 70,
    height: 70,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",

    color: "#0F172A",

    marginTop: 5,

    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 15,

    color: "#475569",

    fontWeight: "600",

    marginTop: 8,

    textAlign: "center",

    maxWidth: "85%",
  },
  versionBadge: {
    marginTop: 14,

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 18,
    paddingVertical: 8,

    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 2,
  },

  versionText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  // ── Cards ──
  missionCard: {
    backgroundColor: "#FFFFFF",

    marginHorizontal: 16,
    marginBottom: 16,

    borderRadius: 24,

    paddingVertical: 28,
    paddingHorizontal: 24,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  missionIconBox: {
    width: 60,
    height: 60,

    borderRadius: 18,

    backgroundColor: COLORS.primaryLight,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 10,
  },
  missionText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    backgroundColor: "#FFFFFF",

    marginHorizontal: 16,
    marginBottom: 16,

    borderRadius: 24,

    padding: 20,

    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#111" },
  featuresGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  featureCard: {
    width: "48%",

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    paddingVertical: 24,
    paddingHorizontal: 16,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  teamGroup: { marginBottom: 16 },
  teamGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  teamGroupTitle: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  teamCard: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#F8FAFC",

    borderRadius: 18,

    padding: 16,

    marginBottom: 10,
  },
  teamIconWrapper: { width: 44, alignItems: "center", marginRight: 12 },
  teamName: { fontSize: 14, fontWeight: "bold", color: "#111" },
  teamRole: { fontSize: 12, color: "#888", marginTop: 2 },
  techRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  contactBtn: {
    backgroundColor: "#0F172A",

    borderRadius: 24,

    paddingVertical: 18,

    justifyContent: "center",

    alignItems: "center",
  },
  contactText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "700",
  },
  // ── Team Member Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    alignItems: "center",
    elevation: 10,
  },
 modalName: {
  fontSize: 24,
  fontWeight: "800",

  color: "#0F172A",

  textAlign: "center",

  marginTop: 6,
},
 modalName: {
  fontSize: 24,
  fontWeight: "800",

  color: "#0F172A",

  textAlign: "center",

  marginTop: 6,
},
  modalDivider: {
    width: "40%",
    height: 1.5,
    backgroundColor: COLORS.primaryLight,
    marginVertical: 14,
    borderRadius: 2,
  },
  modalDetail: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  modalCloseBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  modalCloseText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // 8 se 4
    marginRight: -12, // thoda aur right
  },
  iconBtn: {
    width: 40, // 46 → 40
    height: 40, // 46 → 40
    borderRadius: 20,

    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,

    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { fontSize: 18, color: COLORS.primary },
  avatarBtn: {
    width: 42, // 48 → 42
    height: 42, // 48 → 42
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
    borderRadius: 24,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  drawer: {
    width: "80%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,

    backgroundColor: "#FFFFFF",

    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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

  drawerHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  drawerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.2,
    marginLeft: -3,
  },
  drawerUser: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,

    marginRight: 14,

    borderWidth: 2,
    borderColor: "#DCFCE7",
  },
  drawerAvatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  drawerClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",

    justifyContent: "center",
    alignItems: "center",
  },
  drawerAvatarIcon: { fontSize: 28 },
  drawerUserName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",

    flexShrink: 1,
    width: "100%",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,

    borderRadius: 18,
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    overflow: "hidden", // add this
  },
  drawerUserSpec: {
    fontSize: 14,
    color: "#16A34A",
    marginTop: 4,
  },
  drawerDivider: {
    height: 1,

    backgroundColor: "#E2E8F0",

    marginHorizontal: 20,

    marginVertical: 18,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: 12,
    marginVertical: 3,

    paddingVertical: 14,
    paddingHorizontal: 16,

    borderRadius: 14,
  },
  drawerItemIcon: {
    width: 32,
    alignItems: "center",
    marginRight: 10,
  },
  drawerItemText: {
    fontSize: 15,

    fontWeight: "600",

    color: "#1E293B",
  },
  drawerLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginHorizontal: 20,
    marginTop: 25,

    height: 52,

    borderRadius: 14,

    backgroundColor: "#EF4444",
  },
  drawerLogoutIcon: {
    fontSize: 22,
    width: 28,
    textAlign: "center",
    color: "#EF4444",
  },
  drawerLogoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },teamCardHorizontal: {
  width: 150,

  marginRight: 14,

  backgroundColor: "#FFFFFF",

  borderRadius: 24,

  paddingVertical: 22,
  paddingHorizontal: 16,

  alignItems: "center",

  borderWidth: 1,
  borderColor: "#E2E8F0",


},
teamAvatarImage: {
  width: 58,
  height: 58,

  borderRadius: 39,

  marginBottom: 14,

  borderWidth: 2,
  borderColor: COLORS.primaryLight,
},
teamCardName: {
  fontSize: 15,
  fontWeight: "700",

  color: "#0F172A",

  textAlign: "center",

  marginBottom: 4,
},
teamCardRole: {
  fontSize: 12,

  color: "#16A34A",

  textAlign: "center",

  lineHeight: 18,
},
footer: {
  alignItems: "center",

  paddingVertical: 24,

  marginBottom: 20,
},

footerRow: {
  flexDirection: "row",
  alignItems: "center",
},

footerText: {
  fontSize: 14,

  fontWeight: "700",

  color: COLORS.primary,

  letterSpacing: 0.3,
},
});
