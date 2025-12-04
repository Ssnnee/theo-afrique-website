import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	// Redirect to login if not authenticated
	if (!session?.user) {
		redirect("/login?callbackUrl=/dashboard");
	}

	// Redirect to home if not admin
	if (session.user.role !== "admin") {
		redirect("/");
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Admin Header */}
			<header className="border-b border-border bg-card">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<div className="flex items-center space-x-4">
						<h1 className="text-xl font-bold">Admin Dashboard</h1>
					</div>

					<div className="flex items-center space-x-4">
						<span className="text-sm text-muted-foreground">
							{session.user.email}
						</span>
						<form
							action={async () => {
								"use server";
								const { signOut } = await import("~/lib/auth");
								await signOut({ redirectTo: "/" });
							}}
						>
							<button
								type="submit"
								className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							>
								Sign Out
							</button>
						</form>
					</div>
				</div>
			</header>

			{/* Admin Navigation */}
			<nav className="border-b border-border bg-muted">
				<div className="container mx-auto px-4">
					<div className="flex space-x-6 py-3">
						<NavLink href="/dashboard">Overview</NavLink>
						<NavLink href="/dashboard/products">Products</NavLink>
						<NavLink href="/dashboard/announcements">Announcements</NavLink>
						<NavLink href="/dashboard/categories">Categories</NavLink>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}

function NavLink({
	href,
	children,
}: { href: string; children: React.ReactNode }) {
	return (
		<a
			href={href}
			className="text-sm font-medium text-foreground hover:text-primary transition-colors relative"
		>
			{children}
		</a>
	);
}
