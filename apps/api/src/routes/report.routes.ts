import { Router } from 'express';

import * as reportController from '../controllers/report.controller';

const router = Router();

router.get('/pnl', reportController.getProfitAndLoss);
router.get('/cashflow', reportController.getCashFlow);
router.get('/ar-aging', reportController.getAccountsReceivableAging);
router.get('/monthly/:year/:month', reportController.getMonthlySummary);

export default router;
