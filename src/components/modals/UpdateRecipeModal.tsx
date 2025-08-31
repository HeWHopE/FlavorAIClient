import { RecipeDto, UpdateRecipeDto } from "@/models/recipe";
import { updateRecipeValidationSchema } from "@/validationSchemas/updateRecipeValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface UpdateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateRecipeDto & { image?: File | null }) => void;
  recipeData: RecipeDto;
}

interface UpdateRecipeFormValues {
  name: string | null;
  description: string | null;
  ingredients: string[]; // never undefined
  instructions: string | null;
  image: File | null;
}
const UpdateRecipeModal: React.FC<UpdateRecipeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  recipeData,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateRecipeFormValues>({
    resolver: yupResolver(updateRecipeValidationSchema) as any, // <-- cast to any

    defaultValues: {
      name: recipeData.name ?? null,
      description: recipeData.description,
      ingredients: recipeData.ingredients ?? [],
      instructions: recipeData.instructions ?? null,
      image: null, // no new file initially
    },
  });

  const [ingredientInput, setIngredientInput] = useState("");

  useEffect(() => {
    if (recipeData) {
      setValue("name", recipeData.name);
      setValue("description", recipeData.description ?? "");
      setValue("ingredients", recipeData.ingredients || []);
      setValue("instructions", recipeData.instructions);
    }
  }, [recipeData, setValue]);

  const handleAddIngredient = (
    current: string[],
    onChange: (v: string[]) => void
  ) => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !current.includes(trimmed)) {
      onChange([...current, trimmed]);
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (
    index: number,
    current: string[],
    onChange: (v: string[]) => void
  ) => {
    onChange(current.filter((_, i) => i !== index));
  };

  const onSubmit = (data: UpdateRecipeFormValues) => {
    const payload: UpdateRecipeDto & { imageFile?: File | null } = {
      name: data.name ?? "", // convert null to ""
      description: data.description ?? "",
      ingredients: data.ingredients ?? [],
      instructions: data.instructions ?? "",
      image: data.image ? data.image : undefined, // keep old image if no new file
    };

    console.log(payload);
    onSave(payload);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-md shadow-md w-96 z-10 max-h-[90vh] overflow-auto">
              <h2 className="text-xl font-bold mb-4">Update Recipe</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recipe Name
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        value={field.value ?? ""}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
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
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        value={field.value ?? ""}
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
                        <div className="flex flex-wrap gap-2 mb-2">
                          {value?.map((ing, index) => (
                            <div
                              key={index}
                              className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
                            >
                              <span>{ing}</span>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 text-xs"
                                onClick={() =>
                                  handleRemoveIngredient(
                                    index,
                                    value.filter((ing): ing is string => !!ing),
                                    onChange
                                  )
                                }
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
                            className="px-3 py-1 bg-indigo-600 text-white rounded-md"
                            onClick={() =>
                              handleAddIngredient(
                                value.filter((ing): ing is string => !!ing),
                                onChange
                              )
                            }
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
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={4}
                        value={field.value ?? ""}
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

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Image
                  </label>
                  <Controller
                    name="image"
                    control={control}
                    defaultValue={null}
                    render={({ field: { value, onChange } }) => (
                      <>
                        {/* Preview existing image if no new file */}
                        {!value && recipeData.imageUrl && (
                          <div className="mb-2">
                            <img
                              src={
                                recipeData.imageUrl
                                  ? `http://localhost:3001${recipeData.imageUrl}`
                                  : "/placeholder.png"
                              }
                              alt="Current"
                              className="w-32 h-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                        {/* Preview new file */}
                        {value && value instanceof File && (
                          <div className="mb-2">
                            <img
                              src={URL.createObjectURL(value)}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                        <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0])
                                onChange(e.target.files[0]);
                            }}
                            className="hidden"
                          />
                        </label>
                      </>
                    )}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-xs">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-white rounded-md"
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
      )}
    </>
  );
};

export default UpdateRecipeModal;
