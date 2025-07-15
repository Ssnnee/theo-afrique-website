import { CategoryProducts } from "~/app/_components/category-products";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home( { params }: { params: { category: string } }) {
  const { category } = await params;
  void api.product.getByCategory.prefetch({ categoryName: category })

  return (
    <HydrateClient>
      <main className="">
        <div className="flex items-center justify-center">
          <CategoryProducts categoryName={category} />
        </div>
      </main>
    </HydrateClient>
  );
}

