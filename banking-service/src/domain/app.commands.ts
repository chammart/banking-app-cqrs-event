// ===================
// Commands
// ===================

import { BasicCommand } from '@cqrs-es/domain/app.command';

// OpenAccountCommand with a payload containing accountId and initialDeposit.
export class OpenAccountCommand extends BasicCommand<{
  accountId: string;
  initialDeposit: number;
}> {
  constructor(accountId: string, initialDeposit: number) {
    super({
      type: 'OpenAccountCommand',
      source: 'bank-account-service',
      payload: { accountId, initialDeposit },
    });
  }
}

// CloseAccountCommand with a payload containing accountId.
export class CloseAccountCommand extends BasicCommand<{ accountId: string }> {
  constructor(accountId: string) {
    super({
      type: 'CloseAccountCommand',
      source: 'bank-account-service',
      payload: { accountId },
    });
  }
}

// WithdrawFundsCommand with a payload containing accountId and amount.
export class WithdrawFundsCommand extends BasicCommand<{ accountId: string; amount: number }> {
  constructor(accountId: string, amount: number) {
    super({
      type: 'WithdrawFundsCommand',
      source: 'bank-account-service',
      payload: { accountId, amount },
    });
  }
}

// TransferFundsCommand with a payload containing fromAccountId, toAccountId, and amount.
export class TransferFundsCommand extends BasicCommand<{
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}> {
  constructor(fromAccountId: string, toAccountId: string, amount: number) {
    super({
      type: 'TransferFundsCommand',
      source: 'bank-account-service',
      payload: { fromAccountId, toAccountId, amount },
    });
  }
}
