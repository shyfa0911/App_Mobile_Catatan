import React, { useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Registrasi sukses! Silakan masuk.");
        setIsRegister(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}
      >
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "600",
              color: "#09090B",
              letterSpacing: -0.5,
              marginBottom: 6,
            }}
          >
            {isRegister ? "Buat Akun Baru" : "Masuk ke Aplikasi"}
          </Text>
          <Text style={{ fontSize: 14, color: "#71717A" }}>
            {isRegister
              ? "Daftar untuk mulai mencatat aktivitas Anda."
              : "Kelola catatan harian Anda dengan mudah."}
          </Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: "#09090B",
              marginBottom: 6,
            }}
          >
            Email
          </Text>
          <TextInput
            style={{
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E4E4E7",
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 14,
              color: "#09090B",
            }}
            placeholder="nama@domain.com"
            placeholderTextColor="#A1A1AA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: "#09090B",
              marginBottom: 6,
            }}
          >
            Password
          </Text>
          <TextInput
            style={{
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E4E4E7",
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 14,
              color: "#09090B",
            }}
            placeholder="••••••••"
            placeholderTextColor="#A1A1AA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#09090B",
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: "center",
          }}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FAFAFA" size="small" />
          ) : (
            <Text style={{ color: "#FAFAFA", fontSize: 14, fontWeight: "500" }}>
              {isRegister ? "Daftar" : "Masuk"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 20, alignItems: "center" }}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={{ color: "#71717A", fontSize: 13 }}>
            {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
            <Text style={{ fontWeight: "600", color: "#09090B" }}>
              {isRegister ? "Masuk" : "Daftar"}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
