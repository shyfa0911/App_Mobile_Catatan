// import { useEffect, useState } from "react";
// import { Note, supabase } from "../utils/supabase";

// export function useNotes() {
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);

//   // Cek User/Session
//   useEffect(() => {
//     const checkUserAndFetch = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (user) {
//         setUserId(user.id);
//         fetchNotes();
//       }
//     };

//     checkUserAndFetch();

//     // Listen kalau ada perubahan status auth (login/logout)
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         if (session?.user) {
//           setUserId(session.user.id);
//           fetchNotes();
//         } else {
//           setUserId(null);
//           setNotes([]);
//         }
//       },
//     );

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   //fetch data notes dan nyalakan loading sbelum data berhadil di fetch kemudian setelah tidak ada error dan datanya ada loadingnya diberhentikan dan menampilkan data dari supabbase
//   const fetchNotes = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("notes")
//       .select("*")

//       .order("created_at", { ascending: false });

//     if (!error && data) {
//       setNotes(data as Note[]);
//     }
//     setLoading(false);
//   };

//   //tambah notes baru sesuai is user
//   const addNote = async (title: string, content: string) => {
//     if (!userId) return;

//     const { error } = await supabase
//       .from("notes")
//       .insert([{ title, content, user_id: userId }] as any);

//     if (!error) fetchNotes();
//   };

//   // 4. Update / Edit notes
//   const updateNote = async (id: string, title: string, content: string) => {
//     if (!userId) return;

//     const { error } = await (supabase.from("notes") as any)
//       .from("notes")
//       .update({ title, content })
//       .eq("id", id);

//     if (!error) fetchNotes();
//   };

//   //menghapus notes
//   const deleteNote = async (id: string) => {
//     const { error } = await supabase.from("notes").delete().eq("id", id);
//     if (!error) fetchNotes();
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   return { notes, loading, fetchNotes, addNote, deleteNote };
// }
import { useCallback, useEffect, useState } from "react";
import { Note, supabase } from "../utils/supabase";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Cek User/Session
  useEffect(() => {
    const checkUserAndFetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchNotes(user.id);
      }
    };

    checkUserAndFetch();

    // Listen kalau ada perubahan status auth (login/logout)
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchNotes(session.user.id);
      } else {
        setUserId(null);
        setNotes([]);
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  // Fetch data notes berdasarkan user yang sedang login
  const fetchNotes = useCallback(
    async (currentUserId?: string) => {
      const activeUserId = currentUserId || userId;
      if (!activeUserId) {
        setNotes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await (supabase.from("notes") as any)
        .select("*")
        .eq("user_id", activeUserId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotes(data as Note[]);
      }
      setLoading(false);
    },
    [userId],
  );

  // Tambah notes baru sesuai id user
  const addNote = async (title: string, content: string) => {
    if (!userId) return;

    const { error } = await (supabase.from("notes") as any).insert({
      title,
      content,
      user_id: userId,
    });

    if (!error) {
      fetchNotes();
    }
  };

  // Update / Edit notes
  const updateNote = async (id: number, title: string, content: string) => {
    if (!userId) return;

    const { error } = await (supabase.from("notes") as any)
      .update({ title, content })
      .eq("id", id);

    if (!error) {
      fetchNotes();
    }
  };

  // Menghapus notes
  const deleteNote = async (id: number) => {
    const { error } = await (supabase.from("notes") as any)
      .delete()
      .eq("id", id);

    if (!error) {
      fetchNotes();
    }
  };

  return { notes, loading, fetchNotes, addNote, updateNote, deleteNote };
};