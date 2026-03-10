import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PlaceholderPanelProps = {
  title: string;
  description: string;
  bullets: string[];
};

export function PlaceholderPanel({
  title,
  description,
  bullets,
}: PlaceholderPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {bullets.map((bullet) => (
          <div
            key={bullet}
            className="flex items-start gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground"
          >
            <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
            <span>{bullet}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
