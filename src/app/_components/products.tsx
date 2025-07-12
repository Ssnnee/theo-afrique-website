"use client"
import { api } from "~/trpc/react"
import { ProductList } from "./product-list";

export function Products() {
  const { data: productList = [], isLoading } = api.product.getAll.useQuery();

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ProductList products={productList} />
      )}
    </div>
  );
}

