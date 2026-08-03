import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NoteModal from "../components/pageComponent/noteModals";
import { useAuth } from "../hooks/useAuth";
import { useNotes } from "../hooks/useNotes";

export default function App() {
  const { user, loading: authLoading, login, register, logout } = useAuth();
  const {
    notes,
    loading: notesLoading,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const [isRegister, setIsRegister] = useState(false);

  // Form Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoadingAction, setAuthLoadingAction] = useState(false);

  // State Modal Note
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    setAuthLoadingAction(true);
    try {
      if (isRegister) {
        await register(email, password);
        alert("Registrasi sukses! Silakan masuk.");
        setIsRegister(false);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAuthLoadingAction(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedNote(null);
    setNoteTitle("");
    setNoteContent("");
    setModalVisible(true);
  };

  const handleOpenEditModal = (item: any) => {
    setSelectedNote(item);
    setNoteTitle(item.title);
    setNoteContent(item.content);
    setModalVisible(true);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      alert("Judul catatan tidak boleh kosong!");
      return;
    }

    if (selectedNote) {
      await updateNote(selectedNote.id, noteTitle, noteContent);
    } else {
      await addNote(noteTitle, noteContent);
    }

    setModalVisible(false);
  };

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAFAFA",
        }}
      >
        <ActivityIndicator size="large" color="#09090B" />
      </View>
    );
  }

  if (!user) {
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
            disabled={authLoadingAction}
          >
            {authLoadingAction ? (
              <ActivityIndicator color="#FAFAFA" size="small" />
            ) : (
              <Text
                style={{ color: "#FAFAFA", fontSize: 14, fontWeight: "500" }}
              >
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header Home */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E4E4E7",
          backgroundColor: "#FFFFFF",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#09090B",
              letterSpacing: -0.3,
            }}
          >
            Catatan
          </Text>
          <Text style={{ fontSize: 12, color: "#71717A", marginTop: 2 }}>
            {notes.length} total catatan
          </Text>
        </View>
        <TouchableOpacity
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#E4E4E7",
            borderRadius: 6,
          }}
          onPress={logout}
        >
          <Text style={{ color: "#EF4444", fontSize: 12, fontWeight: "500" }}>
            Keluar
          </Text>
        </TouchableOpacity>
      </View>

      {/* List Catatan */}
      {notesLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="small" color="#09090B" />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#E4E4E7",
              }}
              onPress={() => handleOpenEditModal(item)}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#09090B",
                  marginBottom: 4,
                }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#71717A",
                  marginBottom: 8,
                  lineHeight: 18,
                }}
                numberOfLines={2}
              >
                {item.content}
              </Text>
              <Text style={{ fontSize: 11, color: "#A1A1AA" }}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating Action Button (+) */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#09090B",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleOpenCreateModal}
      >
        <Text style={{ color: "#FAFAFA", fontSize: 28, marginTop: -2 }}>+</Text>
      </TouchableOpacity>

      {/* Komponen Modal Create & Edit yang Dipisah */}
      <NoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isEditing={selectedNote !== null}
        title={noteTitle}
        setTitle={setNoteTitle}
        content={noteContent}
        setContent={setNoteContent}
        onSave={handleSaveNote}
        onDelete={async () => {
          await deleteNote(selectedNote.id);
          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
