import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/layout/admin-shell";
import { ToastProvider } from "@/components/ui/toast";

import "./globals.css";

export const metadata: Metadata = {
  title: "CNC TECH Detail Admin",
  description: "Internal admin MVP for CNC TECH product detail page automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AdminShell>{children}</AdminShell>
        </ToastProvider>
      </body>
    </html>
  );
}
