import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";

export function About() {
	return (
		<Accordion
			type="single"
			collapsible
			className="w-full"
			defaultValue="item-1"
		>
			<AccordionItem value="item-1">
				<AccordionTrigger>Information sur nos produits</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-4 text-balance">
					<p>
						Nous sommes Theo Afrique, une entreprise spécialisée dans la
						conception et la vente de produits de mode et d&apos;accessoires
						inspirés par la richesse et la diversité de la culture africaine.
					</p>
					<p>
						Nos produits sont fabriqués avec des matériaux de haute qualité,
						garantissant durabilité et performance. Chaque article est soumis à
						des contrôles de qualité rigoureux pour assurer la satisfaction de
						nos clients.
					</p>
					<p>
						Nous proposons une large gamme de produits allant des vêtements aux
						accessoires, tous conçus pour répondre aux besoins variés de notre
						clientèle. Notre équipe de designers travaille constamment pour
						introduire de nouvelles tendances et styles.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Détails sur la conception </AccordionTrigger>
				<AccordionContent className="flex flex-col gap-4 text-balance">
					<p>
						Chaque produit est conçu avec une attention particulière aux détails
						et à l&apos;esthétique. Nous utilisons des techniques de conception
						modernes combinées à des éléments traditionnels pour créer des
						pièces uniques qui se démarquent.
					</p>
					<p>
						La conception des produits dure deux semaines suivant la
						confirmation de la commande. Pendant cette période, nous collaborons
						étroitement avec nos clients pour s&apos;assurer que chaque aspect
						du produit répond à leurs attentes. Nous offrons des options de
						personnalisation pour que chaque client puisse avoir un produit qui
						lui est propre.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>Livraisons</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-4 text-balance">
					<p>
						Nous offrons des options de livraison rapide et fiable pour tous nos
						produits. Les commandes sont généralement expédiées dans les 24 à 48
						heures suivant la confirmation de l&apos;achat ou la fin de la
						conception.
					</p>
					<p>
						Tous les produits sont bien emballés pour éviter tout dommage
						pendant le transport. Nous fournissons un numéro de suivi pour que
						nos clients puissent suivre l&apos;état de leur livraison en temps
						réel.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-4">
				<AccordionTrigger>Politique de retours de produits</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-4 text-balance">
					<p>
						Nous nous engageons à la satisfaction de nos clients. Si vous
						n&apos; êtes pas entièrement satisfait de votre achat, vous pouvez
						retourner le produit dans les 30 jours suivant la réception pour un
						remboursement complet ou un échange.
					</p>
					<p>
						Pour initier un retour, veuillez nous contacter avec votre numéro de
						commande et les détails du produit. Les produits doivent être dans
						leur état d&apos;origine, non portés et avec toutes les étiquettes
						attachées. Les frais de retour sont à la charge du client, sauf en
						cas d&apos;erreur de notre part.
					</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
