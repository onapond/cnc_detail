import Link from "next/link";
import {
  FilePenLine,
  FolderPlus,
  Gauge,
  Settings2,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation";

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Dashboard",
    description: "Overview and recent products",
    icon: Gauge,
  },
  {
    href: "/products/new",
    label: "New Product",
    description: "Create a product draft",
    icon: FolderPlus,
  },
  {
    href: "/products/sample-product",
    label: "Product Detail",
    description: "Edit an existing product",
    icon: FilePenLine,
  },
  {
    href: "/products/sample-product/results",
    label: "Generated Results",
    description: "Review output tabs",
    icon: Sparkles,
  },
  {
    href: "/settings/brand-rules",
    label: "Brand Rules",
    description: "Manage global brand voice",
    icon: Settings2,
  },
];

export function SidebarNav() {
  return (
    <aside className="hidden w-80 shrink-0 xl:block">
      <div className="admin-surface sticky top-6 flex min-h-[calc(100vh-3rem)] flex-col px-6 py-8">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
            CNC TECH
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Detail Page Admin
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Desktop-first internal workspace for product copy operations.
          </p>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex rounded-3xl border border-transparent px-4 py-4 transition-colors",
                "hover:border-border hover:bg-secondary/40",
              )}
            >
              <item.icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div className="ml-3">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm leading-5 text-muted-foreground">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-primary px-5 py-5 text-primary-foreground">
          <p className="text-sm font-medium">Phase 1 setup</p>
          <p className="mt-2 text-sm/6 text-primary-foreground/80">
            Placeholder pages are wired. Product logic, APIs, and generation start next.
          </p>
        </div>
      </div>
    </aside>
  );
}
