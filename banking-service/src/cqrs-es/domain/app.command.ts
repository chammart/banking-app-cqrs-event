// src/cqrs-es/domain/app.commands
import { createId } from "@paralleldrive/cuid2";


/**
 * Base command interface for all commands.
 */
export interface AppCommand<T> {
  readonly id: string;            // Unique identifier for the command.
  readonly type: string;          // Command type (e.g., "OpenAccountCommand").
  readonly source: string;        // Origin of the command (e.g., "bank-account-service").
  readonly timestamp: number;     // Time the command was created (ms since epoch).
  readonly payload: T;            // Data associated with the command.
  readonly correlationId?: string;
  readonly causationId?: string;
}

/**
 * Parameters for constructing a BasicCommand.
 */
export interface BasicCommandParams<T> {
  id?: string;
  type: string;
  source: string;
  payload: T;
  timestamp?: number;
  correlationId?: string;
  causationId?: string;
}

/**
 * BasicCommand implements the common structure for all commands.
 */
export class BasicCommand<T> implements AppCommand<T> {
  public readonly id: string;
  public readonly type: string;
  public readonly source: string;
  public readonly timestamp: number;
  public readonly payload: T;
  public readonly correlationId?: string;
  public readonly causationId?: string;

  constructor(params: BasicCommandParams<T>) {
    this.id = params.id ?? `CMD-${createId()}}`;
    this.type = params.type;
    this.source = params.source;
    this.payload = params.payload;
    this.timestamp = params.timestamp ?? Date.now();
    this.correlationId = params.correlationId;
    this.causationId = params.causationId;
  }
}
