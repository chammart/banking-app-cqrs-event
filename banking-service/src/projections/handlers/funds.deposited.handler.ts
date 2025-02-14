// src/projections/handlers/account.opened.handler.ts
import { IEventHandler } from './event.handler';
import { BasicEvent } from '@cqrs-es/domain/app.event';
import { AccountTransactions } from '../interfaces/account.transaction';
import { Transaction } from '@domain/app.models';

interface FundsDepositedPayload {
  accountId: string;
  amount: number;
}

export class FundsDepositedHandler implements IEventHandler<BasicEvent<FundsDepositedPayload>> {
  public eventType = 'FundsDeposited';

  handle(
    event: BasicEvent<FundsDepositedPayload>,
    accounts: Map<string, AccountTransactions>,
  ): void {
    const account = accounts.get(event.payload.accountId);
    if (account) {
      account.transactions.push(
        new Transaction('FundsDeposited', event.payload.amount, new Date(event.timestamp)),
      );
    }
  }
}
