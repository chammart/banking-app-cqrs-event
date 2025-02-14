// src/commands/withdraw.funds.handler.ts
import { ICommandHandler } from '@cqrs-es/handlers/command.handler';
import { WithdrawFundsCommand } from '@domain/app.commands';
import { BankAccount } from '@domain/app.models';
import { IRepository } from '@cqrs-es/domain/app.repository';
import { EventBus } from '@cqrs-es/domain/app.event.bus';

/**Retrieves the account, processes the withdrawal, updates the repository, and publishes events. */
export class WithdrawFundsHandler implements ICommandHandler<WithdrawFundsCommand> {
  constructor(
    private repository: IRepository<BankAccount, string>,
    private eventBus: EventBus,
  ) {}

  async handle(command: WithdrawFundsCommand): Promise<void> {
    const { accountId, amount } = command.payload;
    const account = await this.repository.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    const events = account.withdrawFunds(amount);
    await this.repository.update(account);
    events.forEach((event) => this.eventBus.publish(event));
  }
}
