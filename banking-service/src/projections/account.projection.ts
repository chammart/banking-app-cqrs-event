import { IBankAccountProjection } from './interfaces/app.projections';
import { BasicEvent } from '@cqrs-es/domain/app.event';
import { Transaction } from '@domain/app.models';
import { AccountTransactions } from './interfaces/account.transaction';
import { IEventHandler } from './handlers/event.handler';
import { AccountOpenedHandler } from './handlers/account.opened.handler';
import { AccountClosedHandler } from './handlers/account.closed.handler';
import { FundsWithdrawnHandler } from './handlers/funds.withdrawn.handler';
import { FundsDepositedHandler } from './handlers/funds.deposited.handler';
import { FundsTransferredHandler } from './handlers/funds.transferred.handler';

export class BankAccountProjection implements IBankAccountProjection {
  private accounts: Map<string, AccountTransactions> = new Map();

  private handlers: IEventHandler<BasicEvent<any>>[] = [
    new AccountOpenedHandler(),
    new AccountClosedHandler(),
    new FundsWithdrawnHandler(),
    new FundsDepositedHandler(),
    new FundsTransferredHandler(),
  ];

  handleEvent(event: BasicEvent<any>): void {
    // Find the handler for this event type and delegate
    const handler = this.handlers.find((h) => h.eventType === event.type);
    if (handler) {
      handler.handle(event, this.accounts);
    }
  }

  getTransactions(accountId: string): Transaction[] {
    const account = this.accounts.get(accountId);
    return account ? account.transactions : [];
  }
}
