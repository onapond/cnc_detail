import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PageLoadingSkeletonProps = {
  summaryCards?: number;
  listItems?: number;
};

export function PageLoadingSkeleton({
  summaryCards = 3,
  listItems = 3,
}: PageLoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-[38rem]" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: summaryCards }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: listItems }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-3xl border border-border/70 p-5">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
