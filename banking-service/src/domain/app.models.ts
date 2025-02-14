import {
  AccountOpenedEvent,
  AccountClosedEvent,
  FundsWithdrawnEvent,
  FundsDepositedEvent,
  FundsTransferredEvent,
} from './app.events';

// A simple transaction record (used for read-model purposes)
export class Transaction {
  constructor(
    public type: string,
    public amount: number,
    public date: Date = new Date(),
  ) {}
}

// The BankAccount aggregate
export class BankAccount {
  public balance: number = 0;
  public isClosed: boolean = false;
  public transactions: Transaction[] = [];

  constructor(public accountId: string) {}

  openAccount(initialDeposit: number): AccountOpenedEvent[] {
    if (this.balance !== 0) {
      throw new Error('Account already opened');
    }
    this.balance = initialDeposit;
    this.transactions.push(new Transaction('AccountOpened', initialDeposit));
    return [new AccountOpenedEvent(this.accountId, initialDeposit, 1)];
  }

  closeAccount(): AccountClosedEvent[] {
    if (this.isClosed) {
      throw new Error('Account already closed');
    }
    this.isClosed = true;
    this.transactions.push(new Transaction('AccountClosed', 0));
    return [new AccountClosedEvent(this.accountId, 1)];
  }

  withdrawFunds(amount: number): FundsWithdrawnEvent[] {
    if (this.isClosed) {
      throw new Error('Cannot withdraw from a closed account');
    }
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    this.balance -= amount;
    this.transactions.push(new Transaction('FundsWithdrawn', amount));
    return [new FundsWithdrawnEvent(this.accountId, amount, 1)];
  }

  depositFunds(amount: number): FundsDepositedEvent[] {
    if (this.isClosed) {
      throw new Error('Cannot deposit to a closed account');
    }
    this.balance += amount;
    this.transactions.push(new Transaction('FundsDeposited', amount));
    return [new FundsDepositedEvent(this.accountId, amount, 1)];
  }

  transferFunds(target: BankAccount, amount: number): FundsTransferredEvent[] {
    if (this.isClosed || target.isClosed) {
      throw new Error('Cannot transfer funds to/from a closed account');
    }
    if (this.balance < amount) {
      throw new Error('Insufficient funds for transfer');
    }
    this.balance -= amount;
    this.transactions.push(new Transaction('TransferOut', amount));
    target.balance += amount;
    target.transactions.push(new Transaction('TransferIn', amount));
    return [new FundsTransferredEvent(this.accountId, target.accountId, amount, 1)];
  }
}
