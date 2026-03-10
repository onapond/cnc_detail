"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

import { deleteProductRequest, duplicateProductRequest } from "./products.api";

type ProductRowActionsProps = {
  productId: string;
  redirectOnDeleteTo?: string;
  compact?: boolean;
};

export function ProductRowActions({
  productId,
  redirectOnDeleteTo,
  compact = false,
}: ProductRowActionsProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isDeleteArmed, setIsDeleteArmed] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isDeleteArmed) {
      return;
    }

    const timer = window.setTimeout(() => setIsDeleteArmed(false), 3000);
    return () => window.clearTimeout(timer);
  }, [isDeleteArmed]);

  function handleDuplicate() {
    startTransition(async () => {
      try {
        const { product } = await duplicateProductRequest(productId);
        pushToast({
          tone: "success",
          title: "Product duplicated",
          description: "The copied draft is now open for editing.",
        });
        router.refresh();
        router.push(`/products/${product.id}`);
      } catch (error) {
        pushToast({
          tone: "error",
          title: "Duplicate failed",
          description:
            error instanceof Error ? error.message : "Please try again shortly.",
        });
      }
    });
  }

  function handleDelete() {
    if (!isDeleteArmed) {
      setIsDeleteArmed(true);
      pushToast({
        tone: "info",
        title: "Press delete again to confirm",
        description: "This also removes related generated outputs.",
      });
      return;
    }

    startTransition(async () => {
      try {
        await deleteProductRequest(productId);
        pushToast({
          tone: "success",
          title: "Product deleted",
        });
        router.refresh();

        if (redirectOnDeleteTo) {
          router.push(redirectOnDeleteTo);
        }
      } catch (error) {
        pushToast({
          tone: "error",
          title: "Delete failed",
          description:
            error instanceof Error ? error.message : "Please try again shortly.",
        });
      } finally {
        setIsDeleteArmed(false);
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size={compact ? "sm" : "default"}>
          <Link href={`/products/${productId}`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size={compact ? "sm" : "default"}
          onClick={handleDuplicate}
          disabled={isPending}
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </Button>
        <Button
          type="button"
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={handleDelete}
          disabled={isPending}
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleteArmed ? "Confirm delete" : "Delete"}
        </Button>
      </div>
      {isDeleteArmed ? (
        <p className="text-sm text-destructive">
          Press delete again within 3 seconds to remove this product.
        </p>
      ) : null}
    </div>
  );
}
