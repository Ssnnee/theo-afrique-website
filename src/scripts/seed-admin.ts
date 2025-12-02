/**
 * Admin User Seed Script
 *
 * This script creates the first admin user in the database.
 * Run with: pnpm tsx src/scripts/seed-admin.ts
 */

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

async function seedAdmin() {
	const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

	try {
		// Check if admin already exists
		const existingAdmin = await db.query.users.findFirst({
			where: eq(users.email, adminEmail),
		});

		if (existingAdmin) {
			if (existingAdmin.role === "admin") {
				console.log(`✅ Admin user already exists: ${adminEmail}`);
				return;
			} else {
				// Update existing user to admin
				await db
					.update(users)
					.set({ role: "admin" })
					.where(eq(users.email, adminEmail));
				console.log(`✅ Updated existing user to admin: ${adminEmail}`);
				return;
			}
		}

		// Create new admin user
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
		console.log(
			"📧 Send a magic link login request to this email to access the dashboard",
		);
		console.log("🔗 Visit /login and enter the admin email to get started");
	} catch (error) {
		console.error("❌ Error creating admin user:", error);
		process.exit(1);
	}
}

// Run the script
if (require.main === module) {
	seedAdmin()
		.then(() => {
			console.log("✨ Admin seeding completed");
			process.exit(0);
		})
		.catch((error) => {
			console.error("💥 Seeding failed:", error);
			process.exit(1);
		});
}

export default seedAdmin;
