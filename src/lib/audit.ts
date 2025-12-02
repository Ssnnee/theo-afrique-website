import { db } from "~/server/db";
import { adminLogs } from "~/server/db/schema";

export type AuditAction = "create" | "update" | "delete" | "view";
export type AuditResource = "announcement" | "product" | "category" | "user";

export interface AuditLogData {
	userId: string;
	action: AuditAction;
	resource: AuditResource;
	resourceId?: string;
	details?: Record<string, any>;
	ipAddress?: string;
	userAgent?: string;
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(data: AuditLogData) {
	try {
		await db.insert(adminLogs).values({
			userId: data.userId,
			action: data.action,
			resource: data.resource,
			resourceId: data.resourceId,
			details: data.details ? JSON.stringify(data.details) : null,
			ipAddress: data.ipAddress,
			userAgent: data.userAgent,
			createdAt: new Date(),
		});
	} catch (error) {
		// Don't throw error if audit logging fails, but log it
		console.error("Failed to log admin action:", error);
	}
}

/**
 * Enhanced admin procedure that includes automatic audit logging
 */
import { adminProcedure as baseAdminProcedure } from "~/server/api/trpc";

export const auditedAdminProcedure = baseAdminProcedure.use(
	async ({ ctx, next, path }) => {
		const result = await next();

		// Log the action after successful execution
		if (result.ok && ctx.session?.user?.id) {
			const [resource, action] = path.split(".");

			await logAdminAction({
				userId: ctx.session.user.id,
				action: action as AuditAction,
				resource: resource as AuditResource,
				details: {
					path,
					timestamp: new Date().toISOString(),
				},
			});
		}

		return result;
	},
);
