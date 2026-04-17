export function LoadingCard(props: { label?: string }) {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '1rem',
        border: '1px solid #e2e8f0',
        background: 'linear-gradient(180deg, #ffffff, #f8fafc)',
        color: '#64748b',
      }}
    >
      {props.label ?? 'Loading...'}
    </div>
  );
}
