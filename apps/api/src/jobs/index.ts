import { env } from '../lib/env.js';

import { startOverdueJob } from './overdue.job.js';
import { startReminderJob } from './reminder.job.js';

export const startJobs = () => {
  if (!env.jobsEnabled) {
    console.log('FinanceOS scheduled jobs are disabled for this environment.');
    return;
  }

  startReminderJob();
  startOverdueJob();
  console.log('FinanceOS scheduled jobs started.');
};
