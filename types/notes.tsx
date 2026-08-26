export interface Notes {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
}

export type CreateNoteInput = {
  title: string;
  content?: string;
  user_id: string;
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
};