import type { PropsWithChildren, ReactNode } from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<PropsWithChildren, AppErrorBoundaryState> {
  override state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    console.error('FinanceOS UI error boundary caught an error:', error);
  }

  private handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  override render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(194,65,12,0.16),transparent_22%),linear-gradient(135deg,#eff6ff,#f8fafc)] p-4">
        <Card className="w-full max-w-2xl rounded-[1.75rem] border-blue-100 bg-white/95 shadow-xl shadow-blue-100/40">
          <CardContent className="grid gap-5 p-8">
            <div className="grid gap-2">
              <div className="text-xs uppercase tracking-[0.24em] text-blue-500">FinanceOS</div>
              <h1 className="text-3xl font-semibold text-slate-950">We hit an unexpected UI snag.</h1>
              <p className="text-sm text-slate-600">
                Your data should still be safe. Let&apos;s get you back to a stable screen and keep moving.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={this.handleReload}>
                Reload app
              </Button>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 no-underline transition-colors hover:bg-slate-50"
              >
                Go to dashboard
              </Link>
              <Link
                to="/reports"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 no-underline transition-colors hover:bg-slate-50"
              >
                Open reports
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
