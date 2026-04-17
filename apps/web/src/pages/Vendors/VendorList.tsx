import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useVendors } from '../../hooks/useVendors';
import { downloadCsv } from '../../lib/export';

export function VendorListPage() {
  const vendorsQuery = useVendors();
  const vendors = vendorsQuery.data ?? [];

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Vendors"
        description="Vendor records are now coming from the API contract."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              downloadCsv(
                'financeos-vendors.csv',
                ['Vendor', 'Category', 'Email'],
                vendors.map((vendor) => [vendor.name, vendor.category ?? '', vendor.email ?? '']),
              )
            }
          >
            Export CSV
          </Button>
        }
      />
      <div className="grid gap-3">
        {vendorsQuery.isLoading ? <LoadingCard label="Loading vendors..." /> : null}
        {!vendorsQuery.isLoading && vendors.length === 0 ? (
          <EmptyState
            title="No vendors on file"
            description="Vendors will show up here as expenses accumulate and spending history becomes useful."
            actions={
              <>
                <ButtonLink to="/expenses/new">Log expense</ButtonLink>
                <ButtonLink to="/expenses/analytics" tone="secondary">
                  Open analytics
                </ButtonLink>
              </>
            }
          />
        ) : null}
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <strong className="text-slate-950">{vendor.name}</strong>
                <span className="text-sm font-medium text-slate-600">{vendor.category ?? 'Uncategorized'}</span>
              </div>
              <div className="mt-1 text-sm text-slate-500">{vendor.email ?? 'No billing email on file'}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
