"use client"
import { api } from "~/trpc/react"
import { ProductList } from "./product-list";

export function LimitedProducts( { limit }: { limit: number }) {
  const { data: productList = [], isLoading } = api.product.getLimited.useQuery({ limit });
  console.log("Here the limited list", productList)

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <ProductList products={productList} />
    </div>
  );
}

