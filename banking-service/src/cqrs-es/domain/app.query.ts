// src/cqrs-es/domain/app.query.ts
import { createId } from "@paralleldrive/cuid2";

/**
 * Base query interface for all queries.
 */
export interface AppQuery<T> {
  readonly id: string;            // Unique identifier for the query.
  readonly type: string;          // Query type (e.g., "GetAccountTransactionsQuery").
  readonly source: string;        // Origin of the query (e.g., "bank-account-service").
  readonly timestamp: number;     // Time the query was created (ms since epoch).
  readonly payload: T;            // Data associated with the query.
  readonly correlationId?: string;
  readonly causationId?: string;
}

/**
 * Parameters for constructing a BasicQuery.
 */
export interface BasicQueryParams<T> {
  id?: string;
  type: string;
  source: string;
  payload: T;
  timestamp?: number;
  correlationId?: string;
  causationId?: string;
}

/**
 * BasicQuery implements the common structure for all queries.
 */
export class BasicQuery<T> implements AppQuery<T> {
  public readonly id: string;
  public readonly type: string;
  public readonly source: string;
  public readonly timestamp: number;
  public readonly payload: T;
  public readonly correlationId?: string;
  public readonly causationId?: string;

  constructor(params: BasicQueryParams<T>) {
    this.id = params.id ?? `QRY-${createId()}`;
    this.type = params.type;
    this.source = params.source;
    this.payload = params.payload;
    this.timestamp = params.timestamp ?? Date.now();
    this.correlationId = params.correlationId;
    this.causationId = params.causationId;
  }
}
