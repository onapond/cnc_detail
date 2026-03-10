import { BellDot, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="admin-surface sticky top-6 z-10 flex items-center justify-between gap-4 px-6 py-4">
      <div>
        <p className="text-sm font-medium text-foreground">Internal Admin MVP</p>
        <p className="text-sm text-muted-foreground">
          Phase 1 focuses on structure, routes, and reusable UI foundations.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden min-w-80 lg:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search placeholder"
            aria-label="Search placeholder"
          />
        </div>
        <Badge variant="outline" className="hidden sm:flex">
          Single admin
        </Badge>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground"
          aria-label="Notifications placeholder"
        >
          <BellDot className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
