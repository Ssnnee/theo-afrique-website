import { SignIn } from "~/app/_components/sign-in";
import { auth } from "~/lib/auth";

export default async function LoginPage() {
	const session = await auth();

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignIn isAuthenticated={!!session} />
			</div>
		</div>
	);
}
