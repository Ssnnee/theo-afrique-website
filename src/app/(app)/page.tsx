import Link from "next/link";

import { HydrateClient, api } from "~/trpc/server";
import { Header } from "../_components/header";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "../_components/page-header";
import { Button } from "~/components/ui/button";
import { Footer } from "../_components/footer";
import { About } from "../_components/about";
import { ProductNav } from "../_components/category-nav";
import { Announcement } from "../_components/announcements";

export default async function Home() {

	void api.post.getLatest.prefetch();
	void api.category.getAll.prefetch();

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
            Où la tradition rencontre l'audace.
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
        <div className="container py-4">
        <ProductNav />
        </div>
        <section className="p-4">
        </section>
        <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h1 className="text-2xl font-bold mb-4"> À propos de nous</h1>
          <About />
        </section>
        <Footer />
      </main>
    </HydrateClient>
  );
}

