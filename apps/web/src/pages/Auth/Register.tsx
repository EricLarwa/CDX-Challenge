import { useState } from 'react';

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
      <PageHeader title="Create account" description="A lightweight registration flow is in place so we can move through the protected app." />
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
          <Input value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
        </Label>
        <Label>
          <span>Email</span>
          <Input value={email} onChange={(event) => setEmail(event.target.value)} />
        </Label>
        <Label>
          <span>Password</span>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Label>
        {register.isError ? <FeedbackBanner tone="error" message="Registration failed." /> : null}
        <Button data-testid="register-submit" type="submit">
          {register.isPending ? 'Creating...' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}
