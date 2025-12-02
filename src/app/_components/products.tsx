"use client";
import { api } from "~/trpc/react";
import { ProductList } from "./product-list";
import { ProductListSkeleton } from "./product-list-skeleton";

export function Products() {
	const { data: productList = [], isLoading } = api.product.getAll.useQuery();

	return (
		<div>
			{isLoading ? (
				<ProductListSkeleton />
			) : (
				<ProductList products={productList} />
			)}
		</div>
	);
}
