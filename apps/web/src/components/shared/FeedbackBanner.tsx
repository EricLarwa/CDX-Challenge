export function FeedbackBanner(props: {
  tone?: 'success' | 'error' | 'info';
  message: string;
}) {
  const tone = props.tone ?? 'info';
  const palette =
    tone === 'success'
      ? { background: '#ecfdf5', border: '#a7f3d0', color: '#166534' }
      : tone === 'error'
        ? { background: '#fef2f2', border: '#fecaca', color: '#b91c1c' }
        : { background: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' };

  return (
    <div
      style={{
        padding: '0.9rem 1rem',
        borderRadius: '0.9rem',
        border: `1px solid ${palette.border}`,
        background: palette.background,
        color: palette.color,
        fontWeight: 600,
      }}
    >
      {props.message}
    </div>
  );
}
