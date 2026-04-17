import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { useVendors } from '../../hooks/useVendors';

export function VendorListPage() {
  const vendorsQuery = useVendors();
  const vendors = vendorsQuery.data ?? [];

  return (
    <div>
      <PageHeader title="Vendors" description="Vendor records are now coming from the API contract." />
      <div style={{ display: 'grid', gap: '0.75rem' }}>
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
          <div key={vendor.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <strong>{vendor.name}</strong>
              <span>{vendor.category ?? 'Uncategorized'}</span>
            </div>
            <div style={{ marginTop: '0.35rem', color: '#64748b' }}>{vendor.email ?? 'No billing email on file'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
