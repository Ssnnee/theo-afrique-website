"use client";
import { api } from "~/trpc/react";
import { ProductList } from "./product-list";
import { ProductListSkeleton } from "./product-list-skeleton";

export function CategoryProducts({ categoryName }: { categoryName: string }) {
	const { data: productList = [], isLoading } =
		api.product.getByCategory.useQuery({
			categoryName,
		});

	return (
		<div>
			{isLoading ? (
				<ProductListSkeleton />
			) : productList.length > 0 ? (
				<ProductList products={productList} />
			) : (
				<p>Pas de produit trouvé pour cette catégorie.</p>
			)}
		</div>
	);
}
