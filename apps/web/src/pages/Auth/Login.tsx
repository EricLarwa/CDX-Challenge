import { useState } from 'react';
import { Link } from 'react-router-dom';

import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useLogin } from '../../hooks/useAuth';

export function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <PageHeader
        title="Login"
        description="Sign in with your FinanceOS account to get back to invoices, expenses, and cash flow."
        actions={(
          <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900" to="/">
            Back to homepage
          </Link>
        )}
      />
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
          <Input data-testid="login-email" placeholder="you@business.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </Label>
        <Label>
          <span>Password</span>
          <Input
            data-testid="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Label>
        {login.isError ? <FeedbackBanner tone="error" message="Login failed. Check your credentials." /> : null}
        <Button data-testid="login-submit" type="submit">
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        New here?{' '}
        <Link className="font-medium text-blue-600 transition-colors hover:text-blue-700" to="/register">
          Create an account
        </Link>
        .
      </p>
    </div>
  );
}
