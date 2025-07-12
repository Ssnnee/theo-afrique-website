"use client"
import { api } from "~/trpc/react"
import { ProductList } from "./product-list";

export function LimitedProducts( { limit }: { limit: number }) {
  const { data: productList = [], isLoading } = api.product.getLimited.useQuery({ limit });

  return (
    <div className="flex items-center justify-center">
      {isLoading ? (
        <p>Loading...</p>
      ) :
        productList.length === 0 ? (
          <p>No products found.</p>
        ) : (
            <ProductList products={productList} />
          )
      }
    </div>
  );
}

