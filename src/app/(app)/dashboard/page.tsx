import { HydrateClient } from "~/trpc/server";

export default async function DashboardPage() {

  return (
    <HydrateClient>
      <main className="">
        <div className="container mx-auto px-4 py-8">
          <h1> Tableau de bord</h1>
        </div>
      </main>
    </HydrateClient>
  );
}


