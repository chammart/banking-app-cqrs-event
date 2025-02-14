// src/commands/close.account.handler.ts
import { ICommandHandler } from '@cqrs-es/handlers/command.handler';
import { CloseAccountCommand } from '@domain/app.commands';
import { BankAccount } from '@domain/app.models';
import { IRepository } from '@cqrs-es/domain/app.repository';
import { EventBus } from '@cqrs-es/domain/app.event.bus';

/**Retrieves the account by its identifier, closes it, updates the repository, and publishes the resulting events */
export class CloseAccountHandler implements ICommandHandler<CloseAccountCommand> {
  constructor(
    private repository: IRepository<BankAccount, string>,
    private eventBus: EventBus,
  ) {}

  async handle(command: CloseAccountCommand): Promise<void> {
    const { accountId } = command.payload;
    const account = await this.repository.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    const events = account.closeAccount();
    await this.repository.update(account);
    events.forEach((event) => this.eventBus.publish(event));
  }
}
