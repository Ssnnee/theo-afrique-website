"use client"
import { api } from "~/trpc/react"
import { ProductList } from "./product-list";
import { ProductListSkeleton } from "./product-list-skeleton";

export function LimitedProducts( { limit }: { limit: number }) {
  const { data: productList = [], isLoading } = api.product.getLimited.useQuery({ limit });

  return (
    <div className="flex items-center justify-center">
      {isLoading ? (
        <ProductListSkeleton />
      ) :
        productList.length === 0 ? (
          <p> Aucun produit trouver </p>
        ) : (
            <ProductList products={productList} />
          )
      }
    </div>
  );
}

