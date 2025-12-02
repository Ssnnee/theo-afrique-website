import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";

import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import {
	announcements,
	announcementsToCategories,
	announcementsToProducts,
} from "~/server/db/schema";

export const announcementRouter = createTRPCRouter({
	// Get the currently active announcement (highest priority, within date range)
	getActive: publicProcedure.query(async ({ ctx }) => {
		const now = new Date(); // Current time

		const activeAnnouncements = await ctx.db.query.announcements.findMany({
			where: and(
				eq(announcements.isActive, true),
				lte(announcements.startDate, now),
				gte(announcements.endDate, now),
			),
			orderBy: [desc(announcements.priority)],
			limit: 1,
			with: {
				announcementsToProducts: {
					with: {
						product: true,
					},
				},
				announcementsToCategories: {
					with: {
						category: true,
					},
				},
			},
		});

		return activeAnnouncements[0] ?? null;
	}),

	// Get all announcements (admin use)
	getAll: adminProcedure.query(async ({ ctx }) => {
		return ctx.db.query.announcements.findMany({
			orderBy: [desc(announcements.priority), desc(announcements.createdAt)],
			with: {
				announcementsToProducts: {
					with: {
						product: true,
					},
				},
				announcementsToCategories: {
					with: {
						category: true,
					},
				},
			},
		});
	}),

	// Get announcement by ID
	getById: adminProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			return ctx.db.query.announcements.findFirst({
				where: eq(announcements.id, input.id),
				with: {
					announcementsToProducts: {
						with: {
							product: true,
						},
					},
					announcementsToCategories: {
						with: {
							category: true,
						},
					},
				},
			});
		}),

	// Create new announcement
	create: adminProcedure
		.input(
			z.object({
				title: z.string().min(1).max(256),
				message: z.string().min(1),
				type: z.enum(["sale", "promotion", "info", "warning"]).default("info"),
				discountType: z.enum(["percentage", "fixed"]).default("percentage"),
				discountValue: z.number().min(0),
				startDate: z.date(),
				endDate: z.date(),
				isActive: z.boolean().default(true),
				scope: z.enum(["global", "category", "product"]).default("global"),
				priority: z.number().default(0),
				productIds: z.array(z.number()).optional(),
				categoryIds: z.array(z.number()).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { productIds, categoryIds, ...announcementData } = input;

			// Insert announcement
			const [announcement] = await ctx.db
				.insert(announcements)
				.values(announcementData)
				.returning();

			if (!announcement) {
				throw new Error("Failed to create announcement");
			}

			// Link products if scope is 'product'
			if (input.scope === "product" && productIds && productIds.length > 0) {
				await ctx.db.insert(announcementsToProducts).values(
					productIds.map((productId) => ({
						announcementId: announcement.id,
						productId,
					})),
				);
			}

			// Link categories if scope is 'category'
			if (input.scope === "category" && categoryIds && categoryIds.length > 0) {
				await ctx.db.insert(announcementsToCategories).values(
					categoryIds.map((categoryId) => ({
						announcementId: announcement.id,
						categoryId,
					})),
				);
			}

			return announcement;
		}),

	// Update announcement
	update: adminProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().min(1).max(256).optional(),
				message: z.string().min(1).optional(),
				type: z.enum(["sale", "promotion", "info", "warning"]).optional(),
				discountType: z.enum(["percentage", "fixed"]).optional(),
				discountValue: z.number().min(0).optional(),
				startDate: z.date().optional(),
				endDate: z.date().optional(),
				isActive: z.boolean().optional(),
				scope: z.enum(["global", "category", "product"]).optional(),
				priority: z.number().optional(),
				productIds: z.array(z.number()).optional(),
				categoryIds: z.array(z.number()).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, productIds, categoryIds, startDate, endDate, ...updateData } =
				input;

			// Prepare update data
			const updateValues: Record<string, unknown> = { ...updateData };
			if (startDate) {
				updateValues.startDate = startDate;
			}
			if (endDate) {
				updateValues.endDate = endDate;
			}

			// Update announcement
			const [updatedAnnouncement] = await ctx.db
				.update(announcements)
				.set(updateValues)
				.where(eq(announcements.id, id))
				.returning();

			// Update product links if provided
			if (productIds !== undefined) {
				await ctx.db
					.delete(announcementsToProducts)
					.where(eq(announcementsToProducts.announcementId, id));

				if (productIds.length > 0) {
					await ctx.db.insert(announcementsToProducts).values(
						productIds.map((productId) => ({
							announcementId: id,
							productId,
						})),
					);
				}
			}

			// Update category links if provided
			if (categoryIds !== undefined) {
				await ctx.db
					.delete(announcementsToCategories)
					.where(eq(announcementsToCategories.announcementId, id));

				if (categoryIds.length > 0) {
					await ctx.db.insert(announcementsToCategories).values(
						categoryIds.map((categoryId) => ({
							announcementId: id,
							categoryId,
						})),
					);
				}
			}

			return updatedAnnouncement;
		}),

	// Delete announcement
	delete: adminProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			await ctx.db.delete(announcements).where(eq(announcements.id, input.id));

			return { success: true };
		}),

	// Toggle announcement active status
	toggleActive: adminProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const announcement = await ctx.db.query.announcements.findFirst({
				where: eq(announcements.id, input.id),
			});

			if (!announcement) {
				throw new Error("Announcement not found");
			}

			const [updated] = await ctx.db
				.update(announcements)
				.set({ isActive: !announcement.isActive })
				.where(eq(announcements.id, input.id))
				.returning();

			return updated;
		}),
});
