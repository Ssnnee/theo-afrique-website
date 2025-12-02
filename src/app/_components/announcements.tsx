import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";

export function Announcement() {
	return (
		<Badge asChild variant="secondary" className="rounded-full">
			<Link href="/collection">
				Nouvelle collection <ArrowRightIcon />
			</Link>
		</Badge>
	);
}
