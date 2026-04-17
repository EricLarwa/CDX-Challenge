import { env } from '../lib/env';

import { startOverdueJob } from './overdue.job';
import { startReminderJob } from './reminder.job';

export const startJobs = () => {
  if (!env.jobsEnabled) {
    console.log('FinanceOS scheduled jobs are disabled for this environment.');
    return;
  }

  startReminderJob();
  startOverdueJob();
  console.log('FinanceOS scheduled jobs started.');
};
