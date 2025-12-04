import {
	Package,
	ShoppingCart,
	TrendingUp,
	Users,
	Megaphone,
	Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HydrateClient } from "~/trpc/server";
import { api } from "~/trpc/server";

export default async function DashboardPage() {
	// Fetch dashboard data
	const [products, announcements] = await Promise.all([
		api.product.getAll(),
		api.announcement.getActive(),
	]);

	const stats = {
		totalProducts: products.length,
		inStockProducts: products.filter((p) => p.stock > 0).length,
		outOfStockProducts: products.filter((p) => p.stock === 0).length,
		totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
		activeAnnouncements: announcements ? 1 : 0,
		lowStockProducts: products.filter((p) => p.stock > 0 && p.stock <= 5)
			.length,
	};

	return (
		<HydrateClient>
			<div className="space-y-8">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome to your admin dashboard. Here's what's happening with your
						store.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Products
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalProducts}</div>
							<p className="text-xs text-muted-foreground">
								{stats.inStockProducts} in stock
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Inventory Value
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats.totalValue.toLocaleString()} CFA
							</div>
							<p className="text-xs text-muted-foreground">
								Total inventory value
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Stock Status
							</CardTitle>
							<Eye className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-yellow-600">
								{stats.lowStockProducts}
							</div>
							<p className="text-xs text-muted-foreground">
								Products low in stock (≤5)
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Announcements
							</CardTitle>
							<Megaphone className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{stats.activeAnnouncements}
							</div>
							<p className="text-xs text-muted-foreground">
								Active promotion{stats.activeAnnouncements !== 1 ? "s" : ""}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<a
								href="/dashboard/products"
								className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted"
							>
								<Package className="h-4 w-4" />
								<span>Manage Products</span>
							</a>
							<a
								href="/dashboard/announcements"
								className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted"
							>
								<Megaphone className="h-4 w-4" />
								<span>Create Announcement</span>
							</a>
							<a
								href="/dashboard/categories"
								className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted"
							>
								<ShoppingCart className="h-4 w-4" />
								<span>Manage Categories</span>
							</a>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{announcements ? (
									<div className="flex items-start space-x-3">
										<Megaphone className="h-4 w-4 mt-0.5 text-green-600" />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">
												{announcements.title}
											</p>
											<p className="text-xs text-muted-foreground">
												Active promotion: {announcements.discountValue}
												{announcements.discountType === "percentage"
													? "%"
													: " CFA"}{" "}
												off
											</p>
										</div>
									</div>
								) : (
									<p className="text-sm text-muted-foreground">
										No active announcements
									</p>
								)}

								{stats.lowStockProducts > 0 && (
									<div className="flex items-start space-x-3">
										<Eye className="h-4 w-4 mt-0.5 text-yellow-600" />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">Low stock alert</p>
											<p className="text-xs text-muted-foreground">
												{stats.lowStockProducts} products running low
											</p>
										</div>
									</div>
								)}

								{stats.outOfStockProducts > 0 && (
									<div className="flex items-start space-x-3">
										<Package className="h-4 w-4 mt-0.5 text-red-600" />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">Out of stock</p>
											<p className="text-xs text-muted-foreground">
												{stats.outOfStockProducts} products need restocking
											</p>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</HydrateClient>
	);
}
