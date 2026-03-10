import type { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen px-4 py-6 lg:px-6">
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <SidebarNav />
        <div className="min-w-0 flex-1">
          <Topbar />
          <main className="mt-6 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
