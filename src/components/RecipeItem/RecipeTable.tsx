import { RecipeDto } from "@/models/recipe";
import { Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface RecipeTableProps {
  recipes: RecipeDto[];
  searchQuery: string;
  handleEditClick: (recipe: RecipeDto) => void;
  handleDeleteClick: (recipe: RecipeDto) => void;
  currentUserId: number;
  onRate: (recipeId: number, rating: number) => void; // callback for rating
}

const RecipeTable: React.FC<RecipeTableProps> = ({
  recipes,
  searchQuery,
  handleEditClick,
  currentUserId,
  handleDeleteClick,
  onRate,
}) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [localRatings, setLocalRatings] = useState<Record<number, number>>({});
  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRating = (recipeId: number, rating: number) => {
    setLocalRatings((prev) => ({ ...prev, [recipeId]: rating }));
    if (onRate) onRate(recipeId, rating);
  };

  if (recipes.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        {searchQuery ? "No recipes found." : "No recipes available."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
      {recipes.map((recipe) => {
        const avgRating = recipe.avgRating ?? 0;
        const userRating = localRatings[recipe.id] ?? recipe.userRating ?? 0;
        console.log(recipe.avgRating);

        console.log(userRating, avgRating);

        return (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {recipe.imageUrl ? (
                <img
                  src={`http://localhost:3001${recipe.imageUrl}`}
                  alt={recipe.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg">{recipe.name}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                {recipe.description}
              </p>

              <div className="mt-2 flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => {
                  const isOwner = recipe.userId === currentUserId;
                  const starClass =
                    userRating >= i
                      ? "text-yellow-500"
                      : avgRating >= i
                      ? "text-yellow-300"
                      : "text-gray-300";

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => !isOwner && handleRating(recipe.id, i)}
                      className={`cursor-pointer ${starClass} hover:text-yellow-600`}
                      disabled={isOwner}
                    >
                      ★
                    </button>
                  );
                })}
                <span className="ml-2 text-gray-600 text-sm">
                  ({avgRating.toFixed(1)})
                </span>
              </div>

              {/* Toggle ingredients */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <>
                  <button
                    onClick={() => toggleExpand(recipe.id)}
                    className="mt-2 text-indigo-600 text-sm hover:underline self-start"
                  >
                    {expandedIds.includes(recipe.id)
                      ? "Hide ingredients"
                      : "Show ingredients"}
                  </button>
                  {expandedIds.includes(recipe.id) && (
                    <ul className="mt-2 text-gray-700 text-sm list-disc list-inside">
                      {recipe.ingredients.map((ing: string, index: number) => (
                        <li key={index}>{ing}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {/* Actions for owner */}
              {recipe.userId === currentUserId && (
                <div className="mt-auto flex gap-2 pt-2">
                  <button
                    onClick={() => handleEditClick(recipe)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(recipe)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeTable;
