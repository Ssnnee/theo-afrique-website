import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function EmailSentPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm text-center">
				<div className="flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-4">
						<div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
							<CheckCircle className="size-8 text-green-600 dark:text-green-400" />
						</div>
						<h1 className="font-bold text-2xl">Email envoyé !</h1>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-center gap-2 text-muted-foreground">
							<Mail className="size-4" />
							<span className="text-sm">Vérifiez votre boîte de réception</span>
						</div>

						<p className="text-muted-foreground text-sm leading-relaxed">
							Nous avons envoyé un lien de connexion magique à votre adresse
							email. Cliquez sur le lien dans l'email pour vous connecter à
							votre compte.
						</p>

						<p className="text-muted-foreground text-xs">
							Vous ne voyez pas l'email ? Vérifiez votre dossier spam.
						</p>
					</div>

					<div className="flex flex-col gap-2 w-full">
						<Button asChild className="w-full">
							<Link href="/login">Renvoyer l'email</Link>
						</Button>

						<Button variant="outline" asChild className="w-full">
							<Link href="/">Retour à l'accueil</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
