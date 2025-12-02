// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	primaryKey,
	sqliteTableCreator,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `${name}`);

export const users = createTable(
	"user",
	(d) => ({
		id: d
			.text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: d.text({ length: 256 }),
		email: d.text({ length: 256 }).notNull().unique(),
		emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
		image: d.text(),
		role: d.text().$type<"admin" | "user">().default("user").notNull(),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
	}),
	(t) => [index("email_idx").on(t.email)],
);

export const accounts = createTable(
	"account",
	(d) => ({
		userId: d
			.text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: d.text("type").$type<AdapterAccountType>().notNull(),
		provider: d.text("provider").notNull(),
		providerAccountId: d.text("providerAccountId").notNull(),
		refresh_token: d.text("refresh_token"),
		access_token: d.text("access_token"),
		expires_at: integer("expires_at"),
		token_type: d.text("token_type"),
		scope: d.text("scope"),
		id_token: d.text("id_token"),
		session_state: d.text("session_state"),
	}),
	(t) => [
		index("account_provider_providerAccountId_idx").on(
			t.provider,
			t.providerAccountId,
		),
		primaryKey({ columns: [t.provider, t.providerAccountId] }),
	],
);

export const sessions = createTable(
	"session",
	(d) => ({
		sessionToken: d.text("sessionToken").primaryKey(),
		userId: d
			.text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
	}),
	(t) => [index("session_userId_idx").on(t.userId)],
);

export const verificationTokens = createTable(
	"verificationToken",
	(d) => ({
		identifier: d.text("identifier").notNull(),
		token: d.text("token").notNull(),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
	}),
	(t) => [
		index("verificationToken_token_idx").on(t.token),
		primaryKey({ columns: [t.identifier, t.token] }),
	],
);

export const authenticators = createTable(
	"authenticator",
	(d) => ({
		credentialID: d.text("credentialID").notNull().unique(),
		userId: d
			.text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: d.text("providerAccountId").notNull(),
		credentialPublicKey: d.text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: d.text("credentialDeviceType").notNull(),
		credentialBackedUp: integer("credentialBackedUp", {
			mode: "boolean",
		}).notNull(),
		transports: d.text("transports"),
	}),
	(t) => [
		index("authenticator_credentialID_idx").on(t.credentialID),
		primaryKey({ columns: [t.credentialID, t.userId, t.providerAccountId] }),
	],
);

export const products = createTable(
	"product",
	(d) => ({
		id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		name: d.text({ length: 256 }).notNull(),
		description: d.text().notNull(),
		price: d.integer({ mode: "number" }).notNull(),
		imageUrl: d.text({ length: 512 }).notNull(),
		sizes: d
			.text("sizes", { mode: "json" })
			.$type<string[]>()
			.notNull()
			.default(sql`[]`),
		colors: d
			.text("colors", { mode: "json" })
			.$type<string[]>()
			.notNull()
			.default(sql`[]`),
		stock: d.integer({ mode: "number" }).notNull(),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
	}),
	(t) => [index("product_name_idx").on(t.name)],
);

export const productRelations = relations(products, ({ many }) => ({
	productsToCategories: many(productsToCategories),
}));

export const categories = createTable(
	"category",
	(d) => ({
		id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		name: d.text({ length: 256 }).notNull().unique(),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
	}),
	(t) => [index("category_name_idx").on(t.name)],
);

export const categoryRelations = relations(categories, ({ many }) => ({
	productsToCategories: many(productsToCategories),
}));

export const productsToCategories = createTable(
	"products_to_categories",
	(d) => ({
		productId: d
			.integer("product_id", { mode: "number" })
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		categoryId: d
			.integer("category_id", { mode: "number" })
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
	}),
	(t) => [
		index("product_category_idx").on(t.productId, t.categoryId),
		primaryKey({ columns: [t.productId, t.categoryId] }),
	],
);

export const productsToCategoriesRelations = relations(
	productsToCategories,
	({ one }) => ({
		product: one(products, {
			fields: [productsToCategories.productId],
			references: [products.id],
		}),
		category: one(categories, {
			fields: [productsToCategories.categoryId],
			references: [categories.id],
		}),
	}),
);

