import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { HydrateClient, api } from "~/trpc/server";
import { Header } from "./_components/header";

export default async function Home() {
	const hello = await api.post.hello({ text: "from tRPC" });

	void api.post.getLatest.prefetch();

	return (
		<HydrateClient>
			<main className="">
        <Header />
			</main>
		</HydrateClient>
	);
}
