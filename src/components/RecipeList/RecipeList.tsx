import {
  createRecipe,
  deleteRecipe,
  rateRecipe,
  searchRecipes,
  updateRecipe,
} from "@/api/recipe-api";
import { CreateRecipeDto, RecipeDto, UpdateRecipeDto } from "@/models/recipe";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import CreateRecipeModal from "@/components/modals/CreateRecipeModal";
import UpdateRecipeModal from "@/components/modals/UpdateRecipeModal";
import DeleteRecipeModal from "@/components/modals/DeleteRecipeModal";
import RecipeTable from "../RecipeItem/RecipeTable";

interface RecipeListProps {
  recipes: RecipeDto[];
  setRecipes: Dispatch<SetStateAction<RecipeDto[]>>;
  currentUserId: number;
}

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  setRecipes,
  currentUserId,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDto | null>(null);

  const [recipeToEdit, setRecipeToEdit] = useState<RecipeDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeDto[]>(recipes);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredRecipes(recipes);
    }
  }, [recipes, searchQuery]);

  const toggleCreateModal = () => setIsCreateOpen((prev) => !prev);
  const toggleUpdateModal = () => setIsUpdateOpen((prev) => !prev);
  const toggleDeleteModal = () => setIsDeleteOpen((prev) => !prev);

  const onCreateRecipe = async (recipe: CreateRecipeDto) => {
    const response = await createRecipe(recipe);
    if (response) {
      toast.success("Recipe created successfully");
      setIsCreateOpen(false);
      setRecipes((prev) => [...prev, response]);
      if (
        searchQuery &&
        (response.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (response.description &&
            response.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())))
      ) {
        setFilteredRecipes((prev) => [...prev, response]);
      }
    }
  };

  const onUpdateRecipe = async (recipe: UpdateRecipeDto) => {
    if (!recipeToEdit?.id) return;

    const response = await updateRecipe(recipeToEdit.id, recipe);
    if (response) {
      toast.success("Recipe updated successfully");
      setIsUpdateOpen(false);

      setRecipes((prev) =>
        prev.map((r) => (r.id === recipeToEdit.id ? { ...r, ...response } : r))
      );

      if (searchQuery) {
        setFilteredRecipes((prev) =>
          prev.map((r) =>
            r.id === recipeToEdit.id ? { ...r, ...response } : r
          )
        );
      }
    }
  };

  const handleRate = async (recipeId: number, rating: number) => {
    try {
      const updatedRecipe = await rateRecipe(recipeId, rating);
      console.log(updatedRecipe, "new one");
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId ? { ...r, avgRating: updatedRecipe.avgRating } : r
        )
      );

      setFilteredRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId ? { ...r, avgRating: updatedRecipe.avgRating } : r
        )
      );

      toast.success("Rating submitted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit rating");
    }
  };

  const onDelete = async (recipeId: number) => {
    try {
      const response = await deleteRecipe(recipeId);
      if (response) {
        toast.success("Recipe deleted successfully");
        setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        setFilteredRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        setIsDeleteOpen(false);
      } else {
        toast.error("Failed to delete the recipe. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("An error occurred while deleting the recipe.");
      setIsDeleteOpen(false);
    }
  };

  const handleEditClick = (recipe: RecipeDto) => {
    setRecipeToEdit(recipe);
    setSelectedRecipe(recipe);
    setIsUpdateOpen(true);
  };

  const handleDeleteClick = (recipe: RecipeDto) => {
    setRecipeToEdit(recipe);
    setSelectedRecipe(recipe);

    setIsDeleteOpen(true);
  };

  const debouncedSearch = (query: string) => {
    setIsSearchLoading(true);
    setTimeout(async () => {
      if (!query) {
        setFilteredRecipes(recipes);
        setSearchError(null);
        setIsSearchLoading(false);
        return;
      }

      try {
        const results = await searchRecipes(query);
        setFilteredRecipes(results);
        setSearchError(null);
        setIsSearchLoading(false);
      } catch (error) {
        setIsSearchLoading(false);
        console.error(error);
        setSearchError("Failed to search recipes");
        setFilteredRecipes([]);
      }
    }, 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredRecipes(recipes);
    setSearchError(null);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-md shadow-md">
      <div className="flex flex-col justify-between items-center mb-4 sm:flex-row gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recipes</h2>
        <div className="flex items-center mt-2 sm:mt-0 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or description..."
              className="w-full sm:w-64 px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {isSearchLoading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <FiLoader className="animate-spin text-gray-500" size={20} />
              </div>
            )}
            {searchQuery && !isSearchLoading && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <button
          onClick={toggleCreateModal}
          className="ml-0 sm:ml-4 mt-2 sm:mt-0 px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base"
        >
          Add Recipe
        </button>
      </div>

      <RecipeTable
        currentUserId={currentUserId}
        recipes={filteredRecipes}
        searchQuery={searchQuery}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        onRate={handleRate}
      />

      {searchError && (
        <p className="text-red-500 text-sm mb-4">{searchError}</p>
      )}

      <CreateRecipeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={onCreateRecipe}
      />

      {selectedRecipe && (
        <UpdateRecipeModal
          isOpen={isUpdateOpen}
          onClose={() => {
            toggleUpdateModal();

            setSelectedRecipe(null);
          }}
          onSave={onUpdateRecipe}
          recipeData={selectedRecipe}
        />
      )}

      {selectedRecipe && (
        <DeleteRecipeModal
          isOpen={isDeleteOpen}
          onClose={() => {
            toggleDeleteModal();
            setSelectedRecipe(null);
          }}
          onDelete={onDelete}
          recipeData={selectedRecipe}
        />
      )}
    </div>
  );
};

export default RecipeList;
