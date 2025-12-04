# Théo Afrique

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.0-2596BE?logo=trpc)](https://trpc.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green?logo=drizzle)](https://orm.drizzle.team/)

A modern, full-stack e-commerce platform built for **Théo Afrique**, a Congolese
clothing brand. Features a complete admin dashboard, announcement system with
automatic promotions, and magic link authentication.

## ✨ Features

- 🛍️ **Complete E-commerce Platform**: Product catalog, categories, stock management
- 🎯 **Smart Announcement System**: Promotional campaigns with automatic price discounts
- 🔐 **Passwordless Authentication**: Magic link authentication via email
- 👨‍💼 **Admin Dashboard**: Comprehensive management interface for products, categories, and announcements
- 📱 **WhatsApp Integration**: Direct order communication
- 🌍 **Internationalization**: French-first with support for additional languages
- ⚡ **Modern Stack**: Built with the T3 stack for maximum type safety and developer experience

## 🚀 Technology Stack

### Core Technologies
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with SQLite (LibSQL)

### Backend & API
- **API Layer**: [tRPC v11](https://trpc.io/) for end-to-end type safety
- **Authentication**: [NextAuth v5](https://authjs.dev/) with Resend email provider
- **Validation**: [Zod](https://zod.dev/) schemas throughout
- **State Management**: [TanStack Query](https://tanstack.com/query) via tRPC

### Development Experience
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Code Quality**: [Biome](https://biomejs.dev/) (formatter + linter)
- **Type Safety**: End-to-end TypeScript with strict configuration
- **Forms**: [React Hook Form](https://react-hook-form.com/) + Zod resolvers

## 🛠️ Prerequisites

- **Node.js**: v18.17 or later (LTS recommended)
- **pnpm**: v8.0 or later
- **Resend Account**: For magic link email authentication
([sign up here](https://resend.com/))

```bash
# Install pnpm if you haven't already
npm install -g pnpm
```

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd theo-afrique-website
pnpm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# Database
DATABASE_URL="file:./db.sqlite"

# Authentication (Required)
AUTH_SECRET="your-32-character-secret"  # Generate with: openssl rand -base64 32
AUTH_RESEND_KEY="re_your_resend_api_key"
AUTH_URL="http://localhost:3000"

# Admin Setup
ADMIN_EMAIL="your-admin-email@example.com"
```

### 3. Database Setup
```bash
# Initialize database schema
pnpm db:push

# Create your first admin user
pnpm seed:admin
```

### 4. Start Development
```bash
# Start the development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

### 5. Access Admin Dashboard
1. Go to `/login`
2. Enter your admin email (set in `ADMIN_EMAIL`)
3. Check your email for the magic link
4. Click the link to sign in
5. Visit `/dashboard` for the admin interface

## 🔧 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | SQLite database file path | `file:./db.sqlite` |
| `AUTH_SECRET` | Yes | NextAuth secret (32+ chars) | Generate with `openssl rand -base64 32` |
| `AUTH_RESEND_KEY` | Yes | Resend API key for emails | `re_123...` |
| `AUTH_URL` | Production | Application base URL | `https://yourdomain.com` |
| `ADMIN_EMAIL` | Yes | Email for first admin user | `admin@example.com` |
| `NODE_ENV` | No | Environment mode | `development`, `production` |

### 🔑 Generating AUTH_SECRET
```bash
# On Unix systems (macOS, Linux)
openssl rand -base64 32

# On Windows with Git Bash
openssl rand -base64 32

# Alternative (any system with Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 📧 Resend Setup
1. Sign up at [resend.com](https://resend.com/)
2. Verify your domain (this is **crucial** - most authentication issues are due
to unverified domains)
3. Create an API key with sending permissions
4. Add the API key to your `.env` file

> **⚠️ Common Issue**: If you get "fetch failed" errors during login, ensure
your domain is verified in the Resend dashboard.

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (app)/(main)/   # Public pages (products, categories, home)
│   ├── (app)/dashboard/ # Admin dashboard (protected routes)
│   ├── (app)/login/    # Authentication pages
│   ├── api/           # API routes (NextAuth, tRPC)
│   └── _components/   # Shared React components
├── components/ui/      # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and configurations
├── server/           # Backend logic
│   ├── api/routers/  # tRPC API routes (products, categories, etc.)
│   └── db/          # Database schema and connection
├── trpc/            # tRPC client setup
├── types/           # TypeScript type definitions
└── styles/          # Global CSS and Tailwind config
```

## 📊 Database Schema

The application uses a comprehensive schema designed for e-commerce:

- **Authentication**: `users`, `accounts`, `sessions`, `verificationTokens`
- **Core Business**: `products`, `categories`, `announcements`
- **Relationships**: `productsToCategories`, `announcementsToProducts`
- **Audit**: `adminLogs` for tracking admin actions

### Database Management Commands
```bash
# Push schema changes to database
pnpm db:push

# Open Drizzle Studio (visual database editor)
pnpm db:studio

# Generate migrations (for production)
pnpm db:generate

# Run migrations
pnpm db:migrate
```

## 🎯 Key Features Explained

### Announcement System
- Create promotional campaigns with automatic price discounts
- Target specific categories or products
- Priority-based display (only one active announcement at a time)
- Date-based activation and deactivation
- Global announcements affect entire site

### Admin Dashboard
- Role-based access control (admin/user roles)
- Complete CRUD operations for products, categories, and announcements
- Real-time stock management
- Audit logging for all admin actions
- Drag-and-drop interfaces for better UX

### Authentication
- **Magic Link**: No passwords required, login via email
- **Role System**: Automatic admin role assignment for configured email
- **Session Management**: Secure session handling with NextAuth
- **Email Provider**: Resend for reliable email delivery

## 📜 Available Scripts

### Development
```bash
pnpm dev          # Start development server (with Turbo)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm preview      # Build and preview locally
```

### Code Quality
```bash
pnpm check        # Run Biome linter and formatter checks
pnpm check:write  # Auto-fix linting and formatting issues
pnpm typecheck    # Run TypeScript type checking
```

### Database
```bash
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio GUI
pnpm db:generate  # Generate migration files
pnpm db:migrate   # Run migrations
```

### Setup
```bash
pnpm seed:admin   # Create first admin user
```

## 🚀 Deployment (Vercel)

### Prerequisites for Deployment
1. **Resend Domain Verification**: Ensure your domain is verified in Resend dashboard
2. **Environment Variables**: Set all required variables in Vercel dashboard
3. **Database**: Consider upgrading to a hosted SQLite solution for production

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - AUTH_SECRET (generate new for production)
# - AUTH_RESEND_KEY
# - AUTH_URL (your production domain)
# - ADMIN_EMAIL
# - DATABASE_URL (consider Turso or similar for production)
```

### Production Environment Variables
```bash
# In Vercel dashboard, set these environment variables:
AUTH_SECRET="production-secret-32-chars+"
AUTH_RESEND_KEY="re_your_production_key"
AUTH_URL="https://your-domain.com"
ADMIN_EMAIL="admin@your-domain.com"
DATABASE_URL="your-production-db-url"  # Consider Turso for production SQLite
```

## 🐛 Troubleshooting

### Common Issues

#### "fetch failed" during login
- **Cause**: Unverified domain in Resend
- **Solution**: Verify your domain in the Resend dashboard

#### "AUTH_SECRET is required"
- **Cause**: Missing or empty AUTH_SECRET in .env
- **Solution**: Generate a secret with `openssl rand -base64 32`

#### Database connection errors
- **Cause**: Missing or incorrect DATABASE_URL
- **Solution**: Ensure the path in DATABASE_URL points to a writable location

#### TypeScript errors
- **Cause**: Outdated dependencies or configuration issues
- **Solution**: Run `pnpm install` and `pnpm typecheck`

#### Build failures
- **Cause**: Code quality issues
- **Solution**: Run `pnpm check:write` to auto-fix, then `pnpm build`

### Getting Help
If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure your Resend domain is verified
4. Check the browser console and server logs for detailed error messages

## 🤝 Development Guidelines

### Code Style
- **Formatter**: Biome (run `pnpm check:write` before committing)
- **Imports**: Use `~/` alias for src imports
- **Components**: Server Components by default, use `"use client"` only when needed
- **Types**: Prefer `z.infer<typeof Schema>` for Zod schema types
- **Database**: Use Drizzle query API, avoid raw SQL

### TypeScript Standards
- Strict TypeScript configuration enabled
- No `any` types allowed
- Use Zod for runtime validation
- Leverage tRPC for end-to-end type safety

## 📸 Screenshots

*Add screenshots of your admin dashboard and main site here*

## 📄 License

**MIT License with Attribution**

This project is open source and free to use as a template or base for your own
projects. You are welcome to:

- ✅ Use this code for personal or commercial projects
- ✅ Modify and distribute the code
- ✅ Make money with projects based on this code
- ✅ Fork and create your own versions

**Optional but Appreciated:**
- 🙏 Acknowledge the original project in your documentation
- 💝 Consider supporting the original author if this helps you succeed

The only requirement is including the MIT license notice in your project.

## ❤️ Support & Acknowledgments

If this project helps you build something amazing, consider:
- ⭐ Starring this repository
- 💰 [Supporting the author](mailto:nandisamuelsne@proton.me) (optional but appreciated)
- 🐛 Reporting bugs or suggesting improvements
- 📢 Sharing your success stories

#### Contact Information
- Email: `nandisamuelsne <at> proton.me`

---

Built with ❤️ for the Congolese fashion community and the open source world.