// Announcements for promotions, sales, and price reductions
export const announcements = createTable(
	"announcement",
	(d) => ({
		id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		title: d.text({ length: 256 }).notNull(),
		message: d.text().notNull(),
		type: d
			.text()
			.$type<"sale" | "promotion" | "info" | "warning">()
			.default("info")
			.notNull(),
		discountType: d
			.text()
			.$type<"percentage" | "fixed">()
			.default("percentage")
			.notNull(),
		discountValue: d.integer({ mode: "number" }).notNull(), // Percentage (20 = 20%) or fixed amount in CFA
		startDate: d.integer({ mode: "timestamp" }).notNull(),
		endDate: d.integer({ mode: "timestamp" }).notNull(),
		isActive: d.integer({ mode: "boolean" }).default(true).notNull(),
		scope: d
			.text()
			.$type<"global" | "category" | "product">()
			.default("global")
			.notNull(),
		priority: d.integer({ mode: "number" }).default(0).notNull(), // Only highest priority shown (one at a time)
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("announcement_active_dates_idx").on(
			t.isActive,
			t.startDate,
			t.endDate,
		),
		index("announcement_priority_idx").on(t.priority),
	],
);

export const announcementRelations = relations(announcements, ({ many }) => ({
	announcementsToProducts: many(announcementsToProducts),
	announcementsToCategories: many(announcementsToCategories),
}));

// Junction table for announcements targeting specific products
export const announcementsToProducts = createTable(
	"announcements_to_products",
	(d) => ({
		announcementId: d
			.integer("announcement_id", { mode: "number" })
			.notNull()
			.references(() => announcements.id, { onDelete: "cascade" }),
		productId: d
			.integer("product_id", { mode: "number" })
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
	}),
	(t) => [
		primaryKey({ columns: [t.announcementId, t.productId] }),
		index("announcement_product_idx").on(t.announcementId, t.productId),
	],
);

export const announcementsToProductsRelations = relations(
	announcementsToProducts,
	({ one }) => ({
		announcement: one(announcements, {
			fields: [announcementsToProducts.announcementId],
			references: [announcements.id],
		}),
		product: one(products, {
			fields: [announcementsToProducts.productId],
			references: [products.id],
		}),
	}),
);

// Junction table for announcements targeting specific categories
export const announcementsToCategories = createTable(
	"announcements_to_categories",
	(d) => ({
		announcementId: d
			.integer("announcement_id", { mode: "number" })
			.notNull()
			.references(() => announcements.id, { onDelete: "cascade" }),
		categoryId: d
			.integer("category_id", { mode: "number" })
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
	}),
	(t) => [
		primaryKey({ columns: [t.announcementId, t.categoryId] }),
		index("announcement_category_idx").on(t.announcementId, t.categoryId),
	],
);

export const announcementsToCategoriesRelations = relations(
	announcementsToCategories,
	({ one }) => ({
		announcement: one(announcements, {
			fields: [announcementsToCategories.announcementId],
			references: [announcements.id],
		}),
		category: one(categories, {
			fields: [announcementsToCategories.categoryId],
			references: [categories.id],
		}),
	}),
);

// Audit logging for admin actions
export const adminLogs = createTable(
	"admin_log",
	(d) => ({
		id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		userId: d
			.text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		action: d.text("action").notNull(), // 'create', 'update', 'delete'
		resource: d.text("resource").notNull(), // 'announcement', 'product', 'category', 'user'
		resourceId: d.text("resource_id"), // ID of the affected resource
		details: d.text("details", { mode: "json" }), // Additional context as JSON
		ipAddress: d.text("ip_address"),
		userAgent: d.text("user_agent"),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
	}),
	(t) => [
		index("admin_log_user_idx").on(t.userId),
		index("admin_log_resource_idx").on(t.resource, t.resourceId),
		index("admin_log_date_idx").on(t.createdAt),
	],
);

export const adminLogRelations = relations(adminLogs, ({ one }) => ({
	user: one(users, {
		fields: [adminLogs.userId],
		references: [users.id],
	}),
}));
