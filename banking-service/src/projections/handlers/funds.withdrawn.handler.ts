// src/projections/handlers/account.opened.handler.ts
import { IEventHandler } from './event.handler';
import { BasicEvent } from '@cqrs-es/domain/app.event';
import { AccountTransactions } from '../interfaces/account.transaction';
import { Transaction } from '@domain/app.models';

interface FundsWithdrawnPayload {
  accountId: string;
  amount: number;
}

export class FundsWithdrawnHandler implements IEventHandler<BasicEvent<FundsWithdrawnPayload>> {
  public eventType = 'FundsWithdrawn';

  handle(
    event: BasicEvent<FundsWithdrawnPayload>,
    accounts: Map<string, AccountTransactions>,
  ): void {
    const account = accounts.get(event.payload.accountId);
    if (account) {
      account.transactions.push(
        new Transaction('FundsWithdrawn', event.payload.amount, new Date(event.timestamp)),
      );
    }
  }
}
