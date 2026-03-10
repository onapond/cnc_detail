import { AlertTriangle, FileSearch, Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatePanelTone = "error" | "empty" | "info";

type StatePanelProps = {
  title: string;
  description?: string;
  body?: string;
  tone?: StatePanelTone;
};

function StateIcon({ tone }: { tone: StatePanelTone }) {
  if (tone === "error") {
    return <AlertTriangle className="h-5 w-5 text-destructive" />;
  }

  if (tone === "empty") {
    return <FileSearch className="h-5 w-5 text-muted-foreground" />;
  }

  return <Info className="h-5 w-5 text-primary" />;
}

export function StatePanel({
  title,
  description,
  body,
  tone = "info",
}: StatePanelProps) {
  return (
    <Card className={tone === "error" ? "border-destructive/30" : undefined}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <StateIcon tone={tone} />
          <div className="space-y-1">
            <CardTitle className={tone === "error" ? "text-destructive" : undefined}>
              {title}
            </CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
        </div>
      </CardHeader>
      {body ? (
        <CardContent className="text-sm text-muted-foreground">{body}</CardContent>
      ) : null}
    </Card>
  );
}
