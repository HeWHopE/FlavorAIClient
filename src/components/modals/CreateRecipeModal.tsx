import { CreateRecipeDto } from "@/models/recipe";
import { useAppSelector } from "@/store/hooks";
import { recipeValidationSchema } from "@/validationSchemas/recipeValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: CreateRecipeDto) => void;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(recipeValidationSchema),
  });

  const router = useRouter();
  const userId = useAppSelector((state) => state.user.data?.id);

  // Local state for ingredient input
  const [ingredientInput, setIngredientInput] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit: SubmitHandler<{
    name: string;
    description?: string;
    ingredients: (string | undefined)[];
    instructions: string;
  }> = (data) => {
    if (!userId) {
      onClose();
      router.push("/auth");
      return;
    }

    const newRecipe: CreateRecipeDto = {
      ...data,
      ingredients: data.ingredients.filter((ing): ing is string => !!ing),
      image: imageFile ?? undefined, // now safe
    };

    onSave(newRecipe);
    onClose();
  };

  const handleAddIngredient = (
    ingredients: string[],
    setValue: (val: string[]) => void
  ) => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setValue([...ingredients, trimmed]);
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (
    index: number,
    ingredients: string[],
    setValue: (val: string[]) => void
  ) => {
    setValue(ingredients.filter((_, i) => i !== index));
  };

  return (
    isOpen && (
      <>
        <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold">Create Recipe</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recipe Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredients
                </label>
                <Controller
                  name="ingredients"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {value &&
                          value.map((ing, index) => (
                            <div
                              key={index}
                              className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
                            >
                              <span>{ing}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveIngredient(
                                    index,
                                    value.filter((ing): ing is string => !!ing), // filter undefined
                                    onChange
                                  )
                                }
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={ingredientInput}
                          onChange={(e) => setIngredientInput(e.target.value)}
                          className="flex-1 border border-gray-300 p-2 rounded-md"
                          placeholder="Add ingredient"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleAddIngredient(
                              value.filter((ing): ing is string => !!ing), // filter undefined
                              onChange
                            )
                          }
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md"
                        >
                          Add
                        </button>
                      </div>
                    </>
                  )}
                />
                {errors.ingredients && (
                  <p className="text-red-500 text-xs">
                    {errors.ingredients.message}
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instructions
                </label>
                <Controller
                  name="instructions"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                    />
                  )}
                />
                {errors.instructions && (
                  <p className="text-red-500 text-xs">
                    {errors.instructions.message}
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                  />
                  {imageFile && (
                    <p className="text-sm mt-1">{imageFile.name}</p>
                  )}
                </div>
                {errors.imageUrl && (
                  <p className="text-red-500 text-xs">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  );
};

export default CreateRecipeModal;
