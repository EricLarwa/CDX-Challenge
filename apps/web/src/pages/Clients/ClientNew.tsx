import type { CreateClientInput } from '@financeos/shared';
import { createClientSchema } from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';

import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useCreateClient } from '../../hooks/useClients';

type ClientFormValues = z.input<typeof createClientSchema>;

const defaultValues: ClientFormValues = {
  name: '',
  email: undefined,
  phone: undefined,
  address: undefined,
  paymentTerms: 30,
  notes: undefined,
};

export function ClientNewPage() {
  const navigate = useNavigate();
  const createClient = useCreateClient();
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues,
  });

  return (
    <div className="grid gap-4">
      <PageHeader
        title="New client"
        description="Capture the basics once so invoicing, payment terms, and reporting all have a clean home."
      />
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          const payload: CreateClientInput = {
            name: values.name,
            email: values.email || undefined,
            phone: values.phone || undefined,
            address: values.address || undefined,
            paymentTerms: Number(values.paymentTerms),
            notes: values.notes || undefined,
          };
          const client = await createClient.mutateAsync(payload);
          navigate(`/clients/${client.id}`, { state: { notice: 'Client created successfully.' } });
        })}
      >
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-2">
            <Label>
              <span>Name</span>
              <Input {...form.register('name')} />
            </Label>
            <Label>
              <span>Email</span>
              <Input type="email" {...form.register('email')} />
            </Label>
            <Label>
              <span>Phone</span>
              <Input {...form.register('phone')} />
            </Label>
            <Label>
              <span>Payment terms (days)</span>
              <Input type="number" min="0" max="120" {...form.register('paymentTerms', { valueAsNumber: true })} />
            </Label>
            <Label className="lg:col-span-2">
              <span>Address</span>
              <Textarea rows={3} {...form.register('address')} />
            </Label>
            <Label className="lg:col-span-2">
              <span>Notes</span>
              <Textarea rows={4} {...form.register('notes')} />
            </Label>
          </CardContent>
        </Card>

        {createClient.isError ? <FeedbackBanner tone="error" message="Could not create client." /> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit">{createClient.isPending ? 'Saving client...' : 'Create client'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/clients')}>
            Back to clients
          </Button>
        </div>
      </form>
    </div>
  );
}
