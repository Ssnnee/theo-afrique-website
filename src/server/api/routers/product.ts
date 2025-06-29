import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter  = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({ });
  }),

  getByCategory: publicProcedure
  .input(z.object({ categoryId: z.number() }))
  .query(async ({ ctx, input }) => {
    return ctx.db.query.productsToCategories.findMany({
      where: (productsToCategories, { eq }) =>
        eq(productsToCategories.categoryId, input.categoryId),
    });
  }),
});
