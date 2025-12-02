import { Footer } from "../../_components/footer";
import { Header } from "../../_components/header";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div data-wrapper="" className="flex flex-1 flex-col border-grid">
			<Header />
			<main className="flex flex-1 flex-col">{children}</main>
			<Footer />
		</div>
	);
}
