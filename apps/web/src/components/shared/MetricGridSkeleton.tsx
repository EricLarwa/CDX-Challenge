import { Card, CardContent } from '../ui/card';

import { Skeleton } from './Skeleton';

export function MetricGridSkeleton(props: { cards?: number }) {
  const cards = props.cards ?? 3;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <Card key={index}>
          <CardContent className="grid gap-3 p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
