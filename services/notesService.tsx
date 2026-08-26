import { supabase } from "@/utils/supabase";

export const notesService = {
  // Read (Ambil semua catatan berdasarkan user yang login)
  async getNotes(userId: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Read (Ambil details catatan berdasarkan id)
  async getNoteById(id: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create (Tambah catatan baru)
  async createNote(userId: string, title: string, content: string) {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ user_id: userId, title, content }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update (Ubah catatan berdasarkan ID)
  async updateNote(id: string, title: string, content: string) {
    const { data, error } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete (Hapus catatan berdasarkan ID)
  async deleteNote(id: string) {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
