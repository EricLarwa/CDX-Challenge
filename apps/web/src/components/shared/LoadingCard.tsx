import { Card, CardContent } from '../ui/card';

import { Skeleton } from './Skeleton';

export function LoadingCard(props: { label?: string }) {
  return (
    <Card className="border-dashed bg-slate-50">
      <CardContent className="grid gap-3 p-4">
        <Skeleton className="h-4 w-36" />
        <div className="text-sm text-slate-500">{props.label ?? 'Loading...'}</div>
      </CardContent>
    </Card>
  );
}
