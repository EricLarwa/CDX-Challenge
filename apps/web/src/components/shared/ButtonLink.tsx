import { Link } from 'react-router-dom';

import { buttonVariants } from '../ui/button';

export function ButtonLink(props: {
  to: string;
  children: string;
  tone?: 'primary' | 'secondary';
}) {
  const tone = props.tone ?? 'primary';

  return (
    <Link
      to={props.to}
      className={buttonVariants({ variant: tone === 'primary' ? 'default' : 'secondary' })}
      style={{ textDecoration: 'none' }}
    >
      {props.children}
    </Link>
  );
}
