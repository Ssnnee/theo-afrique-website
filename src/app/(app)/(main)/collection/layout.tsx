import type { Metadata } from "next";
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "~/app/_components/page-header";

const title = "Decrouvrez nos nouveaux products ";
const description =
	"Explorez ici, les nouveaux produits de toutes les catégories.";

export const metadata: Metadata = {
	title,
	description,
};

export default function CollectionLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<PageHeader>
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
			</PageHeader>
			<div className="container px-7 py-4"></div>
			<div className="container-wrapper flex-1">{children}</div>
		</>
	);
}
