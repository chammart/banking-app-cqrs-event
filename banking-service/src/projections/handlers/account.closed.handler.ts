// src/projections/handlers/account.opened.handler.ts
import { IEventHandler } from './event.handler';
import { BasicEvent } from '@cqrs-es/domain/app.event';
import { AccountTransactions } from '../interfaces/account.transaction';
import { Transaction } from '@domain/app.models';

interface AccountClosedPayload {
  accountId: string;
}

export class AccountClosedHandler implements IEventHandler<BasicEvent<AccountClosedPayload>> {
  public eventType = 'AccountClosed';

  handle(
    event: BasicEvent<AccountClosedPayload>,
    accounts: Map<string, AccountTransactions>,
  ): void {
    const account = accounts.get(event.payload.accountId);
    if (account) {
      account.transactions.push(new Transaction('AccountClosed', 0, new Date(event.timestamp)));
    }
  }
}
