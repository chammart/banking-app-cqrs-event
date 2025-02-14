// src/commands/open.account.handler.ts
import { ICommandHandler } from '@cqrs-es/handlers/command.handler';
import { OpenAccountCommand } from '@domain/app.commands';
import { BankAccount } from '@domain/app.models';
import { IRepository } from '@cqrs-es/domain/app.repository';
import { EventBus } from '@cqrs-es/domain/app.event.bus';

export class OpenAccountHandler implements ICommandHandler<OpenAccountCommand> {
  constructor(
    private repository: IRepository<BankAccount, string>,
    private eventBus: EventBus,
  ) {}

  async handle(command: OpenAccountCommand): Promise<void> {
    const { accountId, initialDeposit } = command.payload;
    const existingAccount = await this.repository.findById(accountId);
    if (existingAccount) {
      throw new Error('Account already exists');
    }
    const account = new BankAccount(accountId);
    const events = account.openAccount(initialDeposit);
    await this.repository.create(account);
    events.forEach((event) => this.eventBus.publish(event));
  }
}
