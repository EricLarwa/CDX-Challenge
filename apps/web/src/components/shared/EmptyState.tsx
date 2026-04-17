import type { ReactNode } from 'react';

export function EmptyState(props: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '0.75rem',
        padding: '1.5rem',
        background: 'white',
        border: '1px dashed #cbd5e1',
        borderRadius: '1rem',
      }}
    >
      <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{props.title}</strong>
      <p style={{ margin: 0, color: '#64748b' }}>{props.description}</p>
      {props.actions ? <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>{props.actions}</div> : null}
    </div>
  );
}
