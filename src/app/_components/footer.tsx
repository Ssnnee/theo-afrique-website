"use client";
import {
	FacebookIcon,
	InstagramIcon,
	LucideTwitter,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { capitalizeFirstLetters } from "~/lib/utils";
import { api } from "~/trpc/react";

export function Footer() {
	const currentYear = new Date().getFullYear();
	const [categories] = api.category.getAll.useSuspenseQuery();
	console.log("categories:", categories);

	const footerLinks = {
		company: [
			{ name: "À propos", href: "/about" },
			{ name: "Notre histoire", href: "/story" },
			{ name: "Carrières", href: "/careers" },
			{ name: "Presse", href: "/press" },
		],
		support: [
			{ name: "Contact", href: "#contact" },
			{ name: "Livraison", href: "#about" },
			{ name: "Retour", href: "#about" },
		],
		legal: [],
	};

	const socialLinks = [
		{ name: "Facebook", href: "#", icon: FacebookIcon },
		{ name: "Instagram", href: "#", icon: InstagramIcon },
		{ name: "Twitter", href: "#", icon: LucideTwitter },
	];

	const contactInfo = [
		{ icon: Phone, text: "+242 06 XXX XX XX" },
		{ icon: Mail, text: "contact@theoafrique.com" },
		{ icon: MapPin, text: "Brazzaville, République du Congo" },
	];

	return (
		<footer className="mt-16">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
					<div className="space-y-4 lg:col-span-2">
						<div className="flex items-center space-x-3">
							<Image
								src="/logo.svg"
								width={32}
								height={32}
								alt="Theo Afrique Logo"
								className="h-8 w-8"
							/>
							<span className="font-bold text-xl">Théo Afrique</span>
						</div>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Découvrez l'élégance africaine avec Theo Afrique. Des vêtements
							authentiques qui célèbrent la richesse culturelle de notre
							continent.
						</p>

						<div className="space-y-2">
							{contactInfo.map((item, index) => (
								<div
									key={index}
									className="flex items-center space-x-2 text-muted-foreground text-sm"
								>
									<item.icon className="h-4 w-4 flex-shrink-0" />
									<span>{item.text}</span>
								</div>
							))}
						</div>

						<div className="flex space-x-2">
							{socialLinks.map((social) => (
								<Button
									key={social.name}
									variant="ghost"
									size="icon"
									asChild
									className="h-9 w-9 hover:bg-primary/10"
								>
									<Link href={social.href} aria-label={social.name}>
										<social.icon className="h-4 w-4" />
									</Link>
								</Button>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold text-sm uppercase tracking-wide">
							Entreprise
						</h3>
						<ul className="space-y-2">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold text-sm uppercase tracking-wide">
							Produits
						</h3>
						<ul className="space-y-2">
							{categories.map((category) => (
								<li key={category.id}>
									<Link
										href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{capitalizeFirstLetters(category.name)}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold text-sm uppercase tracking-wide">
							Support
						</h3>
						<ul className="space-y-2">
							{footerLinks.support.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
					<div className="flex flex-col items-center space-y-2 text-muted-foreground text-sm sm:flex-row sm:space-x-4 sm:space-y-0">
						<p className="text-center md:text-left">
							&copy; {currentYear} Theo Afrique. Tous droits réservés.
						</p>
						{/* <div className="flex items-center space-x-4"> */}
						{/*   {footerLinks.legal.map((link, index) => ( */}
						{/*     <span key={link.name} className="flex items-center space-x-4"> */}
						{/*       <Link */}
						{/*         href={link.href} */}
						{/*         className="hover:text-foreground transition-colors" */}
						{/*       > */}
						{/*         {link.name} */}
						{/*       </Link> */}
						{/*       {index < footerLinks.legal.length - 1 && ( */}
						{/*         <span className="text-muted-foreground/50">•</span> */}
						{/*       )} */}
						{/*     </span> */}
						{/*   ))} */}
						{/* </div> */}
					</div>
				</div>
			</div>
		</footer>
	);
}
