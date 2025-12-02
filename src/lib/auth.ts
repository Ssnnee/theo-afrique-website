import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { env } from "~/env";
import { db } from "~/server/db";
import {
	accounts,
	sessions,
	users,
	verificationTokens,
} from "~/server/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}) as any,
	secret: env.AUTH_SECRET,
	providers: [
		Resend({
			apiKey: env.AUTH_RESEND_KEY,
			from: "dev@revuecg.com",
		}),
	],
	callbacks: {
		session: async ({ session, token }) => {
			if (session.user) {
				// Fetch user role from database
				const user = await db.query.users.findFirst({
					where: (users, { eq }) => eq(users.id, token.sub!),
				});

				return {
					...session,
					user: {
						...session.user,
						id: token.sub!,
						role: user?.role || "user",
					},
				};
			}
			return session;
		},
		jwt: ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	debug: env.NODE_ENV === "development",
});
