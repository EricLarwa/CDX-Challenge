import { Link } from 'react-router-dom';

export function ButtonLink(props: {
  to: string;
  children: string;
  tone?: 'primary' | 'secondary';
}) {
  const tone = props.tone ?? 'primary';

  return (
    <Link
      to={props.to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.8rem 1rem',
        borderRadius: '0.8rem',
        textDecoration: 'none',
        fontWeight: 700,
        background: tone === 'primary' ? '#4f46e5' : 'white',
        color: tone === 'primary' ? 'white' : '#0f172a',
        border: tone === 'primary' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
      }}
    >
      {props.children}
    </Link>
  );
}
