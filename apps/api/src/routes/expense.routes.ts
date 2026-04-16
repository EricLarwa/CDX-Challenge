import { Router } from 'express';

import { categorizeExpenseSchema, createExpenseSchema, expenseQuerySchema, updateExpenseSchema } from '@financeos/shared';

import * as expenseController from '../controllers/expense.controller';
import { validateBody, validateQuery } from '../middleware/validate.middleware';

const router = Router();

router.get('/', validateQuery(expenseQuerySchema), expenseController.listExpenses);
router.post('/', validateBody(createExpenseSchema), expenseController.createExpense);
router.get('/:id', expenseController.getExpense);
router.patch('/:id', validateBody(updateExpenseSchema), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.post('/categorize', validateBody(categorizeExpenseSchema), expenseController.categorizeExpense);

export default router;
