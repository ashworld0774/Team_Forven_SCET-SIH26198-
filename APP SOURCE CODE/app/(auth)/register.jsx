import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as DocumentPicker from "expo-document-picker";
import api from "../../constants/api";
import { COLORS } from "../../constants/colors";

const SPECIALITIES = [
  "Cardiology",
  "Neurology",
  "Oncology",
  "Radiology",
  "Other",
];

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "Cardiology",
    specialityCustom: "",
    registrationNumber: "",
  });
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const pickCertificate = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });
    if (!result.canceled) setCertificate(result.assets[0]);
  };

 const handleRegister = async () => {
  if (
    !form.name ||
    !form.email ||
    !form.password ||
    !form.registrationNumber ||
    !certificate
  ) {
    Alert.alert("Error", "Please fill all fields and upload certificate");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("speciality", form.speciality);
    formData.append("specialityCustom", form.specialityCustom || "");
    formData.append("registrationNumber", form.registrationNumber);

    formData.append("certificate", {
      uri: certificate.uri,
      name: certificate.name || "certificate.pdf",
      type: certificate.mimeType || "application/pdf",
    });

    const res = await api.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    Alert.alert(
      "Success",
      "Application submitted! Awaiting admin approval.",
      [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
    );
  } catch (err) {
    console.log("REGISTER ERROR:", err.response?.data || err);

    Alert.alert(
      "Error",
      err.response?.data?.message || "Registration failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (
   <KeyboardAvoidingView
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <StatusBar
  barStyle="dark-content"
  backgroundColor={COLORS.primaryLight}
/>

{/* Fixed Header */}
<ScrollView
  contentContainerStyle={styles.scroll}
  showsVerticalScrollIndicator={false}
>

<View style={styles.header}>
  <View style={styles.logoBox}>
    <Image
      source={{
        uri: "https://res.cloudinary.com/dk2novgh2/image/upload/v1780560468/logo_xoaxud-removebg-preview_yby4yt.png",
      }}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>

  <View>
    <Text style={styles.brand}>AAKRITI</Text>
    <Text style={styles.subtitle}>
      {t("doctorManagementSystem")}
    </Text>
  </View>
</View>

<View style={styles.form}>

<Text style={styles.title}>
  {t("welcomeDoctor")}
</Text>

<Text style={styles.desc}>
  {t("registerSubtitle")}
</Text>
          {/* Full Name */}
          
          <Text style={styles.label}>{t("name")}</Text>
          <View style={styles.inputWrap}>
          <Ionicons
  name="person-outline"
  size={20}
  color={COLORS.primary}
  style={styles.inputIcon}
/>
            <TextInput
              style={styles.input}
              placeholder={t("enterFullName")}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>{t("email")}</Text>
          <View style={styles.inputWrap}>
           <Ionicons
  name="mail-outline"
  size={20}
  color={COLORS.primary}
  style={styles.inputIcon}
/>
            <TextInput
              style={styles.input}
              placeholder={t("enterEmail")}
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>{t("password")}</Text>
          <View style={styles.inputWrap}>
          <Ionicons
  name="lock-closed-outline"
  size={20}
  color={COLORS.primary}
  style={styles.inputIcon}
/>
            <TextInput
              style={styles.input}
              placeholder={t("minCharacters")}
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              secureTextEntry={!showPass}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
           <Ionicons
  name={
    showPass
      ? 'eye-outline'
      : 'eye-off-outline'
  }
  size={20}
  color="#666"
/>
            </TouchableOpacity>
          </View>

          {/* Speciality */}
          <Text style={styles.label}>{t("speciality")}</Text>
          <TouchableOpacity
            style={styles.inputWrap}
            onPress={() => setShowDropdown(!showDropdown)}
          >
        <MaterialCommunityIcons
  name="hospital-building"
  size={20}
  color={COLORS.primary}
  style={styles.inputIcon}
/>
            <Text style={[styles.input, { paddingTop: 2, color: "#222" }]}>
              {form.speciality}
            </Text>
            <Text style={{ color: COLORS.primary, fontSize: 16 }}>▼</Text>
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdownList}>
              {SPECIALITIES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setForm({ ...form, speciality: s });
                    setShowDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      form.speciality === s && {
                        color: COLORS.primary,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {form.speciality === "Other" && (
            <View style={[styles.inputWrap, { marginTop: 8 }]}>
          <Ionicons
  name="create-outline"
  size={20}
  color={COLORS.primary}
  style={styles.inputIcon}
/>
              <TextInput
                style={styles.input}
                placeholder={t("specifySpeciality")}
                value={form.specialityCustom}
                onChangeText={(v) => setForm({ ...form, specialityCustom: v })}
                placeholderTextColor="#aaa"
              />
            </View>
          )}

          {/* Reg Number */}
          <Text style={styles.label}>{t("regNumber")}</Text>
          <View style={styles.inputWrap}>
           <Ionicons
  name="document-text-outline"
  size={20}
  color={COLORS.primary}
  style={styles.inputIcon}
/>
            <TextInput
              style={styles.input}
              placeholder={t("mciRegNo")}
              value={form.registrationNumber}
              onChangeText={(v) => setForm({ ...form, registrationNumber: v })}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Certificate */}
          <Text style={styles.label}>{t("certificate")}</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickCertificate}>
         <Ionicons
  name="cloud-upload-outline"
  size={22}
  color={COLORS.primary}
  style={{ marginRight: 10 }}
/>
            <Text style={styles.uploadText}>
              {certificate ? `✓ ${certificate.name}` : t("uploadCertificate")}
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
        <TouchableOpacity
  style={styles.btn}
  onPress={handleRegister}
  disabled={loading}
>
  <Text style={styles.btnText}>
    {loading ? t("submitting") : t("submit")}
  </Text>
</TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#F8FAFC",
},
scroll: {
  flexGrow: 1,
  padding: 24,
},
header: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 40,
  marginBottom: 24,
},
logoBox: {
  width: 60,
  height: 60,
  borderRadius: 18,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 14,

  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 5,
},
logo: {
  width: 42,
  height: 42,
},
brand: {
  fontSize: 24,
  fontWeight: "800",
  color: "#1E9E74",
  letterSpacing: 0.5,
},
headerLogo: {
  width: 42,
  height: 42,
},
headerTitle: {
  fontSize: 22,
  fontWeight: "800",
  color: COLORS.primary,
  marginLeft: 8,
},
subtitle: {
  fontSize: 13,
  color: "#64748B",
  marginTop: 2,
},
title: {
  fontSize: 28,
  fontWeight: "800",
  color: "#0F172A",
},

desc: {
  color: "#64748B",
  marginTop: 6,
  marginBottom: 24,
},
 backBtn: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 4,

  elevation: 4,
},
  backText: { fontSize: 18, color: COLORS.primary, fontWeight: "bold" },

 pageTitle: {
  fontSize: 32,
  fontWeight: "800",
  color: "#111827",
  marginTop: 20,
},
pageSub: {
  fontSize: 15,
  color: "#6B7280",
  marginTop: 6,
  marginBottom: 30,
},
 form: {
  backgroundColor: "#FFFFFF",
  borderRadius: 28,
  padding: 24,

  borderWidth: 1,
  borderColor: "#E5E7EB",

  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 20,
  shadowOffset: {
    width: 0,
    height: 10,
  },

  elevation: 5,
},
label: {
  fontSize: 14,
  fontWeight: "700",
  color: "#1E9E74",
  marginBottom: 8,
},
 inputWrap: {
  flexDirection: "row",
  alignItems: "center",

  backgroundColor: "#F8FAFC",

  borderWidth: 1,
  borderColor: "#E5E7EB",

  borderRadius: 16,

  paddingHorizontal: 16,

  minHeight: 58,

  marginBottom: 18,
},
inputIcon: {
  marginRight: 10,
},
input: {
  flex: 1,
  fontSize: 15,
  color: "#111827",
},
  eyeIcon: { fontSize: 18 },
