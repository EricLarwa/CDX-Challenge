import type { CreateVendorInput } from '@financeos/shared';
import { createVendorSchema } from '@financeos/shared';
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
import { useCreateVendor } from '../../hooks/useVendors';

type VendorFormValues = z.input<typeof createVendorSchema>;

const defaultValues: VendorFormValues = {
  name: '',
  category: undefined,
  email: undefined,
  notes: undefined,
};

export function VendorNewPage() {
  const navigate = useNavigate();
  const createVendor = useCreateVendor();
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(createVendorSchema),
    defaultValues,
  });

  return (
    <div className="grid gap-4">
      <PageHeader
        title="New vendor"
        description="Add a vendor profile so spend, categories, and billing details stay attached to the right partner."
      />
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          const payload: CreateVendorInput = {
            name: values.name,
            category: values.category || undefined,
            email: values.email || undefined,
            notes: values.notes || undefined,
          };
          await createVendor.mutateAsync(payload);
          navigate('/vendors', { state: { notice: 'Vendor created successfully.' } });
        })}
      >
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-2">
            <Label>
              <span>Name</span>
              <Input {...form.register('name')} />
            </Label>
            <Label>
              <span>Category</span>
              <Input {...form.register('category')} placeholder="Software, contractor, utilities..." />
            </Label>
            <Label className="lg:col-span-2">
              <span>Email</span>
              <Input type="email" {...form.register('email')} />
            </Label>
            <Label className="lg:col-span-2">
              <span>Notes</span>
              <Textarea rows={4} {...form.register('notes')} />
            </Label>
          </CardContent>
        </Card>

        {createVendor.isError ? <FeedbackBanner tone="error" message="Could not create vendor." /> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit">{createVendor.isPending ? 'Saving vendor...' : 'Create vendor'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/vendors')}>
            Back to vendors
          </Button>
        </div>
      </form>
    </div>
  );
}
