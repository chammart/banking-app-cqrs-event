// src/projections/handlers/account.opened.handler.ts
import { IEventHandler } from './event.handler';
import { BasicEvent } from '@cqrs-es/domain/app.event';
import { AccountTransactions } from '../interfaces/account.transaction';
import { Transaction } from '@domain/app.models';

interface FundsTransferredPayload {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

export class FundsTransferredHandler implements IEventHandler<BasicEvent<FundsTransferredPayload>> {
  public eventType = 'FundsTransferred';

  handle(
    event: BasicEvent<FundsTransferredPayload>,
    accounts: Map<string, AccountTransactions>,
  ): void {
    const sourceAccount = accounts.get(event.payload.fromAccountId);
    if (sourceAccount) {
      sourceAccount.transactions.push(
        new Transaction('TransferOut', event.payload.amount, new Date(event.timestamp)),
      );
    }
    const targetAccount = accounts.get(event.payload.toAccountId);
    if (targetAccount) {
      targetAccount.transactions.push(
        new Transaction('TransferIn', event.payload.amount, new Date(event.timestamp)),
      );
    }
  }
}
