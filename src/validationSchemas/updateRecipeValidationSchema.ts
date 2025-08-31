import * as yup from "yup";

export const updateRecipeValidationSchema = yup.object({
  name: yup.string().nullable().default(null),
  description: yup.string().nullable().default(null),
  ingredients: yup.array().of(yup.string()).nullable().default([]),
  instructions: yup.string().nullable().default(null),
  image: yup.mixed<File>().nullable().default(null),
});
