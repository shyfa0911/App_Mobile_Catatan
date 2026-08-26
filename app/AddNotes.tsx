import { COLORS, SPACING } from "@/constants/theme";
import { notesService } from "@/services/notesService";
import { supabase } from "@/utils/supabase";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, useColorScheme, View } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddNotes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditMode = !!id;
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  // Deteksi tema perangkat (Light / Dark)
  const colorScheme = useColorScheme() ?? "light";
  const colors = COLORS[colorScheme];

  // Jika mode edit, ambil data catatan berdasarkan ID saat halaman dibuka
  useEffect(() => {
    if (isEditMode && id) {
      fetchNoteDetail(id);
    }
  }, [id]);

  const fetchNoteDetail = async (noteId: string) => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setContent(data.content || "");
      }
    } catch (error: any) {
      Alert.alert("Error", "Gagal memuat detail catatan: " + error.message);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Peringatan", "Judul catatan tidak boleh kosong!");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/LoginScreen" as any);
        return;
      }

      if (isEditMode && id) {
        // Update menggunakan service
        await notesService.updateNote(id, title, content);
        Alert.alert("Berhasil", "Catatan berhasil diperbarui!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        // Create menggunakan service
        await notesService.createNote(session.user.id, title, content);
        Alert.alert("Berhasil", "Catatan baru berhasil disimpan!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;

    Alert.alert("Hapus Catatan", "Yakin ingin menghapus catatan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await notesService.deleteNote(id);
            router.back();
          } catch (error: any) {
            Alert.alert("Gagal Menghapus", error.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: isEditMode ? "Edit Catatan" : "Catatan Baru",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SPACING.lg,
          paddingTop: 20,
          paddingBottom: 100 + insets.bottom,
        }}
      >
        <Card
          style={{
            borderRadius: 20,
            backgroundColor: colors.card,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          }}
        >
          <Card.Content style={{ gap: 16 }}>
            <TextInput
              label="Judul Catatan"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.textPrimary}
              placeholderTextColor={colors.textSecondary}
              style={{ backgroundColor: colors.card }}
              disabled={fetching}
            />

            <TextInput
              label="Isi Catatan"
              placeholder="Tuliskan catatanmu di sini..."
              value={content}
              onChangeText={setContent}
              mode="outlined"
              multiline
              numberOfLines={10}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.textPrimary}
              placeholderTextColor={colors.textSecondary}
              style={{ backgroundColor: colors.card, minHeight: 180 }}
              disabled={fetching}
            />
          </Card.Content>
        </Card>

        {isEditMode && (
          <Button
            mode="outlined"
            onPress={handleDelete}
            loading={loading}
            disabled={loading || fetching}
            style={{
              marginTop: 20,
              borderRadius: 12,
              borderColor: "#FF6B6B",
            }}
            labelStyle={{ color: "#FF6B6B", fontWeight: "bold" }}
            icon="delete"
          >
            Hapus Catatan
          </Button>
        )}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.card,
          paddingHorizontal: SPACING.lg,
          paddingTop: 15,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading || fetching}
          style={{
            borderRadius: 12,
            paddingVertical: 6,
            backgroundColor: colors.secondary,
          }}
          labelStyle={{ fontWeight: "bold", fontSize: 16, color: "#1E293B" }}
        >
          {isEditMode ? "Perbarui Catatan" : "Simpan Catatan"}
        </Button>
      </View>
    </View>
  );
}
