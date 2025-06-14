import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function Header() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <Image src="logo.svg"
          width={100}
          height={100}
          alt="Theo Afrique Logo"
          className="h-8 w-8"
        />
        <Link href="/" className="text-xl font-bold text-gray-900">
          Theo Afrique
        </Link>
      </div>
      <nav className="space-x-4">
        {navItems.map((item) => (
          <Button key={item.name} variant={"ghost"}>
            <Link href={item.href} className="text-gray-700 hover:text-gray-900">
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
      <Button className="">
        Toggle Theme
      </Button>
    </header>
  );
}
