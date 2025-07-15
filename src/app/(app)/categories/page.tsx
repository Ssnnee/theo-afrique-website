import { ProductList } from "~/app/_components/product-list";
import { Products } from "~/app/_components/products";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  void api.product.getAll.prefetch();
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
    }, {
      id: "8",
      name: "Pagne",
      description: "Pagne traditionnel africain, parfait pour les occasions spéciales.",
      price: 29.99,
      imageUrl: "/8.jpg",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Rouge", "Vert", "Bleu"],
      stock: 50,
    },
    {
      id: "4",
      name: "Sac à Dos Ethnique",
      description: "Un sac à dos en tissu africain, idéal pour les sorties décontractées.",
      price: 49.99,
      imageUrl: "/3.jpg",
      sizes: ["M", "L"],
      colors: ["Noir", "Brun"],
      stock: 30,
    },
    {
      id: "5",
      name: "Bracelet en Perles",
      description: "Un bracelet fait main avec des perles africaines colorées.",
      price: 19.99,
      imageUrl: "/4.jpg",
      sizes: ["Taille unique"],
      colors: ["Multicolore"],
      stock: 100,
    },
    {
      id: "6",
      name: "Robe Africaine",
      description: "Une robe élégante avec des motifs africains vibrants.",
      price: 59.99,
      imageUrl: "/6.jpg",
      sizes: ["S", "M", "L"],
      colors: ["Bleu", "Rouge"],
      stock: 20,
    },
    {
      id: "7",
      name: "Sandales Artisanales",
      description: "Des sandales faites main avec des matériaux naturels.",
      price: 39.99,
      imageUrl: "/7.jpg",
      sizes: ["38", "39", "40", "41"],
      colors: ["Brun", "Noir"],
      stock: 15,
    },
  ];

  void api.post.getLatest.prefetch();
  void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="">
        <div className="container mx-auto px-4 py-8">
          <ProductList products={productList} />
        </div>
        <Products />
      </main>
    </HydrateClient>
  );
}

