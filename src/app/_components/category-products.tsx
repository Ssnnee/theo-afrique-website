"use client"
import { api } from "~/trpc/react"
import { ProductList } from "./product-list";

export function CategoryProducts({ categoryName }: { categoryName: string }) {
  const { data: productList = [], isLoading } = api.product.getByCategory.useQuery({
    categoryName
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        productList.length > 0 ? (
          <ProductList products={productList} />
        ) : (
          <p>No products found in this category.</p>
        )
      )}
    </div>
  );
}

