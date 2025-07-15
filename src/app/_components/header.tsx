"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { ModeSwitcher } from "./mode-switch";
import { Separator } from "~/components/ui/separator";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Produits", href: "/categories" },
    { name: "À propos", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper flex h-16 w-full items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-4 text-xl font-bold hover:text-primary transition-colors">
          <Image
            src="/logo.svg"
            width={32}
            height={32}
            alt="Théo Afrique Logo"
            className="h-8 w-8"
          />
          <span> Théo Afrique </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Button key={item.name} variant="ghost" asChild>
              <Link href={item.href} className="font-medium">
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ModeSwitcher />
        </div>

        <div className="flex md:hidden items-center space-x-2">
          <ModeSwitcher />
          <Separator orientation="vertical"/>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="h-9 w-9"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
                <Menu className="h-5 w-5" />
              )}
          </Button>
        </div>
      </div>

      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="border-t">
          <div className="container px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className="w-full justify-start text-left"
                onClick={closeMenu}
              >
                <Link href={item.href} className="font-medium">
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
