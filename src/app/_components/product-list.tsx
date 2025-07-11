"use client"

import { useMemo, useState, useCallback } from "react"
import { Badge } from "~/components/ui/badge"
import ProductCard from "./product-card"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { z } from "zod"
import { ProductSchema } from "~/types"
import {
  Search,
  X,
  ChevronDown,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu"
import { Separator } from "~/components/ui/separator"


type ProductsProps = {
  products: z.infer<typeof ProductSchema>[]
  className?: string
  categoryId?: number
} & React.HTMLAttributes<HTMLDivElement>

type SortOption = "name" | "price-low" | "price-high" | "stock"
type ViewMode = "grid" | "list"

export function ProductList({ products, className, ...props }: ProductsProps) {
  const [search, setSearch] = useState("")
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])

  const { availableSizes, availableColors, minPrice, maxPrice } = useMemo(() => {
    const sizes = [...new Set(products.flatMap((p) => p.sizes))].sort()
    const colors = [...new Set(products.flatMap((p) => p.colors))].sort()
    const prices = products.map(p => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return {
      availableSizes: sizes,
      availableColors: colors,
      minPrice: min,
      maxPrice: max
    }
  }, [products])

  useState(() => {
    if (minPrice > 0 && maxPrice > 0) {
      setPriceRange([minPrice, maxPrice])
    }
  })

  const toggleSize = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }, [])

  const toggleColor = useCallback((color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSearch("")
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchSearch =
        search === "" ||
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())

      const matchSizes =
        selectedSizes.length === 0 ||
          selectedSizes.some((size) => product.sizes.includes(size))

      const matchColors =
        selectedColors.length === 0 ||
          selectedColors.some((color) => product.colors.includes(color))

      const matchPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchSearch && matchSizes && matchColors && matchPrice
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "stock":
          return b.stock - a.stock
        default:
          return 0
      }
    })

    return filtered
  }, [search, selectedSizes, selectedColors, priceRange, products, sortBy])

  const activeFiltersCount = selectedSizes.length + selectedColors.length + (search ? 1 : 0)

  return (
    <div className={`space-y-6 ${className ?? ""}`} {...props}>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Rechercher des produits"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Filtres</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Size Filters */}
              {availableSizes.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                    Tailles
                  </DropdownMenuLabel>
                  <div className="px-2 py-1">
                    <div className="flex flex-wrap gap-1">
                      {availableSizes.map((size) => (
                        <Badge
                          key={size}
                          onClick={() => toggleSize(size)}
                          variant={selectedSizes.includes(size) ? "default" : "outline"}
                          className="cursor-pointer transition-colors hover:bg-primary/80 text-xs"
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Color Filters */}
              {availableColors.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                    Couleurs
                  </DropdownMenuLabel>
                  <div className="px-2 py-1">
                    <div className="flex flex-wrap gap-1">
                      {availableColors.map((color) => (
                        <Badge
                          key={color}
                          onClick={() => toggleColor(color)}
                          variant={selectedColors.includes(color) ? "default" : "outline"}
                          className="cursor-pointer transition-colors hover:bg-primary/80 text-xs mb-2"
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}


              {activeFiltersCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="text-muted-foreground">
                    <X className="h-4 w-4 mr-2" />
                    Effacer tous les filtres
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Clear Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Effacer
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Trier
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Trier par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortBy === "name"}
                onCheckedChange={() => setSortBy("name")}
              >
                Nom
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "price-low"}
                onCheckedChange={() => setSortBy("price-low")}
              >
                Prix croissant
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "price-high"}
                onCheckedChange={() => setSortBy("price-high")}
              >
                Prix décroissant
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "stock"}
                onCheckedChange={() => setSortBy("stock")}
              >
                Stock
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6" />

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Recherche: "{search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearch("")}
              />
            </Badge>
          )}
          {selectedSizes.map((size) => (
            <Badge
              key={size}
              onClick={() => toggleSize(size)}
              variant="secondary"
              className="flex items-center cursor-pointer gap-1">
              {size}
              <X
                className="h-3 w-3 cursor-pointer"
              />
            </Badge>
          ))}
          {selectedColors.map((color) => (
            <Badge
              key={color}
              onClick={() => toggleColor(color)} variant="secondary"
              className="flex items-center cursor-pointer gap-1">
              {color}
              <X
                className="h-3 w-3 cursor-pointer"
              />
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredAndSortedProducts.length} produit
          {filteredAndSortedProducts.length !== 1 ? "s" : ""} trouvé
          {filteredAndSortedProducts.length !== 1 ? "s" : ""}
        </span>
        {activeFiltersCount > 0 && (
          <span>
            {activeFiltersCount} filtre
            {activeFiltersCount !== 1 ? "s" : ""} actif
            {activeFiltersCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col gap-4"
      }>
        {filteredAndSortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Essayez d'ajuster vos critères de recherche ou de supprimer certains filtres.
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Effacer tous les filtres
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
