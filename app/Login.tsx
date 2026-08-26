import { COLORS, SPACING } from "@/constants/theme";
import { authService } from "@/services/authService";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme() ?? "light";
  const colors = COLORS[colorScheme];

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password tidak boleh kosong.");
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await authService.register(email, password);
        Alert.alert(
          "Registrasi Berhasil",
          "Akun berhasil dibuat! Silakan masuk.",
          [{ text: "OK", onPress: () => setIsRegister(false) }],
        );
      } else {
        await authService.login(email, password);
        router.replace("/Home" as any);
      }
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View
        style={{
          paddingTop: 80,
          paddingHorizontal: SPACING.lg + 4,
          paddingBottom: SPACING.xl,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <View style={{ zIndex: 2 }}>
          <Text
            variant="headlineMedium"
            style={{
              color: colorScheme === "dark" ? colors.textPrimary : "#FFFFFF",
              fontWeight: "bold",
              marginBottom: 6,
            }}
          >
            {isRegister ? "Buat Akun Baru" : "Selamat Datang!"}
          </Text>
          <Text
            style={{
              color:
                colorScheme === "dark"
                  ? colors.textSecondary
                  : "rgba(255, 255, 255, 0.85)",
              fontSize: 15,
            }}
          >
            {isRegister
              ? "Daftar untuk mulai mencatat aktivitas harianmu."
              : "Masuk untuk mengelola catatanmu dengan mudah."}
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: colors.card,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: SPACING.lg,
              paddingTop: SPACING.xl + 4,
              paddingBottom: SPACING.xl + 8,
            }}
          >
            <View style={{ gap: SPACING.md + 2 }}>
              <TextInput
                label="Email"
                placeholder="nama@domain.com"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.textPrimary}
                placeholderTextColor={colors.textSecondary}
                left={
                  <TextInput.Icon icon="email-outline" color={colors.primary} />
                }
                style={{ backgroundColor: colors.card }}
              />

              <TextInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.textPrimary}
                placeholderTextColor={colors.textSecondary}
                left={
                  <TextInput.Icon icon="lock-outline" color={colors.primary} />
                }
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    color={colors.textSecondary}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={{ backgroundColor: colors.card }}
              />

              <Button
                mode="contained"
                onPress={handleAuth}
                loading={loading}
                disabled={loading}
                style={{
                  borderRadius: 16,
                  paddingVertical: 6,
                  backgroundColor: colors.secondary,
                  marginTop: SPACING.sm,
                }}
                labelStyle={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#1E293B",
                }}
              >
                {isRegister ? "Daftar" : "Masuk"}
              </Button>
            </View>

            <TouchableOpacity
              style={{ marginTop: SPACING.xl, alignItems: "center" }}
              activeOpacity={0.7}
              onPress={() => setIsRegister(!isRegister)}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
                <Text style={{ fontWeight: "bold", color: colors.primary }}>
                  {isRegister ? "Masuk" : "Daftar"}
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
