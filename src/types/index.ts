import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  description: z.string()
    .min(10, { message: "La description doit comporter au moins 10 caractères" })
    .max(512, { message: "La description ne doit pas dépasser 512 caractères" }),
  price: z.number(),
  imageUrl: z.string().url({ message: "L'URL de l'image doit être valide" }),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  stock: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const ContactSchema = z.object({
  name: z.string().min(5, { message: "Le champs doit contenir au moins 5 caractères" }),
  email: z.string().email({ message: "Veullez entrer une adresse email valide" }),
  subject: z.string().min(5, { message: "Le sujet doit contenir au moins 5 caractères" }),
  message: z
    .string()
    .min(160, {
      message: "Le message doit contenir au moins 160 caractères",
    })
    .max(500, {
      message: "Le message ne doit pas depasser 500 caractères",
    })
})

export const OrderFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis" }),
  quantity: z
  .number({ invalid_type_error: "Quantité invalide" })
  .min(1, { message: "La quantité doit être d'au moins 1." }),
  selectedSizes: z.array(z.string()),
  selectedColors: z.array(z.string()),
  customSizing: z.boolean().optional(),
  shirtSize: z.string().optional(),
  pantsSize: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(
    {
      message: "Insérez un mail valide"
    }
  )
})

export const InputOTPSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})
