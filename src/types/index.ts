import { z } from 'zod';


// type Product = {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   sizes: string[];
//   colors: string[];
//   stock: number;
//   createdAt: Date;
//   updatedAt: Date | null;
// };

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
