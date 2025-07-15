"use client"
import { api } from "~/trpc/react"
import { ProductList } from "./product-list";
import { ProductListSkeleton } from "./product-list-skeleton";

export function LastestProduct() {
  const { data: productList = [], isLoading } = api.product.getLatest.useQuery();

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


