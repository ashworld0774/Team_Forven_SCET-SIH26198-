import React, { useState, useRef, useEffect } from "react";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  Modal,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../../i18n";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");
const CARD_BACKGROUND = "#FFFFFF";
const BORDER_COLOR = "#E2E8F0";

const COMMON_SHADOW = {
  shadowColor: "#0F172A",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 4,
};
const COMMON_SURFACE = {
  backgroundColor: "#FFFFFF",

  borderWidth: 1,
  borderColor: "#EEF2F7",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.03,
  shadowRadius: 4,

  elevation: 1,
};
const BANNERS = [
  {
    id: "1",
    uri: "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/img1_dsnxyp.png",
    title: "Learn and Visualize",
    subtitle: "Health in Augmented Reality",
  },
  {
    id: "2",
    uri: "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/img2_aigujt.png",
    title: "Detect Fractures",
    subtitle: "AI Powered Bone Analysis",
  },
  {
    id: "3",
    uri: "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/img3_s6ayfa.png",
    title: "3D Medical Models",
    subtitle: "Explore Human Anatomy",
  },
  {
    id: "4",
    uri: "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185687/img4_dlwtef.png",
    title: "Advanced Scanning",
    subtitle: "MRI, CT & X-Ray Solutions",
  },
];

const FILTER_TABS = ["All", "Fractures", "Tumor", "Clotting", "3D"];