dropdownList: {
  backgroundColor: "#fff",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  marginTop: -8,
  marginBottom: 18,
  overflow: "hidden",
},
 dropdownItem: {
  paddingVertical: 14,
  paddingHorizontal: 18,
  borderBottomWidth: 1,
  borderBottomColor: "#F3F4F6",
},
dropdownText: {
  fontSize: 15,
  color: "#374151",
},

  uploadBtn: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "#F0FDF4",

  borderWidth: 1.5,
  borderColor: COLORS.primary,
  borderStyle: "dashed",

  borderRadius: 16,

  minHeight: 60,

  marginBottom: 20,
},
  uploadIcon: { fontSize: 20, marginRight: 10 },
  uploadText: {
  color: COLORS.primary,
  fontWeight: "700",
  fontSize: 15,
},
btn: {
  height: 58,

  borderRadius: 16,

  backgroundColor: COLORS.primary,

  justifyContent: "center",
  alignItems: "center",

  marginTop: 10,

  shadowColor: COLORS.primary,
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.2,
  shadowRadius: 10,

  elevation: 5,
},
btnText: {
  color: "#fff",
  fontSize: 17,
  fontWeight: "800",
},

link: {
  textAlign: "center",
  marginTop: 16,
  color: "#6B7280",
},

linkBold: {
  color: COLORS.primary,
  fontWeight: "800",
},
});
