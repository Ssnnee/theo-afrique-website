import { PageHeader } from "~/app/_components/page-header";
import { ProductList } from "~/app/_components/product-list";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  const productList= [
    {
      id: "1",
      name: "T-shirt Traditionnel",
      description: "Un t-shirt inspiré par les motifs traditionnels africains, alliant confort et style.",
      price: 29.99,
      imageUrl: "/1.jpg",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Rouge", "Vert", "Bleu"],
      stock: 50,
    },
    {
      id: "2",
      name: "Crturtrtu",
      description: "tunteun trutretu turterutre",
      price: 80,
      imageUrl: "/2.jpg",
      sizes: ["S", "L", "XL"],
      colors: ["Jaune", "Vert", "Bleu"],
      stock: 8,
    },
    {
      id: "3",
      name: "Adventure T-shirt",
      description: "Un t-shirt inspiré par les motifs traditionnels africains, alliant confort et style.",
      price: 29.99,
      imageUrl: "/5.jpg",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Rouge", "Vert", "Bleu"],
      stock: 50,
    },
  ];

  void api.post.getLatest.prefetch();
  void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="">
        <PageHeader >
          <h1> Tout nos produits </h1>
        </PageHeader >
        <ProductList products={productList} />
      </main>
    </HydrateClient>
  );
}

