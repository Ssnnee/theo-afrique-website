import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { signIn } from "~/lib/auth"
import { auth } from "~/lib/auth"

export async function SignIn() {
  const session = await auth()

  return (
    <div className="flex flex-col gap-6">
      { !session ? (
      <>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Bienvenue au tableau de bord</h1>
          </div>
        </div>
        <form
          action={async (formData) => {
            "use server"
            await signIn("resend", formData)
          }}
          className="space-y-3"
        >
          <Input required type="text" name="email" placeholder="Email" />
          <Button type="submit" size={"sm"}>Se connecter </Button>
        </form>
      </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">Vous êtes déjà connecté</h1>
          <p className="text-sm text-muted-foreground">
            Vous pouvez accéder à votre tableau de bord.
          </p>
          <Button size="sm" className="mt-4" asChild >
            <Link href="/dashboard">Accéder au tableau de bord</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
