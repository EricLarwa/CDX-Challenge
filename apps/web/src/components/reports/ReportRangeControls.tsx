type ReportRangeControlsProps = {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
};

export function ReportRangeControls(props: ReportRangeControlsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(180px, 220px))',
        gap: '0.75rem',
        padding: '1rem',
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
      }}
    >
      <label style={{ display: 'grid', gap: '0.35rem' }}>
        <span style={{ color: '#475569', fontSize: '0.9rem' }}>From</span>
        <input
          type="date"
          value={props.from}
          onChange={(event) => props.onFromChange(event.target.value)}
          style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
        />
      </label>
      <label style={{ display: 'grid', gap: '0.35rem' }}>
        <span style={{ color: '#475569', fontSize: '0.9rem' }}>To</span>
        <input
          type="date"
          value={props.to}
          onChange={(event) => props.onToChange(event.target.value)}
          style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
        />
      </label>
    </div>
  );
}
