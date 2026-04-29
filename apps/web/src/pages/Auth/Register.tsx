import { useState } from 'react';
import { Link } from 'react-router-dom';

import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useRegister } from '../../hooks/useAuth';

export function RegisterPage() {
  const register = useRegister();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <PageHeader
        title="Create account"
        description="Start with a real FinanceOS workspace and we will populate the account from your first clients, invoices, and expenses."
        actions={(
          <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900" to="/">
            Back to homepage
          </Link>
        )}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          register.mutate({ businessName, email, password, currency: 'USD' });
        }}
        data-testid="register-form"
        className="grid gap-4"
      >
        <Label>
          <span>Business name</span>
          <Input
            data-testid="register-business-name"
            placeholder="Northwind Studio"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
          />
        </Label>
        <Label>
          <span>Email</span>
          <Input
            data-testid="register-email"
            placeholder="you@business.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Label>
        <Label>
          <span>Password</span>
          <Input
            data-testid="register-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Label>
        {register.isError ? <FeedbackBanner tone="error" message="Registration failed." /> : null}
        <Button data-testid="register-submit" type="submit">
          {register.isPending ? 'Creating...' : 'Create account'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-medium text-blue-600 transition-colors hover:text-blue-700" to="/login">
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}
