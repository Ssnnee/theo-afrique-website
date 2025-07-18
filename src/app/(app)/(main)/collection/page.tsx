import { LastestProduct } from "~/app/_components/collection";
import { HydrateClient, api } from "~/trpc/server";

export default async function CollectionPage() {
  void api.product.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="">
        <div className="container mx-auto px-4 py-8">
          <LastestProduct />
        </div>
      </main>
    </HydrateClient>
  );
}

