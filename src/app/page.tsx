import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
	const hello = await api.post.hello({ text: "from tRPC" });

	void api.post.getLatest.prefetch();

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold"> Theo Afrique </h1>
			</main>
		</HydrateClient>
	);
}
