// src/domain/app.events
// ===================
// Domain Events
// ===================

import { BasicEvent, BasicEventParams } from "@cqrs-es/domain/app.event";
import { createId } from "@paralleldrive/cuid2";

// Event emitted when an account is opened.
export class AccountOpenedEvent extends BasicEvent<{ initialDeposit: number }> {
  constructor(accountId: string, initialDeposit: number, aggregateVersion: number = 1) {
    const params: BasicEventParams<{ initialDeposit: number }> = {
      id: createId(),
      type: "AccountOpened",
      source: "bank-account-service",
      payload: { initialDeposit },
      aggregateId: accountId,
      aggregateName: "BankAccount",
      aggregateVersion,
    };
    super(params);
  }
}

// Event emitted when an account is closed.
export class AccountClosedEvent extends BasicEvent<{}> {
  constructor(accountId: string, aggregateVersion: number = 1) {
    const params: BasicEventParams<{}> = {
      id: createId(),
      type: "AccountClosed",
      source: "bank-account-service",
      payload: {},
      aggregateId: accountId,
      aggregateName: "BankAccount",
      aggregateVersion,
    };
    super(params);
  }
}

// Event emitted when funds are withdrawn.
export class FundsWithdrawnEvent extends BasicEvent<{ amount: number }> {
  constructor(accountId: string, amount: number, aggregateVersion: number = 1) {
    const params: BasicEventParams<{ amount: number }> = {
      id: createId(),
      type: "FundsWithdrawn",
      source: "bank-account-service",
      payload: { amount },
      aggregateId: accountId,
      aggregateName: "BankAccount",
      aggregateVersion,
    };
    super(params);
  }
}

// Event emitted when funds are deposited.
export class FundsDepositedEvent extends BasicEvent<{ amount: number }> {
  constructor(accountId: string, amount: number, aggregateVersion: number = 1) {
    const params: BasicEventParams<{ amount: number }> = {
      id: createId(),
      type: "FundsDeposited",
      source: "bank-account-service",
      payload: { amount },
      aggregateId: accountId,
      aggregateName: "BankAccount",
      aggregateVersion,
    };
    super(params);
  }
}

// Event emitted when funds are transferred.
export class FundsTransferredEvent extends BasicEvent<{ toAccountId: string; amount: number }> {
  constructor(fromAccountId: string, toAccountId: string, amount: number, aggregateVersion: number = 1) {
    const params: BasicEventParams<{ toAccountId: string; amount: number }> = {
      id: createId(),
      type: "FundsTransferred",
      source: "bank-account-service",
      payload: { toAccountId, amount },
      aggregateId: fromAccountId,
      aggregateName: "BankAccount",
      aggregateVersion,
    };
    super(params);
  }
}
