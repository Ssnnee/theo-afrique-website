import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "~/server/db"
import { accounts, sessions, users, verificationTokens } from "~/server/db/schema"
import Resend from "next-auth/providers/resend"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }),
  secret: process.env.AUTH_SECRET,
  providers: [Resend ({
     from: "dev@revuecg.com",
    })
  ],
})
