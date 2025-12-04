"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

export default function ProductsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	// Fetch products data
	const {
		data: products = [],
		isLoading,
		refetch,
	} = api.product.getAll.useQuery();

	// Filter products based on search
	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-muted-foreground">Loading products...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Products</h1>
					<p className="text-muted-foreground">
						Manage your product inventory and pricing.
					</p>
				</div>
				<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Product
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Add New Product</DialogTitle>
						</DialogHeader>
						<ProductForm
							onSuccess={() => {
								setIsCreateDialogOpen(false);
								refetch();
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Search Products</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-2">
						<Search className="h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search products by name or description..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-1"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Products Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Products ({filteredProducts.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredProducts.length === 0 ? (
						<div className="text-center py-8">
							<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium">No products found</h3>
							<p className="text-muted-foreground">
								{searchTerm
									? "Try adjusting your search."
									: "Get started by adding your first product."}
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Stock</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Discount</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredProducts.map((product) => (
									<TableRow key={product.id}>
										<TableCell>
											<div className="flex items-center space-x-3">
												<img
													src={product.imageUrl}
													alt={product.name}
													className="h-10 w-10 rounded object-cover"
												/>
												<div>
													<div className="font-medium">{product.name}</div>
													<div className="text-sm text-muted-foreground">
														{product.description.slice(0, 50)}...
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="space-y-1">
												{product.hasDiscount && product.discountedPrice ? (
													<>
														<div className="font-medium">
															{product.discountedPrice.toLocaleString()} CFA
														</div>
														<div className="text-sm text-muted-foreground line-through">
															{product.price.toLocaleString()} CFA
														</div>
													</>
												) : (
													<div className="font-medium">
														{product.price.toLocaleString()} CFA
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="font-medium">{product.stock}</div>
										</TableCell>
										<TableCell>
											<Badge
												variant={product.stock > 0 ? "default" : "destructive"}
											>
												{product.stock > 0 ? "In Stock" : "Out of Stock"}
											</Badge>
										</TableCell>
										<TableCell>
											{product.hasDiscount ? (
												<Badge variant="secondary">
													-{product.discountPercentage}%
												</Badge>
											) : (
												<span className="text-muted-foreground">None</span>
											)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end space-x-2">
												<Button variant="ghost" size="sm">
													<Edit className="h-4 w-4" />
												</Button>
												<Button variant="ghost" size="sm">
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function ProductForm({ onSuccess }: { onSuccess: () => void }) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		imageUrl: "",
		sizes: "",
		colors: "",
		stock: "",
	});

	return (
		<form className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="name">Product Name</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="Enter product name"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="price">Price (CFA)</Label>
					<Input
						id="price"
						type="number"
						value={formData.price}
						onChange={(e) =>
							setFormData({ ...formData, price: e.target.value })
						}
						placeholder="0"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={formData.description}
					onChange={(e) =>
						setFormData({ ...formData, description: e.target.value })
					}
					placeholder="Product description"
					rows={3}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="imageUrl">Image URL</Label>
				<Input
					id="imageUrl"
					value={formData.imageUrl}
					onChange={(e) =>
						setFormData({ ...formData, imageUrl: e.target.value })
					}
					placeholder="https://example.com/image.jpg"
				/>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="sizes">Sizes (comma-separated)</Label>
					<Input
						id="sizes"
						value={formData.sizes}
						onChange={(e) =>
							setFormData({ ...formData, sizes: e.target.value })
						}
						placeholder="S, M, L, XL"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="colors">Colors (comma-separated)</Label>
					<Input
						id="colors"
						value={formData.colors}
						onChange={(e) =>
							setFormData({ ...formData, colors: e.target.value })
						}
						placeholder="Red, Blue, Green"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="stock">Stock Quantity</Label>
					<Input
						id="stock"
						type="number"
						value={formData.stock}
						onChange={(e) =>
							setFormData({ ...formData, stock: e.target.value })
						}
						placeholder="0"
					/>
				</div>
			</div>

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline">
					Cancel
				</Button>
				<Button type="submit">Add Product</Button>
			</div>
		</form>
	);
}
