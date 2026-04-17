import { ButtonLink } from '../components/shared/ButtonLink';
import { PageHeader } from '../components/shared/PageHeader';
import { Card, CardContent } from '../components/ui/card';

export function NotFoundPage() {
  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="404"
        title="That page took an early lunch"
        description="The route is missing, but the rest of FinanceOS is still here and ready to help."
        actions={
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/">Back to dashboard</ButtonLink>
            <ButtonLink to="/reports" tone="secondary">
              Open reports
            </ButtonLink>
          </div>
        }
      />
      <Card>
        <CardContent className="p-5 text-sm leading-6 text-slate-600">
          Try heading back to invoices, expenses, or reports from the sidebar. If you followed an old link, this is a
          good point to jump back into the main workflow and keep moving.
        </CardContent>
      </Card>
    </div>
  );
}
