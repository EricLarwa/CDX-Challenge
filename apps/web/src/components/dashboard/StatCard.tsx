import { Card, CardContent } from '../ui/card';

export function StatCard(props: { label: string; value: string; tone?: 'default' | 'success' | 'warning' }) {
  const tones = {
    default: 'text-slate-950',
    success: 'text-emerald-700',
    warning: 'text-amber-700',
  } as const;

  return (
    <Card className="bg-white/95">
      <CardContent className="p-4">
        <div className="text-sm text-slate-500">{props.label}</div>
        <div className={`mt-2 text-2xl font-semibold ${tones[props.tone ?? 'default']}`}>{props.value}</div>
      </CardContent>
    </Card>
  );
}
