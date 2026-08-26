import { COLORS, SPACING } from "@/constants/theme";
import { notesService } from "@/services/notesService";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, useColorScheme, View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NoteDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  // Deteksi tema perangkat (Light / Dark)
  const colorScheme = useColorScheme() ?? "light";
  const colors = COLORS[colorScheme];

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // State data catatan dari database
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // State untuk menampung input sementara saat mode edit
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  // Ambil detail catatan berdasarkan ID dari Supabase saat halaman dibuka
  useEffect(() => {
    if (params.id) {
      fetchNoteDetail(params.id);
    }
  }, [params.id]);

  const fetchNoteDetail = async (noteId: string) => {
    try {
      setLoading(true);
      const data = await notesService.getNoteById(noteId);
      if (data) {
        setTitle(data.title);
        setContent(data.content || "");
        setEditedTitle(data.title);
        setEditedContent(data.content || "");
      } else {
        Alert.alert("Error", "Catatan tidak ditemukan.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal memuat catatan.");
    } finally {
      setLoading(false);
    }
  };

  // Menyimpan Perubahan ke Supabase
  const handleSave = async () => {
    if (!editedTitle.trim()) {
      Alert.alert("Peringatan", "Judul catatan tidak boleh kosong!");
      return;
    }

    if (!params.id) return;

    try {
      setSaving(true);
      await notesService.updateNote(params.id, editedTitle, editedContent);

      // Update state lokal setelah berhasil
      setTitle(editedTitle);
      setContent(editedContent);
      setIsEditing(false);

      Alert.alert("Sukses", "Catatan berhasil diperbarui!");
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Gagal memperbarui catatan.");
    } finally {
      setSaving(false);
    }
  };

  // Membatalkan Mode Edit
  const handleCancelEdit = () => {
    setEditedTitle(title);
    setEditedContent(content);
    setIsEditing(false);
  };

  // Menghapus Catatan dari Supabase
  const handleDelete = () => {
    if (!params.id) return;

    Alert.alert("Hapus Catatan", "Yakin ingin menghapus catatan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            setSaving(true);
            await notesService.deleteNote(params.id);
            Alert.alert("Sukses", "Catatan telah dihapus", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (error: any) {
            Alert.alert("Gagal Menghapus", error.message);
            setSaving(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: isEditing ? "Edit Catatan" : "Detail Catatan",
          headerShown: true,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.textPrimary,
          headerRight: () =>
            !isEditing && !loading ? (
              <IconButton
                icon="pencil"
                size={22}
                iconColor={colors.textPrimary}
                onPress={() => setIsEditing(true)}
              />
            ) : null,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          padding: SPACING.lg,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: colors.card,
            elevation: 2,
            padding: 16,
          }}
        >
          {loading ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text style={{ color: colors.textSecondary }}>
                Memuat catatan...
              </Text>
            </View>
          ) : isEditing ? (
            /* Form Edit */
            <View style={{ gap: 16 }}>
              <TextInput
                label="Judul Catatan"
                value={editedTitle}
                onChangeText={setEditedTitle}
                mode="outlined"
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.textPrimary}
                placeholderTextColor={colors.textSecondary}
                style={{ backgroundColor: colors.card }}
                disabled={saving}
              />

              <TextInput
                label="Isi Catatan"
                value={editedContent}
                onChangeText={setEditedContent}
                mode="outlined"
                multiline
                numberOfLines={8}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.textPrimary}
                placeholderTextColor={colors.textSecondary}
                style={{ backgroundColor: colors.card, minHeight: 150 }}
                disabled={saving}
              />

              <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                <Button
                  mode="outlined"
                  onPress={handleCancelEdit}
                  disabled={saving}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    borderColor: colors.primary,
                  }}
                  textColor={colors.primary}
                >
                  Batal
                </Button>

                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={saving}
                  disabled={saving}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    backgroundColor: colors.secondary,
                  }}
                  textColor="#1E293B"
                >
                  Simpan
                </Button>
              </View>
            </View>
          ) : (
            /* Tampilan / Read-Only */
            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: colors.primary,
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                {title}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 24,
                  color: colors.textSecondary,
                  minHeight: 100,
                }}
              >
                {content || "(Tidak ada isi catatan)"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <IconButton
                  icon="delete-outline"
                  size={22}
                  iconColor="#FF6B6B"
                  onPress={handleDelete}
                  style={{ margin: 0 }}
                />
              </View>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}
