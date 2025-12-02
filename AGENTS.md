# Agent Guidelines for theo-afrique-website

## Commands
- Dev: `pnpm dev` (uses Turbo)
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`
- Lint/Format: `pnpm check` (uses Biome) or `pnpm check:write` (auto-fix)
- DB: `pnpm db:push` (schema), `pnpm db:studio` (GUI)

## Code Style
- **Formatter**: Biome (not Prettier). Run `pnpm check:write` before committing.
- **Imports**: Use `~/` alias for src imports. Biome auto-organizes imports.
- **Types**: Strict TypeScript enabled. Use `z.infer<typeof Schema>` for Zod schemas.
- **Components**: React Server Components by default. Use `"use client"` only when needed.
- **Naming**: camelCase for functions/variables, PascalCase for components, kebab-case for files.
- **Error Handling**: Use Zod for input validation. tRPC handles errors automatically.
- **Styling**: Tailwind CSS with `cn()` utility from `~/lib/utils`. Biome enforces sorted classes.
- **Database**: Drizzle ORM with LibSQL. Use `ctx.db.query` API in tRPC procedures.
- **Auth**: NextAuth v5 (beta). Check session in server components/API routes.
- **Forms**: React Hook Form + Zod resolvers. Use shadcn/ui form components.

## Architecture
- T3 Stack: Next.js 15 (App Router), tRPC, Drizzle, NextAuth, Tailwind
- Server: tRPC routers in `~/server/api/routers/`, schemas in `~/server/db/schema.ts`
- Client: React Query via tRPC hooks from `~/trpc/react`
