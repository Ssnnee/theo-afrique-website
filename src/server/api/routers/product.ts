import { and, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";

import { applyAnnouncementToProduct } from "~/lib/utils";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	announcements,
	categories,
	products,
	productsToCategories,
} from "~/server/db/schema";

// Helper to get active announcement
async function getActiveAnnouncement(ctx: { db: any }) {
	const now = new Date();
	const activeAnnouncements = await ctx.db.query.announcements.findMany({
		where: and(
			eq(announcements.isActive, true),
			lte(announcements.startDate, now),
			gte(announcements.endDate, now),
		),
		orderBy: (announcements: any, { desc }: any) => [
			desc(announcements.priority),
		],
		limit: 1,
		with: {
			announcementsToProducts: true,
			announcementsToCategories: true,
		},
	});

	return activeAnnouncements[0] ?? null;
}

// Helper to get product category IDs
async function getProductCategoryIds(ctx: { db: any }, productId: number) {
	const links = await ctx.db.query.productsToCategories.findMany({
		where: eq(productsToCategories.productId, productId),
	});
	return links.map((link: any) => link.categoryId);
}

export const productRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const allProducts = await ctx.db.query.products.findMany({});
		const announcement = await getActiveAnnouncement(ctx);

		// Apply discounts to all products
		const productsWithDiscounts = await Promise.all(
			allProducts.map(async (product) => {
				const categoryIds = await getProductCategoryIds(ctx, product.id);
				return applyAnnouncementToProduct(product, announcement, categoryIds);
			}),
		);

		return productsWithDiscounts;
	}),

	getLimited: publicProcedure
		.input(z.object({ limit: z.number().min(1).max(100) }))
		.query(async ({ input, ctx }) => {
			const limitedProducts = await ctx.db.query.products.findMany({
				limit: input.limit,
			});
			const announcement = await getActiveAnnouncement(ctx);

			const productsWithDiscounts = await Promise.all(
				limitedProducts.map(async (product) => {
					const categoryIds = await getProductCategoryIds(ctx, product.id);
					return applyAnnouncementToProduct(product, announcement, categoryIds);
				}),
			);

			return productsWithDiscounts;
		}),

	getLatest: publicProcedure.query(async ({ ctx }) => {
		const latestProducts = await ctx.db.query.products.findMany({
			orderBy: (products, { desc }) => [desc(products.createdAt)],
			limit: 8,
		});
		const announcement = await getActiveAnnouncement(ctx);

		const productsWithDiscounts = await Promise.all(
			latestProducts.map(async (product) => {
				const categoryIds = await getProductCategoryIds(ctx, product.id);
				return applyAnnouncementToProduct(product, announcement, categoryIds);
			}),
		);

		return productsWithDiscounts;
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
				.innerJoin(
					categories,
					eq(categories.id, productsToCategories.categoryId),
				)
				.where(eq(categories.name, input.categoryName));

			const categoryProducts = rows.map((row) => row.product);
			const announcement = await getActiveAnnouncement(ctx);

			const productsWithDiscounts = await Promise.all(
				categoryProducts.map(async (product) => {
					const categoryIds = await getProductCategoryIds(ctx, product.id);
					return applyAnnouncementToProduct(product, announcement, categoryIds);
				}),
			);

			return productsWithDiscounts;
		}),
});
