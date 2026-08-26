import { COLORS, SPACING } from "@/constants/theme";
import { authService } from "@/services/authService";
import { notesService } from "@/services/notesService";
import { Notes } from "@/types/notes";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, View, useColorScheme } from "react-native";
import { Card, FAB, IconButton, Searchbar, Text } from "react-native-paper";

export default function HomePage() {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  // Deteksi tema device
  const colorScheme = useColorScheme() ?? "light";
  const colors = COLORS[colorScheme];

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 3 && hour < 11) {
        return "Selamat Pagi";
      } else if (hour >= 11 && hour < 15) {
        return "Selamat Siang";
      } else if (hour >= 15 && hour < 18) {
        return "Selamat Sore";
      } else {
        return "Selamat Malam";
      }
    };

    setGreeting(getGreeting());
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const session = await authService.getSession();

      if (!session) {
        router.replace("/LoginScreen" as any);
        return;
      }

      const data = await notesService.getNotes(session.user.id);
      if (data) setNotes(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.content &&
        item.content.toLowerCase().includes(search.toLowerCase())),
  );

  const handleDelete = async (id: string) => {
    try {
      await notesService.deleteNote(id);
      setNotes((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      Alert.alert("Gagal Menghapus", error.message);
    }
  };

  // Fungsi ketika ikon menu / settings ditekan
  const handleOpenSettings = () => {
    Alert.alert(
      "Pengaturan",
      "Menu pengaturan atau sidebar akan segera dibuka.",
      [{ text: "OK" }],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          backgroundColor: colors.primary,
          paddingTop: 60,
          paddingHorizontal: SPACING.lg,
          paddingBottom: 30,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <View style={{ position: "relative", zIndex: 2 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {greeting}
            </Text>

            <IconButton
              icon="cog-outline"
              size={22}
              iconColor={colors.textPrimary}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                margin: 0,
              }}
              onPress={handleOpenSettings}
            />
          </View>

          <Text
            variant="headlineMedium"
            style={{
              color: colors.textPrimary,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            Catatan Saya
          </Text>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 15,
              marginBottom: 20,
            }}
          >
            Tulis & kelola catatanmu dengan mudah
          </Text>

          <Searchbar
            placeholder="Cari catatan..."
            value={search}
            onChangeText={setSearch}
            style={{
              borderRadius: 25,
              backgroundColor: colors.card,
            }}
            inputStyle={{ color: colors.textPrimary }}
            iconColor={colors.primary}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            top: -50,
            right: -50,
          }}
        />
      </View>

      {/* List Catatan */}
      <View style={{ flex: 1, paddingTop: 16 }}>
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchNotes}
          contentContainerStyle={{
            paddingHorizontal: SPACING.lg,
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            !loading ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 50,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colors.primary,
                    marginBottom: 8,
                  }}
                >
                  Belum ada catatan
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                  Tekan tombol + untuk membuat catatan baru
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Card
              onPress={() => router.push(`/list/id=${item.id}` as any)}
              style={{
                marginBottom: 14,
                borderRadius: 20,
                backgroundColor: colors.card,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
              }}
            >
              <Card.Content style={{ padding: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 4,
                  }}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.textPrimary,
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <IconButton
                      icon="pencil"
                      size={18}
                      containerColor={colors.border}
                      iconColor={colors.primary}
                      onPress={() =>
                        router.push(`/AddNotes?id=${item.id}` as any)
                      }
                    />
                    <IconButton
                      icon="delete"
                      size={18}
                      containerColor="#FFE5E5"
                      iconColor="#FF6B6B"
                      onPress={() =>
                        Alert.alert("Hapus Catatan", `Hapus "${item.title}"?`, [
                          { text: "Batal", style: "cancel" },
                          {
                            text: "Hapus",
                            onPress: () => handleDelete(item.id),
                            style: "destructive",
                          },
                        ])
                      }
                    />
                  </View>
                </View>

                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 13,
                    lineHeight: 18,
                    marginTop: 4,
                  }}
                  numberOfLines={2}
                >
                  {item.content}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 24,
          bottom: 30,
          backgroundColor: colors.secondary,
          borderRadius: 100,
        }}
        color="#1E293B"
        onPress={() => router.push(`/AddNotes` as any)}
      />
    </View>
  );
}
