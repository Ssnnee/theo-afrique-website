"use client";

import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/toast-provider";
import { getAuthErrorMessage } from "~/lib/auth-errors";
import { signIn } from "next-auth/react";

interface SignInProps {
	isAuthenticated?: boolean;
}

export function SignIn({ isAuthenticated = false }: SignInProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

	// Rate limiting: 1 attempt per 10 seconds
	const RATE_LIMIT_MS = 10000;

	// Handle URL parameters for auth errors/messages
	useEffect(() => {
		const error = searchParams.get("error");
		const message = searchParams.get("message");

		if (error) {
			toast({
				title: "Erreur de connexion",
				description: getAuthErrorMessage(error),
				variant: "destructive",
			});
			// Clear error from URL without page reload
			const url = new URL(window.location.href);
			url.searchParams.delete("error");
			window.history.replaceState({}, "", url.toString());
		}

		if (message) {
			toast({
				title: "Information",
				description: message,
				variant: "default",
			});
			// Clear message from URL without page reload
			const url = new URL(window.location.href);
			url.searchParams.delete("message");
			window.history.replaceState({}, "", url.toString());
		}
	}, [searchParams, toast]);

	const validateEmail = (email: string): string | null => {
		if (!email.trim()) {
			return getAuthErrorMessage("EmailRequired");
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email.trim())) {
			return getAuthErrorMessage("EmailInvalid");
		}

		return null;
	};

	const checkRateLimit = (): boolean => {
		const now = Date.now();
		if (now - lastSubmitTime < RATE_LIMIT_MS) {
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate email
		const emailError = validateEmail(email);
		if (emailError) {
			toast({
				title: "Email invalide",
				description: emailError,
				variant: "destructive",
			});
			return;
		}

		// Check rate limiting
		if (!checkRateLimit()) {
			const remainingTime = Math.ceil(
				(RATE_LIMIT_MS - (Date.now() - lastSubmitTime)) / 1000,
			);
			toast({
				title: "Trop de tentatives",
				description: `Veuillez attendre ${remainingTime} secondes avant de réessayer.`,
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		setLastSubmitTime(Date.now());

		try {
			const result = await signIn("resend", {
				email: email.trim(),
				redirect: false,
			});

			if (result?.error) {
				// Handle specific errors
				toast({
					title: "Erreur de connexion",
					description: getAuthErrorMessage(result.error),
					variant: "destructive",
				});
			} else {
				// Success - email was sent
				toast({
					title: "Email envoyé !",
					description: getAuthErrorMessage("EmailSent"),
					variant: "default",
				});

				// Redirect to email sent page after short delay
				setTimeout(() => {
					router.push("/login/email-sent");
				}, 1500);
			}
		} catch (error) {
			console.error("Sign in error:", error);
			toast({
				title: "Erreur",
				description: getAuthErrorMessage("ServerError"),
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isAuthenticated) {
		return (
			<div className="flex flex-col items-center gap-2">
				<h1 className="font-bold text-xl">Vous êtes déjà connecté</h1>
				<p className="text-muted-foreground text-sm">
					Vous pouvez accéder à votre tableau de bord.
				</p>
				<Button size="sm" className="mt-4" asChild>
					<Link href="/dashboard">Accéder au tableau de bord</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-center gap-2">
					<a href="#" className="flex flex-col items-center gap-2 font-medium">
						<div className="flex size-8 items-center justify-center rounded-md">
							<GalleryVerticalEnd className="size-6" />
						</div>
						<span className="sr-only">Théo Afrique</span>
					</a>
					<h1 className="font-bold text-xl">Bienvenue au tableau de bord</h1>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-3">
				<Input
					required
					type="email"
					name="email"
					placeholder="Votre adresse email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading}
				/>
				<Button
					type="submit"
					size="sm"
					className="w-full"
					disabled={isLoading || !email.trim()}
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Envoi en cours...
						</>
					) : (
						"Se connecter"
					)}
				</Button>
			</form>

			<p className="text-center text-xs text-muted-foreground">
				Nous vous enverrons un lien magique pour vous connecter sans mot de
				passe.
			</p>
		</div>
	);
}
