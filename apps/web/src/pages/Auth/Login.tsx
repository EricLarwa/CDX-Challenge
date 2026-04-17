import { useState } from 'react';

import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
        data-testid="login-form"
        className="grid gap-4"
      >
        <Label>
          <span>Email</span>
          <Input data-testid="login-email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </Label>
        <Label>
          <span>Password</span>
          <Input data-testid="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Label>
        {login.isError ? <FeedbackBanner tone="error" message="Login failed. Check your credentials." /> : null}
        <Button data-testid="login-submit" type="submit">
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
