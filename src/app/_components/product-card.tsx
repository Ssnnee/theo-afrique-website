import Image from "next/image";
import type { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import type { ProductSchema } from "~/types";
import OrderDialog from "./order-dialog";

export default function ProductCard({
	product,
}: { product: z.infer<typeof ProductSchema> }) {
	const { name, description, price, imageUrl, sizes, colors, stock } = product;

	return (
		<div className="max-w-sm space-y-4 overflow-hidden rounded-md border p-4 not-dark:shadow-md transition duration-300 hover:scale-105">
			<div className="relative aspect-[4/3] w-full">
				<Dialog>
					<DialogTrigger className="absolute inset-0">
						<Image
							src={imageUrl}
							alt={name}
							fill
							className="cursor-zoom-in rounded object-cover transition-opacity hover:opacity-90"
						/>
					</DialogTrigger>
					<DialogHeader>
						<DialogTitle className="font-semibold text-lg"></DialogTitle>
					</DialogHeader>

					<DialogContent className="max-w-sm p-4">
						<Image
							src={imageUrl}
							alt={name}
							width={800}
							height={600}
							className="rounded object-cover"
						/>
					</DialogContent>
				</Dialog>
			</div>

			<div className="space-y-2">
				<h2 className="font-semibold text-xl">{name}</h2>

				<div className="flex flex-wrap gap-2">
					{sizes.map((size) => (
						<Badge variant={"outline"} key={`size-${size}`}>
							{size}
						</Badge>
					))}
				</div>

				<div className="flex flex-wrap gap-2">
					{colors.map((color) => (
						<Badge variant={"outline"} key={`color-${color}`}>
							{color}
						</Badge>
					))}
				</div>

				<div>
					<Badge variant={stock > 0 ? "default" : "destructive"}>
						{stock > 0 ? "En stock" : "Rupture de stock"}
					</Badge>
				</div>

				<p className="text-muted-foreground text-sm">{description}</p>

				<div className="flex items-center justify-between gap-3 pt-2">
					<div className="flex flex-col gap-1">
						{product.hasDiscount && product.discountedPrice ? (
							<>
								<div className="flex items-center gap-2">
									<span className="font-bold text-foreground text-lg">
										{product.discountedPrice.toFixed(2)} CFA
									</span>
									<span className="rounded bg-red-500 px-2 py-0.5 font-semibold text-white text-xs">
										-{product.discountPercentage}%
									</span>
								</div>
								<span className="text-muted-foreground text-sm line-through">
									{price.toFixed(2)} CFA
								</span>
							</>
						) : (
							<span className="font-bold text-foreground text-lg">
								{price.toFixed(2)} CFA
							</span>
						)}
					</div>
					<OrderDialog product={product} />
				</div>
			</div>
		</div>
	);
}
