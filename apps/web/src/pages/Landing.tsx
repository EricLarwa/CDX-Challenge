import { ArrowRight, BarChart3, BellRing, FileSpreadsheet, Receipt, Users, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { useAuthStore } from '../stores/auth.store';

const featureHighlights = [
  {
    title: 'Send invoices without breaking focus',
    description:
      'Build line items, track balances, log payments, and keep the receivables picture visible from the same workflow.',
    icon: Receipt,
  },
  {
    title: 'Catch spend patterns earlier',
    description:
      'Log expenses fast, surface recurring costs, and let categorization plus anomaly checks keep the books from drifting.',
    icon: WalletCards,
  },
  {
    title: 'See cash pressure before it arrives',
    description:
      'Turn invoices and expenses into a forward-looking timeline so slow payers and heavy weeks stop being surprises.',
    icon: BarChart3,
  },
  {
    title: 'Keep every client and vendor relationship legible',
    description:
      'Balances, terms, invoice history, and payment behavior all stay connected instead of scattered across tabs and tools.',
    icon: Users,
  },
];

const methods = [
  {
    label: '01',
    title: 'Capture',
    description: 'Turn invoice, expense, and payment activity into one connected operating picture.',
  },
  {
    label: '02',
    title: 'Prioritize',
    description: 'Surface overdue balances, cash gaps, and anomalies with the actions that matter next.',
  },
  {
    label: '03',
    title: 'Coordinate',
    description: 'Give clients, vendors, and internal decisions the same source of financial truth.',
  },
  {
    label: '04',
    title: 'Export',
    description: 'Move from live operations into reports, CSVs, and polished handoff material without rework.',
  },
];

const proofPoints = [
  'Invoice lifecycle with partial payments and PDF delivery',
  'AI-assisted expense categorization with graceful fallbacks',
  'Cash flow, P&L, and accounts receivable views built for action',
];

const closingHighlights = [
  { label: 'Alerts that tell you what to do next', icon: BellRing },
  { label: 'Reports ready for exports and reviews', icon: FileSpreadsheet },
  { label: 'One place to steer clients and vendors', icon: Users },
];

const sectionLinks = [
  { href: '#features', label: 'Features' },
  { href: '#methods', label: 'Methods' },
  { href: '#screens', label: 'Screens' },
] as const;

function SectionEyebrow(props: { children: string }) {
  return <div className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-blue-700">{props.children}</div>;
}

function ProductScreenCard(props: {
  title: string;
  subtitle: string;
  statLabel: string;
  statValue: string;
  chips: string[];
  rows: Array<{ label: string; value: string; tone?: 'default' | 'positive' | 'warning' }>;
  bars?: Array<{ label: string; value: number; tone: string }>;
  accent: string;
  className?: string;
}) {
  const tones = {
    default: 'text-slate-300',
    positive: 'text-emerald-300',
    warning: 'text-amber-300',
  } as const;

  return (
    <div
      className={[
        'finance-card-lift rounded-[1.8rem] border border-white/70 bg-white/95 p-5 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.32)] backdrop-blur',
        props.className ?? '',
      ].join(' ')}
    >
      <div className="rounded-[1.4rem] border border-slate-200 bg-slate-950 px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">{props.subtitle}</div>
            <div className="mt-2 text-xl font-semibold tracking-[-0.05em]">{props.title}</div>
          </div>
          <div className={`h-3 w-20 rounded-full bg-gradient-to-r ${props.accent}`} />
        </div>
        <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
          <div className="text-[0.7rem] uppercase tracking-[0.28em] text-slate-400">{props.statLabel}</div>
          <div className="mt-2 text-3xl font-semibold tracking-[-0.07em] text-white">{props.statValue}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {props.chips.map((chip) => (
              <div key={chip} className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-slate-300">
                {chip}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {props.rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[1fr_auto] items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-slate-200">{row.label}</span>
              <span className={tones[row.tone ?? 'default']}>{row.value}</span>
            </div>
          ))}
        </div>
        {props.bars?.length ? (
          <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
            <div className="space-y-3">
              {props.bars.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-2 flex items-center justify-between text-[0.72rem] uppercase tracking-[0.22em] text-slate-400">
                    <span>{bar.label}</span>
                    <span>{bar.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <div className={`h-full rounded-full bg-gradient-to-r ${bar.tone}`} style={{ width: `${bar.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function LandingPage() {
  const token = useAuthStore((state) => state.token);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.13),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_22%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <header className="px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/80 px-5 py-3 shadow-sm shadow-slate-200/60 backdrop-blur">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-blue-700">FinanceOS</div>
            <div className="mt-1 text-sm text-slate-600">Small business finance, without spreadsheet sprawl.</div>
          </div>
          <nav className="hidden items-center gap-5 md:flex">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 no-underline transition-colors hover:text-slate-950">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-700 no-underline hover:text-slate-950">
              Sign in
            </Link>
            <Link to={token ? '/dashboard' : '/register'} className="no-underline">
              <Button>{token ? 'Open dashboard' : 'Create account'}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 pb-24 sm:px-8 lg:px-12">
        <section className="mx-auto grid max-w-7xl gap-14 pt-10 pb-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:items-start lg:gap-12 lg:pt-20">
          <div className="max-w-3xl">
            <SectionEyebrow>Financial Operating System</SectionEyebrow>
            <h1 className="finance-rise-in mt-6 text-5xl font-semibold leading-[0.93] tracking-[-0.08em] text-slate-950 sm:text-6xl lg:text-7xl">
              Give every dollar a timeline, a status, and a next move.
            </h1>
            <p className="finance-rise-in finance-delay-1 mt-8 max-w-2xl text-lg leading-8 text-slate-600">
              FinanceOS is built for operators who need invoices, expenses, cash flow, and reporting to feel like one calm system instead of
              five disconnected chores.
            </p>
            <div className="finance-rise-in finance-delay-2 mt-10 flex flex-wrap gap-4">
              <Link to={token ? '/dashboard' : '/login'} className="no-underline">
                <Button className="min-w-44">
                  {token ? 'Go to dashboard' : 'Use the product'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register" className="no-underline">
                <Button variant="secondary" className="min-w-44">
                  Start with your business
                </Button>
              </Link>
            </div>
            <div className="finance-rise-in finance-delay-3 mt-12 grid gap-4 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <div key={point} className="finance-card-lift rounded-3xl border border-white/70 bg-white/70 px-5 py-5 shadow-sm shadow-slate-200/70">
                  <div className="text-sm font-medium leading-6 text-slate-700">{point}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="screens" className="relative mx-auto w-full max-w-xl py-8 lg:origin-top lg:scale-[0.86] lg:pt-24 xl:scale-[0.94] xl:pt-16">
            <div className="absolute inset-x-10 top-20 h-72 rounded-full bg-blue-200/50 blur-3xl" />
            <ProductScreenCard
              title="Dashboard pulse"
              subtitle="Receivables"
              statLabel="Health score"
              statValue="82 / 100"
              accent="from-blue-500 via-indigo-500 to-cyan-400"
              chips={['MTD revenue', 'Alerts', 'Cash flow']}
              rows={[
                { label: 'Outstanding invoices', value: '$12,480' },
                { label: 'Overdue follow-ups queued', value: '3 actions', tone: 'warning' },
                { label: 'Net cash trend', value: '+$4,920', tone: 'positive' },
              ]}
              bars={[
                { label: 'Collections pace', value: 74, tone: 'from-blue-500 via-indigo-500 to-cyan-400' },
                { label: 'Expenses covered', value: 82, tone: 'from-emerald-500 via-teal-500 to-cyan-500' },
              ]}
              className="finance-drift-slow relative z-20 ml-auto max-w-[21rem] rotate-[2deg]"
            />
            <ProductScreenCard
              title="Invoice command center"
              subtitle="Operations"
              statLabel="Collections"
              statValue="$8,420 due this month"
              accent="from-amber-500 via-orange-500 to-rose-500"
              chips={['PDF ready', 'Payments', 'Status']}
              rows={[
                { label: 'INV-2026-0004', value: 'Partially paid', tone: 'warning' },
                { label: 'INV-2026-0009', value: 'Sent to client' },
                { label: 'Balance movement', value: '+$1,000 received', tone: 'positive' },
              ]}
              bars={[
                { label: 'Paid', value: 46, tone: 'from-amber-500 via-orange-500 to-rose-500' },
                { label: 'Pending', value: 54, tone: 'from-slate-500 via-slate-400 to-slate-300' },
              ]}
              className="finance-drift-medium relative z-10 -mt-12 mr-auto max-w-[18.5rem] -rotate-[5deg]"
            />
            <ProductScreenCard
              title="Expense signal board"
              subtitle="Forecast"
              statLabel="Expense watch"
              statValue="$3,860 in tracked spend"
              accent="from-emerald-500 via-teal-500 to-cyan-500"
              chips={['Anomalies', 'Recurring', 'Vendors']}
              rows={[
                { label: 'Software spend trending', value: 'Stable' },
                { label: 'Duplicate vendor alert', value: '1 flagged', tone: 'warning' },
                { label: 'Recurring costs mapped', value: '9 items', tone: 'positive' },
              ]}
              bars={[
                { label: 'Software', value: 61, tone: 'from-emerald-500 via-teal-500 to-cyan-500' },
                { label: 'Travel', value: 29, tone: 'from-blue-500 via-indigo-500 to-cyan-400' },
              ]}
              className="finance-drift-fast relative z-30 -mt-10 ml-10 max-w-[18.5rem] rotate-[4deg]"
            />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl py-28">
          <div className="max-w-3xl">
            <SectionEyebrow>What Consumers Notice First</SectionEyebrow>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">
              The product leads with the parts people actually feel in day-to-day operations.
            </h2>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {featureHighlights.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="finance-card-lift rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.35)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-xl">
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-blue-700">Feature</div>
                      <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.06em] text-slate-950">{feature.title}</h3>
                    </div>
                    <div className="rounded-2xl bg-slate-950 p-3 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="methods" className="mx-auto max-w-7xl py-28">
          <div className="max-w-2xl">
            <SectionEyebrow>Methods</SectionEyebrow>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">
              A high-contrast operating rhythm for money in, money out, and what needs attention next.
            </h2>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 md:grid-cols-2">
            {methods.map((method) => (
              <article key={method.label} className="finance-card-lift bg-white px-7 py-10 transition-transform duration-500 hover:-translate-y-1 sm:px-9 sm:py-12">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-slate-400">{method.label}</div>
                <h3 className="mt-6 text-4xl font-semibold tracking-[-0.08em] text-slate-950">{method.title}</h3>
                <p className="mt-5 max-w-md text-base leading-7 text-slate-600">{method.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl py-28">
          <div className="grid gap-10 rounded-[2.5rem] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_36px_100px_-48px_rgba(15,23,42,0.6)] lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-14">
            <div className="max-w-3xl">
              <SectionEyebrow>Launch With Clarity</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl">
                Start on the homepage, then move into the operating system when you are ready to work.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                The front door now sells the value clearly: invoices, expense control, forward cash flow, and cleaner client operations — all
                using the palette and product tone you already established.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to={token ? '/dashboard' : '/login'} className="no-underline">
                <Button className="min-w-44">{token ? 'Enter dashboard' : 'Sign in to continue'}</Button>
              </Link>
              <Link to="/register" className="no-underline">
                <Button variant="secondary" className="min-w-44 border-slate-700 bg-white/5 text-white hover:bg-white/10">
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl pb-12">
          <div className="grid gap-6 md:grid-cols-3">
            {closingHighlights.map(({ label, icon: Icon }) => {
              return (
                <div key={label} className="finance-card-lift rounded-[1.8rem] border border-slate-200 bg-white/80 px-6 py-7 shadow-sm shadow-slate-200/70">
                  <Icon className="h-5 w-5 text-blue-700" />
                  <div className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-slate-950">{label}</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4 md:hidden">
        <nav className="pointer-events-auto mx-auto flex max-w-sm items-center justify-between rounded-full border border-white/80 bg-white/88 px-3 py-2 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-700 no-underline transition-all hover:-translate-y-0.5 hover:bg-slate-950 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
