import { eq } from "drizzle-orm";
import { z } from "zod";

import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { categories } from "~/server/db/schema";

export const categoryRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.query.categories.findMany({
			orderBy: (categories, { asc }) => [asc(categories.name)],
		});
	}),

	create: adminProcedure
		.input(z.object({ name: z.string().min(1).max(256) }))
		.mutation(async ({ input, ctx }) => {
			const [category] = await ctx.db
				.insert(categories)
				.values({
					name: input.name,
					createdAt: new Date(),
					updatedAt: null,
				})
				.returning();

			return category;
		}),

	update: adminProcedure
		.input(
			z.object({
				id: z.number(),
				name: z.string().min(1).max(256),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const [category] = await ctx.db
				.update(categories)
				.set({ name: input.name, updatedAt: new Date() })
				.where(eq(categories.id, input.id))
				.returning();

			return category;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			await ctx.db.delete(categories).where(eq(categories.id, input.id));

			return { success: true };
		}),
});
