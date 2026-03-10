import { PageLoadingSkeleton } from "@/components/shared/page-loading-skeleton";

export default function ProductResultsLoading() {
  return <PageLoadingSkeleton summaryCards={4} listItems={2} />;
}
