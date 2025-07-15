"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"

import { capitalizeFirstLetters, cn } from "~/lib/utils"
import { api } from "~/trpc/react"


export function CategoriesNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname()
  const [categories] = api.category.getAll.useSuspenseQuery()
  console.log("categories:", categories)
  const defautCategory = {
    name: "Tous les produits",
    href: "/categories",
  }

  const links = categories.map((category) => ({
    name: capitalizeFirstLetters(category.name),
    href: `/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`,
  }))

  const allCategories = [
    defautCategory,
    ...links,
  ]
  return (
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("flex items-center", className)} {...props}>
          {allCategories.map((category, index) => (
            <Link
              href={category.href}
              key={category.href}
              className={cn(
                "flex h-7 shrink-0 items-center justify-center rounded-full px-4 text-center text-sm font-medium transition-colors hover:text-primary",
                pathname?.endsWith(category.href) ||
                  (index === 0 && pathname === "/categories")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground"
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
  )
}
