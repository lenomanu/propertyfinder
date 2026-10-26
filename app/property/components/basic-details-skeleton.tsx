import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton({
  labelWidth = "w-24",
  height = "h-10",
}: {
  labelWidth?: string;
  height?: string;
}) {
  return (
    <div className="space-y-2">
      <Skeleton className={`h-4 ${labelWidth}`} />
      <Skeleton className={`${height} w-full`} />
    </div>
  );
}

export default function BasicDetailsSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading property information"
    >
      {/* Page heading */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Title */}
          <FieldSkeleton labelWidth="w-28" />

          {/* Property type + listing type */}
          <div className="grid gap-5 md:grid-cols-2">
            <FieldSkeleton labelWidth="w-28" />
            <FieldSkeleton labelWidth="w-24" />
          </div>

          {/* Price + currency */}
          <div className="grid gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <FieldSkeleton labelWidth="w-12" />
            </div>
            <FieldSkeleton labelWidth="w-16" />
          </div>

          {/* Description */}
          <FieldSkeleton labelWidth="w-24" height="h-28" />
        </CardContent>
      </Card>

      {/* Property Address */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FieldSkeleton labelWidth="w-16" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FieldSkeleton labelWidth="w-28" />
            <FieldSkeleton labelWidth="w-20" />
          </div>
        </CardContent>
      </Card>

      {/* Action button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}