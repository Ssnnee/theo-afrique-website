import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { ProductSchema } from "~/types";
import { z } from 'zod';
import OrderDialog from "./order-dialog";

export default function ProductCard({ product }: { product: z.infer<typeof ProductSchema> }) {
  const { name, description, price, imageUrl, sizes, colors, stock } = product;

  return (
    <div className="max-w-sm rounded-md overflow-hidden not-dark:shadow-md border p-4 space-y-4 transition duration-300 hover:scale-105">
      <div className="relative w-full aspect-[4/3]">
        <Dialog>
          <DialogTrigger className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover rounded cursor-zoom-in hover:opacity-90 transition-opacity"
            />
          </DialogTrigger>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
            </DialogTitle>
          </DialogHeader>

          <DialogContent className="max-w-sm p-4">
            <Image
              src={imageUrl}
              alt={name}
              width={800}
              height={600}
              className="object-cover rounded"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{name}</h2>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Badge variant={"outline"} key={`size-${size}`}>{size}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Badge variant={"outline"} key={`color-${color}`}>{color}</Badge>
          ))}
        </div>

        <div>
          <Badge variant={stock > 0 ? "default" : "destructive"}>
            {stock > 0 ? "En stock" : "Rupture de stock"}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm">{description}</p>

        <div className="flex items-center justify-between pt-2 gap-3">
          <span className="text-lg font-bold text-foreground">
             {price.toFixed(2)} CFA
          </span>
          <OrderDialog product={product} />
        </div>
      </div>
    </div>
  );
}
