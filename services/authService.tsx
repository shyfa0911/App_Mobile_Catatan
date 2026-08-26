import { supabase } from "@/utils/supabase";

export const authService = {
  // Login
  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });
    if (error) throw error;
    return data;
  },

  // Register
  async register(email: string, pass: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
    });
    if (error) throw error;
    return data;
  },

  // Logout / Get Session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};
