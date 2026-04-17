import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { useVendors } from '../../hooks/useVendors';
import { downloadCsv } from '../../lib/export';

export function VendorListPage() {
  const location = useLocation();
  const vendorsQuery = useVendors();
  const vendors = useMemo(() => vendorsQuery.data ?? [], [vendorsQuery.data]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const categories = useMemo(
    () => Array.from(new Set(vendors.map((vendor) => vendor.category).filter(Boolean) as string[])).sort(),
    [vendors],
  );
  const filteredVendors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return vendors.filter((vendor) => {
      const matchesSearch =
        !normalizedSearch ||
        vendor.name.toLowerCase().includes(normalizedSearch) ||
        (vendor.email ?? '').toLowerCase().includes(normalizedSearch);
      const matchesCategory = !category || vendor.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, search, vendors]);

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Vendors"
        description="Vendor records are now coming from the API contract."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadCsv(
                  'financeos-vendors.csv',
                  ['Vendor', 'Category', 'Email'],
                  filteredVendors.map((vendor) => [vendor.name, vendor.category ?? '', vendor.email ?? '']),
                )
              }
            >
              Export CSV
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
            <ButtonLink to="/vendors/new">New vendor</ButtonLink>
            {search || category ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        }
      />
      {typeof location.state === 'object' && location.state && 'notice' in location.state ? (
        <FeedbackBanner tone="success" message={String(location.state.notice)} />
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Vendors in view</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">{filteredVendors.length}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Categories in use</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">{categories.length}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">With billing email</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">
              {filteredVendors.filter((vendor) => Boolean(vendor.email)).length}
            </strong>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-2">
          <Label>
            <span>Search vendors</span>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Vendor name or email" />
          </Label>
          <Label>
            <span>Category</span>
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Label>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {vendorsQuery.isLoading ? <LoadingCard label="Loading vendors..." /> : null}
        {!vendorsQuery.isLoading && filteredVendors.length === 0 ? (
          <EmptyState
            title={vendors.length === 0 ? 'No vendors on file' : 'No vendors match this view'}
            description={
              vendors.length === 0
                ? 'Vendors will show up here as expenses accumulate and spending history becomes useful.'
                : 'Try a different vendor search or broaden the category filter.'
            }
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
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <strong className="text-slate-950">{vendor.name}</strong>
                <span className="text-sm font-medium text-slate-600">{vendor.category ?? 'Uncategorized'}</span>
              </div>
              <div className="mt-1 text-sm text-slate-500">{vendor.email ?? 'No billing email on file'}</div>
              <div className="mt-3">
                <Link to={`/expenses/new?vendorId=${vendor.id}`} className="text-sm font-semibold text-indigo-700 no-underline hover:text-indigo-800">
                  Log expense for this vendor
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
