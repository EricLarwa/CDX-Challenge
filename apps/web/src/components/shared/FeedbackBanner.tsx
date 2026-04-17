import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

export function FeedbackBanner(props: {
  tone?: 'success' | 'error' | 'info';
  message: string;
}) {
  const tone = props.tone ?? 'info';
  const palette =
    tone === 'success'
      ? { card: 'border-emerald-200 bg-emerald-50 text-emerald-800', badge: 'success' as const, label: 'Success' }
      : tone === 'error'
        ? { card: 'border-rose-200 bg-rose-50 text-rose-800', badge: 'danger' as const, label: 'Error' }
        : { card: 'border-blue-200 bg-blue-50 text-blue-800', badge: 'info' as const, label: 'Info' };

  return (
    <Card className={palette.card}>
      <CardContent className="flex items-center gap-3 p-4">
        <Badge variant={palette.badge}>{palette.label}</Badge>
        <div className="text-sm font-medium">{props.message}</div>
      </CardContent>
    </Card>
  );
}
