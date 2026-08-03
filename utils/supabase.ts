// src/utils/supabase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// 1. Definisikan struktur tabel 'notes' dalam bentuk Tipe Data TypeScript
export interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

// 2. Definisikan skema database global untuk Supabase Client
export interface Database {
  public: {
    Tables: {
      notes: {
        Row: Note; // Struktur saat data dibaca (SELECT)
        Insert: Omit<Note, "id" | "created_at">; // Struktur saat data ditambah (id & createdat otomatis dari database)
        Update: Partial<Omit<Note, "id" | "created_at">>; // Struktur saat data diubah
      };
    };
  };
}

// 3. Ambil variabel lingkungan dari file .env milik Expo
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variabel lingkungan Supabase (URL/KEY) belum dikonfigurasi di file .env!",
  );
}

// 4. Inisialisasi klien Supabase dengan proteksi tipe data <Database>
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
