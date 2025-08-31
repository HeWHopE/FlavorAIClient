import { CreateNoteDto, NoteDto, UpdateNoteDto } from "@/models/note";
import { API_URL, LOCAL_STORAGE_TOKEN } from "../../api";

// --------------------
// Notes
// --------------------

export const createNote = async (
  createNoteDto: CreateNoteDto
): Promise<NoteDto> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(
    `${API_URL}/recipes/${createNoteDto.recipeId}/notes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createNoteDto),
    }
  );

  if (!response.ok) throw new Error("Failed to create note");

  return await response.json();
};

export const updateNote = async (
  noteId: number,
  updateNoteDto: UpdateNoteDto
): Promise<NoteDto> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_URL}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateNoteDto),
  });

  if (!response.ok) throw new Error(`Failed to update note with ID ${noteId}`);

  return await response.json();
};

export const deleteNote = async (noteId: number) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Failed to delete note with ID ${noteId}`);

  return await response.json();
};

export const getNotesForRecipe = async (
  userId: number,
  recipeId: number
): Promise<NoteDto[]> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(
    `${API_URL}/recipes/${recipeId}/notes/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok)
    throw new Error(
      `Failed to fetch notes for recipe ${recipeId} and user ${userId}`
    );

  return await response.json();
};
