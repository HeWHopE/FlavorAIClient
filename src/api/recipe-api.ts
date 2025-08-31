import { CreateRecipeDto, RecipeDto, UpdateRecipeDto } from "@/models/recipe";
import { API_URL, LOCAL_STORAGE_TOKEN } from "../../api";

// --------------------
// Recipes
// --------------------
export const createRecipe = async (
  createRecipeDto: CreateRecipeDto
): Promise<RecipeDto> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const formData = new FormData();
  formData.append("name", createRecipeDto.name);
  formData.append("description", createRecipeDto.description ?? "");
  formData.append("ingredients", JSON.stringify(createRecipeDto.ingredients));
  formData.append("instructions", createRecipeDto.instructions);

  if (createRecipeDto.image) {
    formData.append("image", createRecipeDto.image); // File object
  }

  const response = await fetch(`${API_URL}/recipes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type here! Let the browser set it
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to create recipe");

  return await response.json();
};

export const updateRecipe = async (
  id: number,
  updateRecipeDto: UpdateRecipeDto,
  imageFile?: File
) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const formData = new FormData();

  // Append all fields from updateRecipeDto
  Object.entries(updateRecipeDto).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // If ingredients is an array, convert to JSON string
      if (key === "ingredients" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData.append(key, value as any);
      }
    }
  });

  // Append image if provided
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, // Do NOT set Content-Type, browser will set multipart/form-data
    },
    body: formData,
  });

  if (!response.ok) throw new Error(`Failed to update recipe with ID ${id}`);

  return await response.json();
};

export const deleteRecipe = async (id: number) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Failed to delete recipe with ID ${id}`);

  return await response.json();
};

export const getRecipesByUserId = async (
  userId: number
): Promise<RecipeDto[]> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_URL}/recipes/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok)
    throw new Error(`Failed to fetch recipes for user with ID ${userId}`);

  return await response.json();
};

export const searchRecipes = async (query: string): Promise<RecipeDto[]> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(
    `${API_URL}/recipes/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok)
    throw new Error(`Failed to search recipes for query: ${query}`);

  return await response.json();
};

export const getAllRecipes = async (): Promise<RecipeDto[]> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_URL}/recipes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch all recipes");

  return await response.json();
};

export const rateRecipe = async (recipeId: number, rating: number) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_URL}/recipes/${recipeId}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating }),
  });

  if (!response.ok) throw new Error("Failed to rate recipe");

  return await response.json(); // Should return updated recipe with avgRating
};

export const getRecipeavgRating = async (
  recipeId: number
): Promise<{ average: number; count: number }> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
      : null;

  if (!token) throw new Error("User not authenticated");

  const response = await fetch(
    `${API_URL}/recipes/${recipeId}/rating/average`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok)
    throw new Error(`Failed to fetch average rating for recipe ${recipeId}`);

  return await response.json();
};
