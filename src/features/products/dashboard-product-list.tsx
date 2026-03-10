"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Clock3, CopyPlus, Search, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ProductRowActions } from "./product-row-actions";
import type { Product } from "./products.types";

type DashboardProductItem = {
  product: Product;
  latestVersionNumber: number | null;
};

type DashboardProductListProps = {
  items: DashboardProductItem[];
};

type SortOption = "updated-desc" | "updated-asc" | "name-asc";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function DashboardProductList({ items }: DashboardProductListProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("updated-desc");
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(items.map((item) => item.product.category)))],
    [items],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const nextItems = items.filter(({ product }) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.productName.toLowerCase().includes(normalizedQuery) ||
        product.targetCustomer.toLowerCase().includes(normalizedQuery) ||
        product.tastingNotes.some((note) =>
          note.toLowerCase().includes(normalizedQuery),
        );

      return matchesCategory && matchesQuery;
    });

    return [...nextItems].sort((left, right) => {
      if (sort === "name-asc") {
        return left.product.productName.localeCompare(right.product.productName);
      }

      const leftTime = new Date(left.product.updatedAt).getTime();
      const rightTime = new Date(right.product.updatedAt).getTime();

      return sort === "updated-asc" ? leftTime - rightTime : rightTime - leftTime;
    });
  }, [category, deferredQuery, items, sort]);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle>Product workspace</CardTitle>
          <CardDescription>
            Search, filter, sort, and act on saved products from one surface.
          </CardDescription>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.4fr_0.7fr_0.7fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product name, audience, or tasting notes"
              className="pl-11"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All categories" : option}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
          >
            <option value="updated-desc">Newest updated</option>
            <option value="updated-asc">Oldest updated</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          {filteredItems.length} of {items.length} products shown
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/70 px-5 py-10 text-center text-sm text-muted-foreground">
            No products match the current search or filter settings.
          </div>
        ) : (
          filteredItems.map(({ product, latestVersionNumber }) => (
            <div
              key={product.id}
              className="space-y-4 rounded-3xl border border-border/70 bg-secondary/30 px-5 py-4"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-lg font-medium hover:underline"
                    >
                      {product.productName}
                    </Link>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      Updated {formatDate(product.updatedAt)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {latestVersionNumber
                        ? `Generated v${latestVersionNumber}`
                        : "No generated output yet"}
                    </span>
                  </div>
                  <p className="max-w-3xl text-sm text-muted-foreground">
                    {product.targetCustomer}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tastingNotes.slice(0, 4).map((note) => (
                      <Badge key={note}>{note}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 xl:min-w-[260px]">
                  <ProductRowActions productId={product.id} compact />
                  {latestVersionNumber ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/products/${product.id}/results`}>
                        <CopyPlus className="h-4 w-4" />
                        View latest output
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
