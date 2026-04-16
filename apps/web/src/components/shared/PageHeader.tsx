import type { ReactNode } from 'react';

export function PageHeader(props: { title: string; eyebrow?: string; description?: string; actions?: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
      <div>
        {props.eyebrow ? (
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6366f1' }}>
            {props.eyebrow}
          </div>
        ) : null}
        <h2 style={{ margin: '0.3rem 0', fontSize: '2rem', color: '#0f172a' }}>{props.title}</h2>
        {props.description ? <p style={{ margin: 0, color: '#475569' }}>{props.description}</p> : null}
      </div>
      {props.actions ? <div>{props.actions}</div> : null}
    </div>
  );
}
