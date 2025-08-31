export interface CreateRecipeDto {
  name: string;
  description?: string;
  ingredients: string[]; // JSON string or plain text
  instructions: string;
  image?: File;
}

export interface RecipeDto {
  id: number;
  name: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  avgRating?: number;
  ratingsCount?: number;
  userRating?: number;
}

export interface UpdateRecipeDto {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  image?: File | null;
}

export interface CreateRatingDto {
  recipeId: number;
  rating: 1 | 2 | 3 | 4 | 5; // only valid star values
}
