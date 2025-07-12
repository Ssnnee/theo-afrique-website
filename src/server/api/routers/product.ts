import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { categories, products, productsToCategories } from "~/server/db/schema";

export const productRouter  = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({ });
  }),

  getByCategory: publicProcedure
    .input(z.object({ categoryName: z.string() }))
    .query(async ({ input, ctx }) => {
      const rows = await ctx.db
        .select({
          product: products,
        })
        .from(productsToCategories)
        .innerJoin(products, eq(products.id, productsToCategories.productId))
        .innerJoin(categories, eq(categories.id, productsToCategories.categoryId))
        .where(eq(categories.name, input.categoryName));

      return rows.map((row) => row.product);
    }),
});
