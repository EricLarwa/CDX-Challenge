import type { ReactNode } from 'react';

export function PageHeader(props: { title: string; eyebrow?: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        {props.eyebrow ? (
          <div className="text-xs uppercase tracking-[0.22em] text-blue-600">
            {props.eyebrow}
          </div>
        ) : null}
        <h2 className="mt-1 text-3xl font-semibold text-slate-950">{props.title}</h2>
        {props.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{props.description}</p> : null}
      </div>
      {props.actions ? <div className="flex flex-wrap gap-3">{props.actions}</div> : null}
    </div>
  );
}
