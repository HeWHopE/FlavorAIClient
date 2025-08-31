import * as Yup from "yup";

export const recipeValidationSchema = Yup.object().shape({
  name: Yup.string().required("Recipe name is required"),
  description: Yup.string().optional(),
  ingredients: Yup.array()
    .of(Yup.string())
    .required("Ingredients are required"),
  instructions: Yup.string().required("Instructions are required"),
  imageUrl: Yup.string().url("Image must be a valid URL").optional(),
});