const DISEASE_SECTIONS = [
  {
    id: "xray_fracture",
    title: "X-Ray (Fracture)",
    tag: "X-Ray",
    tagColor: COLORS.primary,
    items: [
      {
        id: "colles",
        title: "Colles Fracture",
        subtitle: "Fracture in wrist",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185683/colles_bccswl.png",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185703/wristwireframe_delocj.png",
        category: "Fractures",
        location: "Wrist Bone",
        type: "Distal Radius Fracture",
        description:
          "A Colles Fracture is a medical condition that requires immediate attention. This condition affects the fracture in wrist area and can be identified through advanced imaging techniques.",
        prevention:
          "Use protective gear during sports. Strengthen wrist muscles. Avoid falls by using proper footwear.",
        tips: "Apply ice immediately. Immobilize the wrist. Seek medical attention within 24 hours.",
      },
      {
        id: "tibial",
        title: "Distal Femoral Fracture",
        subtitle: "Fracture in knee",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185680/Anterior_oeekrs.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185681/anteriorwireframe_siiubu.jpg",
        category: "Fractures",
        location: "Thigh Bone (Femur)",
        type: "Distal Femoral Fracture",
        description:
          "A Distal Femoral Fracture is a serious injury involving a break in the lower part of the femur near the knee joint. It can be caused by high-impact trauma, falls, or weakened bones and can be identified through X-rays and advanced imaging techniques.",
        prevention:
          "Use protective gear during high-risk activities. Strengthen leg and core muscles. Maintain good bone health and use proper footwear to reduce the risk of falls.",
        tips:
          "Avoid putting weight on the injured leg. Immobilize the leg and apply ice to reduce swelling. Seek immediate medical attention for proper evaluation and treatment.",
      }, ,
      {
        id: "calvic",
        title: "Calvic Fracture",
        subtitle: "Fracture in collarbone",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185684/calvic_oqvr5f.png",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1786190403/1bb905c2-d323-4a17-8630-19074f8ce6b4_lyh1pv.jpg",
        category: "Fractures",
        location: "Collarbone (Clavicle)",
        type: "Clavicle Fracture",
        description:
          "A Clavicle Fracture is a common injury involving a break in the collarbone. It can occur due to falls, sports injuries, or direct impact to the shoulder and can be identified through X-rays and other imaging techniques.",
        prevention:
          "Use protective gear during sports and high-risk activities. Improve balance and coordination to prevent falls. Maintain good bone health through proper nutrition and regular exercise.",
        tips:
          "Support and immobilize the injured arm. Apply ice to reduce pain and swelling. Avoid moving or lifting with the affected arm and seek medical attention for proper evaluation.",
      },
      {
        id: "femur",
        title: "Tibial Fracture",
        subtitle: "Fracture in lower leg bone",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1786176838/WhatsApp_Image_2026-08-08_at_13.33.46_hmh6f4.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185705/thighwireframe_yqw3tz.jpg",
        category: "Fractures",
        location: "Shin Bone (Tibia)",
        type: "Tibial Fracture",
        description:
          "A Tibial Fracture is a break in the shin bone, which is the main weight-bearing bone of the lower leg. It can result from falls, sports injuries, or high-impact trauma and can be diagnosed through X-rays and advanced imaging techniques.",
        prevention:
          "Use appropriate protective equipment during sports. Strengthen leg muscles and maintain good bone health. Wear proper footwear and take precautions to prevent falls and high-impact injuries.",
        tips:
          "Do not put weight on the injured leg. Keep the leg immobilized and apply ice to reduce swelling. Seek immediate medical attention, especially if there is severe pain, deformity, or difficulty moving the leg.",
      },
    ],
  },
  {
    id: "mri_tumor",
    title: "MRI (Tumor)",
    tag: "MRI",
    tagColor: "#9B59B6",
    items: [
      {
        id: "brain_stroke",
        title: "Brain Stroke",
        subtitle: "Block of blood flow",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185681/brainstock_n7gfjn.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185683/brainstockwireframe_ip4p0v.jpg",
        category: "Tumor",
        location: "Brain",
        type: "Ischemic Stroke",
        description:
          "A brain stroke occurs when blood supply to part of the brain is cut off.",
        prevention: "Control blood pressure. Avoid smoking. Regular exercise.",
        tips: "FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency.",
      },
      {
        id: "spinal",
        title: "Spinal Stenosis",
        subtitle: "Gap in spinal cord",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185702/Spondylolisthesis_qrebbc.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185700/spinalwireframe_c3rmhr.jpg",
        category: "Tumor",
        location: "Spine",
        type: "Spinal Stenosis",
        description:
          "Spinal stenosis is the narrowing of spaces within the spine, which can put pressure on nerves.",
        prevention: "Regular exercise. Maintain healthy weight. Good posture.",
        tips: "Physical therapy and pain management are primary treatments.",
      },
      {
        id: "brain_tumor",
        title: "Brain Tumor",
        subtitle: "Abnormal growth in brain",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185681/Brain_tumar_r4lth4.png",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185683/brainstockwireframe_ip4p0v.jpg",
        category: "Tumor",
        location: "Brain",
        type: "Glioblastoma",
        description:
          "A brain tumor is an abnormal growth of cells in the brain.",
        prevention: "Regular screening for high-risk individuals.",
        tips: "Early detection is key. MRI is gold standard.",
      },
      {
        id: "lung_tumor",
        title: "Lung Tumor",
        subtitle: "Growth in lung tissue",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185695/lung1_eodt9q.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185699/lungwireframe_s9kmd0.png",
        category: "Tumor",
        location: "Lung",
        type: "Pulmonary Tumor",
        description:
          "Lung tumors can be primary or secondary. Non-small cell lung cancer is most common.",
        prevention: "Avoid smoking. Reduce exposure to radon.",
        tips: "Annual CT screening recommended for high-risk individuals.",
      },
    ],
  },
  {
    id: "ct_clotting",
    title: "CT Scan (Clotting)",
    tag: "CT",
    tagColor: "#E67E22",
    items: [
      {
        id: "brain_clot",
        title: "Brain Clot",
        subtitle: "Cerebral thrombosis",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185681/brainstock_n7gfjn.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185682/brain1wireframe_ajqlhf.jpg",
        category: "Clotting",
        location: "Brain",
        type: "Cerebral Thrombosis",
        description:
          "A brain blood clot can block or rupture arteries or veins, causing brain cells to die.",
        prevention: "Control blood pressure. Healthy diet. Regular exercise.",
        tips: "Emergency treatment required within hours.",
      },
      {
        id: "lung_clot",
        title: "Pulmonary Embolism",
        subtitle: "Blood clot in lung",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185691/kidneyfungal_z0fz1w.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185699/pulmonarywireframe_f4dmnc.png",
        category: "Clotting",
        location: "Lung",
        type: "Pulmonary Embolism",
        description:
          "A pulmonary embolism is a blockage in one of the pulmonary arteries in the lungs.",
        prevention: "Stay active. Avoid prolonged immobility.",
        tips: "Seek emergency care immediately.",
      },
      {
        id: "heart_clot",
        title: "Heart Clot",
        subtitle: "Cardiac thrombosis",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185682/heartfungal_j93vpx.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185683/heartwireframe_kw1a4p.png",
        category: "Clotting",
        location: "Heart",
        type: "Cardiac Thrombosis",
        description:
          "A heart clot forms when blood coagulates inside the heart chambers.",
        prevention: "Regular cardiac checkups. Healthy diet.",
        tips: "Immediate ECG and echocardiogram required.",
      },
      {
        id: "abdominal",
        title: "Abdominal Clot",
        subtitle: "Mesenteric ischemia",
        image:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185680/Abdominal_aodkcs.jpg",
        wireframe:
          "https://res.cloudinary.com/dk2novgh2/image/upload/v1774185681/Abdominalwireframe_jwtunq.jpg",
        category: "Clotting",
        location: "Abdomen",
        type: "Mesenteric Thrombosis",
        description:
          "Abdominal clotting involves blockage of mesenteric blood vessels.",
        prevention: "Manage cardiovascular risk factors.",
        tips: "CT angiography is diagnostic. Surgical intervention may be needed.",
      },
    ],
  },
  {
    id: "organs",
    title: "Human Organs",
    tag: "Organ",
    tagColor: "#16A085",

    items: [
      {
        id: "heart",
        title: "Heart",
        subtitle: "Human Heart",
        image: "https://res.cloudinary.com/dk2novgh2/image/upload/v1786175476/WhatsApp_Image_2026-08-08_at_13.20.20_psjddd.jpg",
        wireframe: "https://res.cloudinary.com/dk2novgh2/image/upload/v1786190762/WhatsApp_Image_2026-08-08_at_5.33.42_PM_ya2m5i.jpg",
        category: "Cardiovascular Conditions",
        location: "Coronary Arteries",
        type: "Coronary Artery Disease",
        description:
          "Coronary Artery Disease occurs when plaque builds up inside the coronary arteries, reducing blood flow to the heart muscle. It may cause chest discomfort, shortness of breath, or other cardiac symptoms.",
        prevention:
          "Maintain a healthy diet and exercise regularly. Avoid smoking. Control blood pressure, cholesterol, blood sugar, and other cardiovascular risk factors.",
        tips: "Medical evaluation may include an ECG, blood tests, stress testing, or coronary imaging. Seek emergency care for severe or persistent chest pain.",
      },

      {
        id: "kidney",
        title: "Kidney",
        subtitle: "Human Kidney",
        image: "https://res.cloudinary.com/dk2novgh2/image/upload/v1786191265/WhatsApp_Image_2026-08-08_at_5.43.55_PM_oreght.jpg",
        wireframe: "https://res.cloudinary.com/dk2novgh2/image/upload/v1786190763/WhatsApp_Image_2026-08-08_at_5.33.41_PM_zobdyg.jpg",
        category: "Kidney Conditions",
        location: "Kidney",
        type: "Small Renal Calculus (Kidney Stone)",
        description:
          "A small renal calculus is a solid mineral deposit that forms inside the kidney. It may cause pain, blood in the urine, or urinary discomfort and can be identified through ultrasound or CT imaging.",
        prevention:
          "Drink adequate water. Limit excessive salt intake. Maintain a balanced diet and follow medical advice if prone to recurrent kidney stones.",
        tips: "Stay hydrated unless medically restricted. Seek medical attention if severe pain, fever, vomiting, or difficulty urinating occurs.",

      },

      {
        id: "lungs",
        title: "Lungs",
        subtitle: "Respiratory Organ",
        image: "https://res.cloudinary.com/dk2novgh2/image/upload/v1786175476/WhatsApp_Image_2026-08-08_at_13.20.21_ywtahi.jpg",
        wireframe: "https://res.cloudinary.com/dk2novgh2/image/upload/v1786191035/WhatsApp_Image_2026-08-08_at_5.33.42_PM_2_thcbpo.jpg",
        category: "Lung Conditions",
        location: "Lung",
        type: "Pulmonary Tumor",
        description:
          "A pulmonary tumor is an abnormal growth of cells within the lung. A light yellowish or irregular mass may represent different types of lesions and requires imaging and pathological evaluation for an accurate diagnosis.",
        prevention:
          "Avoid smoking and secondhand smoke. Reduce exposure to occupational or environmental lung hazards. Maintain regular health checkups when risk factors are present.",
        tips: "Chest imaging such as CT may help evaluate the lesion. A biopsy may be required to determine whether the growth is benign or malignant.",
      },

      {
        id: "liver",
        title: "Liver",
        subtitle: "Digestive Organ",
        image: "https://res.cloudinary.com/dk2novgh2/image/upload/v1786175476/WhatsApp_Image_2026-08-08_at_13.20.20_2_ojqhwc.jpg",
        wireframe: "https://res.cloudinary.com/dk2novgh2/image/upload/v1786190762/WhatsApp_Image_2026-08-08_at_5.33.43_PM_hiqjkg.jpg",
        category: "Liver Conditions",
        location: "Liver",
        type: "Hepatic Tumor",
        description:
          "A hepatic tumor is an abnormal growth within the liver. Yellowish-tan clusters or irregular growths may represent various liver lesions and cannot be definitively classified by appearance alone.",
        prevention:
          "Avoid excessive alcohol consumption. Maintain a healthy weight and reduce the risk of viral hepatitis through appropriate vaccination and preventive measures.",
        tips: "Ultrasound, CT, or MRI can help evaluate liver lesions. Further blood tests or biopsy may be required depending on the findings.",
      },
    ],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { doctor, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [currentBanner, setCurrentBanner] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [menuVisible, setMenuVisible] = useState(false);
  const [langVisible, setLangVisible] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentBanner + 1) % BANNERS.length;
      setCurrentBanner(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [currentBanner]);

  const filteredSections = DISEASE_SECTIONS.map((section) => ({
    ...section,
    items:
      activeFilter === "All"
        ? section.items
        : section.items.filter((i) => i.category === activeFilter),
  })).filter((s) => s.items.length > 0);


  const displaySections = search
    ? DISEASE_SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter(
        (i) =>
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.subtitle.toLowerCase().includes(search.toLowerCase()),
      ),
    })).filter((s) => s.items.length > 0)
    : filteredSections;

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

  return (
    <SafeAreaView style={styles.safe}>
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
      ></Modal>
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
                  source={{
                    uri:
                      doctor?.profilePhoto ||
                      "https://ui-avatars.com/api/?name=Doctor",
                  }}
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
                  action: () => setMenuVisible(false),
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
                onPress={async () => {
                  await setAppLanguage(l.code);
                  setLangVisible(false);
                }}
              >
                <Text style={styles.langItemText}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View>
          <FlatList
            ref={flatListRef}
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id}
            onMomentumScrollEnd={(e) =>
              setCurrentBanner(
                Math.round(e.nativeEvent.contentOffset.x / width),
              )
            }
            renderItem={({ item }) => (
              <View style={styles.bannerContainer}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.bannerImg}
                  resizeMode="cover"
                />

                {/* Dark Overlay */}
                <View style={styles.bannerDarkOverlay} />

                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>

                  <Text style={styles.bannerSub}>{item.subtitle}</Text>

                  <TouchableOpacity style={styles.tryBtn}>
                    <Text style={styles.tryBtnText}>{t("tryNow")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.dots}>
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, currentBanner === i && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Feather name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t("search")}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Scan Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 14 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingRight: 16,
          }}
        >
          {[
            {
              label: "X-Ray",
              desc: "Bone Analysis",
              color: COLORS.primary,
              icon: "☢",
            },
            {
              label: "MRI Scan",
              desc: "Soft Tissue",
              color: "#9B59B6",
              icon: "⊛",
            },
            {
              label: "CT Scan",
              desc: "3D Imaging",
              color: "#E67E22",
              icon: "⊕",
            },
            {
              label: "Ultrasound",
              desc: "Live Scan",
              color: "#16A085",
              icon: "◉",
            },
          ].map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.scanTab, { backgroundColor: tab.color }]}
            >
              <Text style={styles.scanTabIcon}>{tab.icon}</Text>

              <Text style={styles.scanTabDesc}>{tab.desc}</Text>

              <Text style={styles.scanTabText}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 14 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 4,
          }}
        >
          {[
            {
              label: "All",
              type: "ion",
            },
            {
              label: "Fractures",
              type: "material",
            },
            {
              label: "Tumor",
              type: "material",
            },
            {
              label: "Clotting",
              type: "material",
            },
            {
              label: "3D",
              type: "material",
            },
          ].map((f) => (
            <TouchableOpacity
              key={f.label}
              style={[
                styles.filterChip,
                activeFilter === f.label && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f.label)}
            >
              {f.type === "ion" ? (
                <Ionicons
                  name={f.icon}
                  size={16}
                  color={activeFilter === f.label ? "#fff" : COLORS.primary}
                  style={{ marginRight: 6 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name={f.icon}
                  size={16}
                  color={activeFilter === f.label ? "#fff" : COLORS.primary}
                  style={{ marginRight: 6 }}
                />
              )}

              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === f.label && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Sections */}
        {displaySections.map((section) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>{section.title}</Text>

                <Text style={styles.sectionSubtitle}>
                  Explore Medical Cases
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.listAll}>List All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.diseaseCard}
                  onPress={() =>
                    router.push({
                      pathname: `/disease/${item.id}`,
                      params: { data: JSON.stringify(item) },
                    })
                  }
                >
                  <View style={styles.cardImageWrap}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />

                    <View
                      style={[
                        styles.cardTag,
                        { backgroundColor: section.tagColor },
                      ]}
                    >
                      <Text style={styles.cardTagText}>{section.tag}</Text>
                    </View>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.title}</Text>

                    <Text style={styles.cardSub}>{item.subtitle}</Text>

                    <View style={styles.cardMeta}>
                      <Ionicons
                        name="location-outline"
                        size={12}
                        color="#64748B"
                      />

                      <Text style={styles.cardMetaText}>{item.location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
      {/* scanner */}

      <View
        style={{
          position: "absolute",
          right: 10,
          bottom: 20,
        }}
      >
        <TouchableOpacity
          style={styles.scannerFab}
          onPress={() => router.push("/scanner")}
        >
          <MaterialCommunityIcons
            name="line-scan"
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  cardMetaText: {
    marginLeft: 4,
    fontSize: 11,
    color: "#64748B",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },

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

    overflow: "hidden",   // add this
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
  bannerImg: {
    width: "100%",
    height: "100%",
  },
  bannerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  bannerSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 3 },
  tryBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 7,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  tryBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    paddingTop: 10,
    paddingBottom: 6,

    gap: 6,

    backgroundColor: "#F8FAFC",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,

    backgroundColor: "#CBD5E1",
  },

  dotActive: {
    width: 22,
    height: 7,

    borderRadius: 10,

    backgroundColor: COLORS.primary,
  },

  scanTab: {
    width: 135,
    height: 110,

    marginRight: 12,

    borderRadius: 20,

    paddingHorizontal: 14,
    paddingVertical: 14,

    justifyContent: "space-between",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    elevation: 0,
  },
  scanTabIcon: { fontSize: 18, color: "#fff" },
  scanTabText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: "#ddd",
  },
  filterPillActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 13, color: "#555", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    marginHorizontal: 16,
    marginTop: 2,

    paddingHorizontal: 16,
    height: 54,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: "#222" },
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111" },
  listAll: { fontSize: 13, color: COLORS.primary, fontWeight: "700" },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  cardImageWrap: { position: "relative" },
  cardImage: { width: "100%", height: 140 },
  cardTag: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardTagText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  cardInfo: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#111" },
  cardSub: { fontSize: 11, color: "#888", marginTop: 2 },
  cardExplore: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 8,
  },
  bannerContainer: {
    width: width - 24,
    height: 260,

    marginHorizontal: 12,
    marginTop: 16,

    borderRadius: 24,
    overflow: "hidden",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#EEF2F7",

    elevation: 0,
  },
  bannerDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  bannerOverlay: {
    position: "absolute",

    left: 16,
    right: 16,
    bottom: 16,

    backgroundColor: "rgba(131, 131, 131, 0)",

    borderRadius: 18,

    padding: 16,

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  scannerFab: {
    position: "absolute",
    right: 20,
    bottom: 100, // tab bar ke upar

    width: 65,
    height: 65,
    borderRadius: 32.5,

    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",

    zIndex: 9999,
    elevation: 20, // Android

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },


  scanTabDesc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 18,
    paddingVertical: 12,

    marginRight: 10,

    borderRadius: 16,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#EEF2F7",
  },

  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,

    transform: [{ scale: 1.02 }],
  },

  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  filterIconActive: {
    color: "#fff",
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  filterChipTextActive: {
    color: "#fff",
  },

  diseaseCard: {
    width: 180,

    marginRight: 12,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
});