export const AUTH_ERROR_MESSAGES = {
	// NextAuth error types
	Configuration:
		"Erreur de configuration du système. Veuillez contacter le support.",
	AccessDenied:
		"Accès refusé. Vous n'êtes pas autorisé à accéder à cette ressource.",
	Verification:
		"Le lien de vérification a expiré ou est invalide. Veuillez demander un nouveau lien.",
	Default:
		"Une erreur s'est produite lors de la connexion. Veuillez réessayer.",

	// Custom error types
	EmailInvalid: "Veuillez entrer une adresse email valide.",
	EmailRequired: "L'adresse email est requise.",
	RateLimit: "Trop de tentatives. Veuillez attendre avant de réessayer.",
	NetworkError: "Erreur de connexion. Vérifiez votre connexion internet.",
	ServerError: "Erreur serveur. Veuillez réessayer dans quelques instants.",

	// Success messages
	EmailSent: "Email envoyé avec succès ! Vérifiez votre boîte de réception.",
	SignInSuccess: "Connexion réussie ! Redirection en cours...",
} as const;

export type AuthErrorType = keyof typeof AUTH_ERROR_MESSAGES;

export function getAuthErrorMessage(error: string | AuthErrorType): string {
	return (
		AUTH_ERROR_MESSAGES[error as AuthErrorType] || AUTH_ERROR_MESSAGES.Default
	);
}
