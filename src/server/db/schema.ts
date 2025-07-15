// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTableCreator } from "drizzle-orm/sqlite-core";

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
    role: d.text().$type<"admin" | "user">().default("user").notNull(),
    hashPassword: d.text({ length: 256 }).notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("email_idx").on(t.email)],
);


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
