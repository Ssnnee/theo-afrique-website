/**
 * Admin User Seed Script
 *
 * This script creates the first admin user in the database.
 * Run with: pnpm dlx tsx src/scripts/seed-admin.ts
 */

import "dotenv/config";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";

const { db } = await import("~/server/db");

async function seedAdmin() {
	const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

	try {
		const existingAdmin = await db.query.users.findFirst({
			where: eq(users.email, adminEmail),
		});

		if (existingAdmin) {
			if (existingAdmin.role === "admin") {
				console.log(`✅ Admin user already exists: ${adminEmail}`);
			} else {
				await db
					.update(users)
					.set({ role: "admin" })
					.where(eq(users.email, adminEmail));

				console.log(`✅ Updated existing user to admin: ${adminEmail}`);
			}
			return;
		}

		const adminId = crypto.randomUUID();
		await db.insert(users).values({
			id: adminId,
			email: adminEmail,
			role: "admin",
			name: "Admin User",
			emailVerified: null,
			image: null,
			createdAt: new Date(),
			updatedAt: null,
		});

		console.log(`🎉 Created new admin user: ${adminEmail}`);
		console.log("📧 Send a magic link login request to access the dashboard");
	} catch (error) {
		console.error("❌ Error creating admin user:", error);
		process.exit(1);
	}
}

// ESM entrypoint
await seedAdmin();
console.log("✨ Admin seeding completed");
process.exit(0);
