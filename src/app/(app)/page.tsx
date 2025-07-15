import Link from "next/link";

import { HydrateClient, api } from "~/trpc/server";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "../_components/page-header";
import { Button } from "~/components/ui/button";
import { About } from "../_components/about";
import { CategoriesNav } from "../_components/category-nav";
import { LimitedProducts } from "../_components/limited-products-list";
import Contact from "../_components/contact";

export default async function Home() {

	void api.post.getLatest.prefetch();
	void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="">
        <PageHeader >
          <PageHeaderHeading>
            Bienvenue chez Theo Afrique
            <span className="text-primary">.</span>
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
          <CategoriesNav />
        </div>
        <LimitedProducts limit={8} />
        <section id='contact' className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h1 className="text-2xl font-bold mb-4"> Laissez-nous un message </h1>
          <div className="sm:ml-5">
          <Contact />
          </div>
        </section>
        <section id='about' className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h1 className="text-2xl font-bold mb-4"> À propos de nous</h1>
          <About />
        </section>
      </main>
    </HydrateClient>
  );
}

