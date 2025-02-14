// src/commands/transfer.funds.handler.ts
import { ICommandHandler } from '@cqrs-es/handlers/command.handler';
import { TransferFundsCommand } from '@domain/app.commands';
import { BankAccount } from '@domain/app.models';
import { IRepository } from '@cqrs-es/domain/app.repository';
import { EventBus } from '@cqrs-es/domain/app.event.bus';

/**Retrieves both accounts, processes the transfer, updates both entities in the repository, and publishes the events. */
export class TransferFundsHandler implements ICommandHandler<TransferFundsCommand> {
  constructor(
    private repository: IRepository<BankAccount, string>,
    private eventBus: EventBus,
  ) {}

  async handle(command: TransferFundsCommand): Promise<void> {
    const { fromAccountId, toAccountId, amount } = command.payload;
    const fromAccount = await this.repository.findById(fromAccountId);
    const toAccount = await this.repository.findById(toAccountId);
    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }
    const events = fromAccount.transferFunds(toAccount, amount);
    await this.repository.update(fromAccount);
    await this.repository.update(toAccount);
    events.forEach((event) => this.eventBus.publish(event));
  }
}
