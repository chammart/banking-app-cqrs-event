// src/api/app.routes.ts
import express from 'express';
import { CommandDispatcher } from '@cqrs-es/handlers/command.dispatcher';
import {
  OpenAccountCommand,
  CloseAccountCommand,
  WithdrawFundsCommand,
  TransferFundsCommand,
} from '@domain/app.commands';
import { GetAllTransactionsQuery } from '@domain/app.queries';
import { QueryDispatcher } from '@cqrs-es/handlers/query.dispatcher';

const router = express.Router();

export default function createRoutes(
  commandDispatcher: CommandDispatcher,
  queryDispatcher: QueryDispatcher,
) {
  // Open an account
  router.post('/account/open', async (req, res) => {
    try {
      const { accountId, initialDeposit } = req.body;
      if (!accountId || initialDeposit === undefined) {
        return res.status(400).json({ error: 'accountId and initialDeposit are required' });
      }
      await commandDispatcher.dispatch(new OpenAccountCommand(accountId, initialDeposit));
      res.status(200).json({ message: 'Account opened successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Close an account
  router.post('/account/close', async (req, res) => {
    try {
      const { accountId } = req.body;
      if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
      }
      await commandDispatcher.dispatch(new CloseAccountCommand(accountId));
      res.status(200).json({ message: 'Account closed successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Withdraw funds
  router.post('/account/withdraw', async (req, res) => {
    try {
      const { accountId, amount } = req.body;
      if (!accountId || amount === undefined) {
        return res.status(400).json({ error: 'accountId and amount are required' });
      }
      await commandDispatcher.dispatch(new WithdrawFundsCommand(accountId, amount));
      res.status(200).json({ message: 'Withdrawal successful' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Transfer funds
  router.post('/account/transfer', async (req, res) => {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;
      if (!fromAccountId || !toAccountId || amount === undefined) {
        return res
          .status(400)
          .json({ error: 'fromAccountId, toAccountId and amount are required' });
      }
      await commandDispatcher.dispatch(
        new TransferFundsCommand(fromAccountId, toAccountId, amount),
      );
      res.status(200).json({ message: 'Transfer successful' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all transactions for an account
  router.get('/account/:accountId/transactions', async (req, res) => {
    try {
      const { accountId } = req.params;
      const transactions = await queryDispatcher.dispatch(new GetAllTransactionsQuery(accountId));
      res.status(200).json({ accountId, transactions });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
