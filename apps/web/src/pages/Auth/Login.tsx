import { useState } from 'react';

import { PageHeader } from '../../components/shared/PageHeader';
import { useLogin } from '../../hooks/useAuth';

export function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState('demo@financeos.app');
  const [password, setPassword] = useState('demo12345');

  return (
    <div>
      <PageHeader title="Login" description="Use the seeded demo account or your own registered account." />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          login.mutate({ email, password });
        }}
        style={{ display: 'grid', gap: '1rem' }}
      >
        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
        {login.isError ? <p style={{ color: '#b91c1c', margin: 0 }}>Login failed. Check your credentials.</p> : null}
        <button type="submit" style={{ padding: '0.9rem 1rem', borderRadius: '0.8rem', border: 0, background: '#4f46e5', color: 'white', fontWeight: 700 }}>
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
