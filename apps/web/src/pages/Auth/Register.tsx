import { useState } from 'react';

import { PageHeader } from '../../components/shared/PageHeader';
import { useRegister } from '../../hooks/useAuth';

export function RegisterPage() {
  const register = useRegister();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <PageHeader title="Create account" description="A lightweight registration flow is in place so we can move through the protected app." />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          register.mutate({ businessName, email, password, currency: 'USD' });
        }}
        style={{ display: 'grid', gap: '1rem' }}
      >
        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span>Business name</span>
          <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
        {register.isError ? <p style={{ color: '#b91c1c', margin: 0 }}>Registration failed.</p> : null}
        <button type="submit" style={{ padding: '0.9rem 1rem', borderRadius: '0.8rem', border: 0, background: '#4f46e5', color: 'white', fontWeight: 700 }}>
          {register.isPending ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
