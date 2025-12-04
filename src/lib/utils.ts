import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalizeFirstLetters(string: string) {
	return string
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

// Calculate discounted price based on announcement settings
export function calculateDiscount(
	originalPrice: number,
	discountType: "percentage" | "fixed",
	discountValue: number,
): { discountedPrice: number; discountPercentage: number } {
	let discountedPrice: number;
	let discountPercentage: number;

	if (discountType === "percentage") {
		discountPercentage = discountValue;
		discountedPrice = Math.round(originalPrice * (1 - discountValue / 100));
	} else {
		// fixed discount
		discountedPrice = Math.max(0, originalPrice - discountValue);
		discountPercentage = Math.round(
			((originalPrice - discountedPrice) / originalPrice) * 100,
		);
	}

	return { discountedPrice, discountPercentage };
}

// Apply announcement discount to a product
export function applyAnnouncementToProduct(
	product: any,
	announcement: {
		discountType: "percentage" | "fixed";
		discountValue: number;
		scope: "global" | "category" | "product";
		announcementsToProducts?: Array<{ productId: number }>;
		announcementsToCategories?: Array<{ categoryId: number }>;
	} | null,
	productCategories?: number[],
) {
	// Always return the full product with optional discount fields
	const baseProduct = {
		...product,
		hasDiscount: false,
		discountedPrice: undefined,
		discountPercentage: undefined,
	};

	if (!announcement) {
		return baseProduct;
	}

	// Check if announcement applies to this product
	const appliesToProduct =
		announcement.scope === "global" ||
		(announcement.scope === "product" &&
			announcement.announcementsToProducts?.some(
				(ap) => ap.productId === product.id,
			)) ||
		(announcement.scope === "category" &&
			productCategories?.some((catId) =>
				announcement.announcementsToCategories?.some(
					(ac) => ac.categoryId === catId,
				),
			));

	if (!appliesToProduct) {
		return baseProduct;
	}

	const { discountedPrice, discountPercentage } = calculateDiscount(
		product.price,
		announcement.discountType,
		announcement.discountValue,
	);

	return {
		...product,
		discountedPrice,
		discountPercentage,
		hasDiscount: true,
	};
}
