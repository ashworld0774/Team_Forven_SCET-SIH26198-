import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
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
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import api from "../../constants/api";
import { COLORS } from "../../constants/colors";

export default function LoginScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!name || !password) {
      Alert.alert(t("note"), "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        name,
        password,
      });

      await login(res.data.token, res.data.doctor);

      router.replace("/(tabs)/home");
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        backgroundColor="#F6FBF8"
        barStyle="dark-content"
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* LOGO */}

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

        {/* LOGIN CARD */}

        <View style={styles.card}>
          <Text style={styles.title}>{t("welcomeBack")}</Text>

          <Text style={styles.desc}>
            {t("loginSubtitle")}
          </Text>

          {/* NAME */}

          <Text style={styles.label}>{t("doctorName")}</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#1E9E74"
            />

            <TextInput
              style={styles.input}
              placeholder={t("enterName")}
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* PASSWORD */}

          <Text style={styles.label}>{t("password")}</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#1E9E74"
            />

            <TextInput
              style={styles.input}
              placeholder={t("enterPassword")}
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />

            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
            >
              <Ionicons
                name={
                  showPass
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? t("pleaseWait") : t("login")}
            </Text>
          </TouchableOpacity>

          {/* DIVIDER */}

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* GOOGLE */}

          <TouchableOpacity style={styles.googleBtn}>
            <Text style={styles.googleIcon}>G</Text>

            <Text style={styles.googleText}>
              {t("continueGoogle")}
            </Text>
          </TouchableOpacity>

          {/* REGISTER */}

          <TouchableOpacity
            onPress={() =>
              router.push("/(auth)/register")
            }
          >
            <Text style={styles.registerText}>
              {t("dontHaveAccount")}{" "}
              <Text style={styles.registerBold}>
                {t("register")}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

header: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 40,
  marginBottom: 24,
},

  container: {
    flex: 1,
    backgroundColor: "#F6FBF8",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
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
 subtitle: {
  fontSize: 13,
  color: "#64748B",
  marginTop: 2,
},


  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
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

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E9E74",
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 18,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: "#0F172A",
    fontSize: 15,
  },

  loginBtn: {
    height: 58,
    borderRadius: 16,
    backgroundColor: "#1E9E74",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  or: {
    marginHorizontal: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },

  googleBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },

  googleIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4285F4",
  },

  googleText: {
    color: "#475569",
    fontWeight: "600",
  },

  registerText: {
    textAlign: "center",
    color: "#64748B",
  },

  registerBold: {
    color: "#1E9E74",
    fontWeight: "700",
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
});