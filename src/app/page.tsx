import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { HydrateClient, api } from "~/trpc/server";
import { Header } from "./_components/header";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "./_components/page-header";
import { Button } from "~/components/ui/button";
import { Announcement } from "./_components/announcements";
import { LatestCollection } from "./_components/collection";

export default async function Home() {
	// const hello = await api.post.hello({ text: "from tRPC" });

	void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="">
        <Header />
        <PageHeader >
        <Announcement />
          <PageHeaderHeading>
            Bienvenue chez Theo Afrique
            <span className="text-primary">.</span>
            <br />
            Où tradition rencontre l'audace
          </PageHeaderHeading>
          <PageHeaderDescription>
            Découvrez l'harmonie parfaite entre l'artisanat traditionnel africain
            et le design contemporain. Explorez notre collection de vêtements,
            accessoires et objets d'art uniques qui célèbrent la richesse de la
            culture africaine.
          </PageHeaderDescription>
          <PageActions>
            <Button asChild size="sm" className="">
              <Link href="/">Nouvelle collection</Link>
            </Button>
          </PageActions>
        </PageHeader>
        <LatestCollection />
        <section className="p-4">
        </section>
      </main>
    </HydrateClient>
  );
}

