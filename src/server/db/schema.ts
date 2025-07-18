// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
	(name) => `${name}`,
);

export const users = createTable(
  "user",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 256 }),
    email: d.text({ length: 256 }).notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
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
  (d) => ( {
    userId: d.text("userId")
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
  })
  , (t) => [
    index("account_provider_providerAccountId_idx").on(t.provider, t.providerAccountId),
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
  ]
)

export const sessions = createTable(
  "session",
  (d) => ({
  sessionToken: d.text("sessionToken").primaryKey(),
  userId: d.text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  }),
  (t) => [
    index("session_userId_idx").on(t.userId),
  ]
)


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
  ]
)

export const authenticators = createTable(
  "authenticator",
  (d) => ( {
    credentialID: d.text("credentialID").notNull().unique(),
    userId: d.text("userId")
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
  ]
)


export const products = createTable(
  "product",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 256 }).notNull(),
    description: d.text().notNull(),
    price: d.integer({ mode: "number" }).notNull(),
    imageUrl: d.text({ length: 512 }).notNull(),
    sizes: d.text("sizes", {mode: "json"}).$type<string[]>().notNull().default(sql`[]`),
    colors: d.text("colors", {mode: "json"}).$type<string[]>().notNull().default(sql`[]`),
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
  productsToCategories: many(productsToCategories)
}));

export const categories = createTable(
  "category",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 256 }).notNull(),
    createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("category_name_idx").on(t.name)],
);

export const categoryRelations = relations(categories, ({ many }) => ({
  productsToCategories: many(productsToCategories)
}));

export const productsToCategories = createTable(
  "products_to_categories",
  (d) => ({
    productId: d.integer('product_id', { mode: "number" })
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
    categoryId: d.integer('category_id', { mode: "number" })
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
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

export const productsToCategoriesRelations = relations(productsToCategories, ({ one }) => ({
  product: one(products, {
    fields: [productsToCategories.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [productsToCategories.categoryId],
    references: [categories.id],
  }),
}));
