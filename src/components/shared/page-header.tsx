import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow ? <Badge className="w-fit">{eyebrow}</Badge> : null}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
