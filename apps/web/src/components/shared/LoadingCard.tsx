import { Card, CardContent } from '../ui/card';

export function LoadingCard(props: { label?: string }) {
  return (
    <Card className="border-dashed bg-slate-50">
      <CardContent className="p-4 text-sm text-slate-500">{props.label ?? 'Loading...'}</CardContent>
    </Card>
  );
}
