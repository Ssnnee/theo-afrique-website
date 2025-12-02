import type { Metadata } from "next";
import { Announcement } from "~/app/_components/announcements";
import { CategoriesNav } from "~/app/_components/category-nav";
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "~/app/_components/page-header";

const title = "Decrouvrez nos products par catégorie";
const description =
	"Explorez ici, nos produits de toutes les catégories. Que vous soyez à la recherche de vêtements, d'accessoires ou d'objets d'art, nous avons quelque chose pour chaque passionné de la culture africaine.";

export const metadata: Metadata = {
	title,
	description,
};

export default function CategoriesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<PageHeader>
				<Announcement />
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
			</PageHeader>
			<div className="container px-7 py-4">
				<CategoriesNav />
			</div>
			<div className="container-wrapper flex-1">{children}</div>
		</>
	);
}
