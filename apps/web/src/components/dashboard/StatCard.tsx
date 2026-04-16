export function StatCard(props: { label: string; value: string; tone?: 'default' | 'success' | 'warning' }) {
  const tones = {
    default: '#0f172a',
    success: '#166534',
    warning: '#b45309',
  } as const;

  return (
    <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{props.label}</div>
      <div style={{ marginTop: '0.4rem', fontSize: '1.5rem', fontWeight: 700, color: tones[props.tone ?? 'default'] }}>
        {props.value}
      </div>
    </div>
  );
}
