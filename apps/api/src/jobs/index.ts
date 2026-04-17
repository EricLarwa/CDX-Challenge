import { startOverdueJob } from './overdue.job';
import { startReminderJob } from './reminder.job';

export const startJobs = () => {
  startReminderJob();
  startOverdueJob();
};
