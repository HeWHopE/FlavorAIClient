export interface CreateNoteDto {
  title: string;
  content: string;
  userId: number;
  recipeId: number;
}

export interface NoteDto {
  id: number;
  title: string;
  content: string;
  userId: number;
  recipeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateNoteDto {
  title?: string | null;
  content?: string | null;
}
