import React from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NoteModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  title: string;
  setTitle: (text: string) => void;
  content: string;
  setContent: (text: string) => void;
  onSave: () => void;
  onDelete?: () => void;
}

export default function NoteModal({
  visible,
  onClose,
  isEditing,
  title,
  setTitle,
  content,
  setContent,
  onSave,
  onDelete,
}: NoteModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 24,
            height: "85%",
            borderWidth: 1,
            borderColor: "#E4E4E7",
          }}
        >
          {/* Header Modal */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#E4E4E7",
              paddingBottom: 12,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Text
                style={{ color: "#71717A", fontSize: 14, fontWeight: "500" }}
              >
                Batal
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#09090B" }}>
              {isEditing ? "Ubah Catatan" : "Catatan Baru"}
            </Text>
            {isEditing && onDelete ? (
              <TouchableOpacity onPress={onDelete}>
                <Text
                  style={{ color: "#EF4444", fontSize: 14, fontWeight: "500" }}
                >
                  Hapus
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
          </View>

          {/* Input Form */}
          <TextInput
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#09090B",
              borderBottomWidth: 1,
              borderBottomColor: "#E4E4E7",
              paddingBottom: 10,
              marginBottom: 16,
            }}
            placeholder="Judul Catatan..."
            placeholderTextColor="#A1A1AA"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={{
              fontSize: 14,
              color: "#09090B",
              textAlignVertical: "top",
              height: 220,
              marginBottom: 20,
            }}
            placeholder="Tulis catatanmu di sini..."
            placeholderTextColor="#A1A1AA"
            multiline
            value={content}
            onChangeText={setContent}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#09090B",
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: "center",
            }}
            onPress={onSave}
          >
            <Text style={{ color: "#FAFAFA", fontSize: 14, fontWeight: "500" }}>
              Simpan Catatan
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}