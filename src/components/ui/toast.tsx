"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastIcon({ tone }: { tone: ToastTone }) {
  if (tone === "success") {
    return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  }

  if (tone === "error") {
    return <CircleAlert className="h-5 w-5 text-destructive" />;
  }

  return <Info className="h-5 w-5 text-primary" />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function pushToast(toast: Omit<ToastItem, "id">) {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { ...toast, id }]);
  }

  function removeToast(id: number) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => removeToast(toast.id), 3500),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts]);

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-3xl border bg-white/95 px-4 py-4 shadow-panel backdrop-blur",
              toast.tone === "error" ? "border-destructive/30" : "border-border/70",
            )}
          >
            <ToastIcon tone={toast.tone} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground">{toast.title}</div>
              {toast.description ? (
                <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded-full p-1 text-muted-foreground transition hover:bg-secondary"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
