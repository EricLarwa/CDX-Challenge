import { Card, CardContent } from '../ui/card';

import { Skeleton } from './Skeleton';

export function ListSkeleton(props: { rows?: number; showHeader?: boolean }) {
  const rows = props.rows ?? 4;

  return (
    <div className="grid gap-3">
      {props.showHeader ? (
        <Card>
          <CardContent className="grid gap-4 p-5 md:grid-cols-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : null}
      {Array.from({ length: rows }).map((_, index) => (
        <Card key={index}>
          <CardContent className="grid gap-3 p-5">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-44" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
