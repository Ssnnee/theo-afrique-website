"use client";

import { useState } from "react";
import { Plus, Tag, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function CategoriesPage() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch categories data
	const {
		data: categories = [],
		isLoading,
		refetch,
	} = api.category.getAll.useQuery();

	// Filter categories based on search
	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-muted-foreground">
					Loading categories...
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Categories</h1>
					<p className="text-muted-foreground">
						Manage product categories and organization.
					</p>
				</div>
				<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Category
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[400px]">
						<DialogHeader>
							<DialogTitle>Add New Category</DialogTitle>
						</DialogHeader>
						<CategoryForm
							onSuccess={() => {
								setIsCreateDialogOpen(false);
								refetch();
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{/* Search */}
			<Card>
				<CardHeader>
					<CardTitle>Search Categories</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-2">
						<Search className="h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search categories..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-1"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Categories Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredCategories.length === 0 ? (
					<div className="col-span-full text-center py-8">
						<Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium">No categories found</h3>
						<p className="text-muted-foreground">
							{searchTerm
								? "Try adjusting your search."
								: "Get started by adding your first category."}
						</p>
					</div>
				) : (
					filteredCategories.map((category) => (
						<Card key={category.id}>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg flex items-center">
										<Tag className="mr-2 h-4 w-4" />
										{category.name}
									</CardTitle>
									<div className="flex items-center space-x-1">
										<Button variant="ghost" size="sm">
											Edit
										</Button>
										<Button variant="ghost" size="sm">
											Delete
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Created {new Date(category.createdAt).toLocaleDateString()}
								</p>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}

function CategoryForm({ onSuccess }: { onSuccess: () => void }) {
	const [name, setName] = useState("");

	const createMutation = api.category.create.useMutation({
		onSuccess: () => {
			onSuccess();
			setName("");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate({ name });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="name">Category Name</Label>
				<Input
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter category name"
					required
				/>
			</div>

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onSuccess}>
					Cancel
				</Button>
				<Button type="submit" disabled={createMutation.isPending}>
					{createMutation.isPending ? "Creating..." : "Add Category"}
				</Button>
			</div>
		</form>
	);
}
