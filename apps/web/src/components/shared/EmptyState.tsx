import type { ReactNode } from 'react';

import { Card, CardContent } from '../ui/card';

export function EmptyState(props: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <Card className="border-dashed border-slate-300 bg-white/90 shadow-sm">
      <CardContent className="grid gap-3 p-6">
        <strong className="text-lg font-semibold text-slate-950">{props.title}</strong>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">{props.description}</p>
        {props.actions ? <div className="flex flex-wrap gap-3">{props.actions}</div> : null}
      </CardContent>
    </Card>
  );
}
