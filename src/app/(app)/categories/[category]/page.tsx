import { PageHeader, PageHeaderHeading } from "~/app/_components/page-header";
import ProductCard from "~/app/_components/product-card";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home( { params }: { params: { category: string } }) {

  const testProduct = {
    id: "1",
    name: "T-shirt Traditionnel",
    description: "Un t-shirt inspiré par les motifs traditionnels africains, alliant confort et style.",
    price: 29.99,
    imageUrl: "/1.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rouge", "Vert", "Bleu"],
    stock: 50,
  };

  return (
    <HydrateClient>
      <main className="">
        <PageHeader >
          <PageHeaderHeading>
            Découvrez nos produits de la catégorie:  {params.category}
          </PageHeaderHeading>

          <ProductCard
            product={testProduct}
          />
        </PageHeader>
      </main>
    </HydrateClient>
  );
}

