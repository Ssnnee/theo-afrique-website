import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sizes: string[];
  colors: string[];
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { name, description, price, imageUrl, sizes, colors, stock } = product;

  return (
    <div className="max-w-sm rounded-md overflow-hidden shadow-md border bg-white p-4 space-y-4">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{name}</h2>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Badge key={`size-${size}`}>{size}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Badge key={`color-${color}`}>{color}</Badge>
          ))}
        </div>

        <div>
          <Badge variant={stock > 0 ? "default" : "destructive"}>
            {stock > 0 ? "En stock" : "Rupture de stock"}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm">{description}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          <Button size="sm">Commander</Button>
        </div>
      </div>
    </div>
  );
}
