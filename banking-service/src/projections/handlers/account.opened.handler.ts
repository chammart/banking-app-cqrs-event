// src/projections/handlers/account.opened.handler.ts
import { IEventHandler } from './event.handler';
import { BasicEvent } from '@cqrs-es/domain/app.event';
import { AccountTransactions } from '../interfaces/account.transaction';
import { Transaction } from '@domain/app.models';

interface AccountOpenedPayload {
  accountId: string;
  initialDeposit: number;
}

export class AccountOpenedHandler implements IEventHandler<BasicEvent<AccountOpenedPayload>> {
  public eventType = 'AccountOpened';

  handle(event: BasicEvent<AccountOpenedPayload>, accounts: Map<string, AccountTransactions>): void {
    accounts.set(event.payload.accountId, {
      accountId: event.payload.accountId,
      transactions: [
        new Transaction(
          'AccountOpened',
          event.payload.initialDeposit,
          new Date(event.timestamp)
        ),
      ],
    });
  }
}
