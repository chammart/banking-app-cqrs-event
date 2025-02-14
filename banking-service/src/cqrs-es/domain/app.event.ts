// src/cqrs-es/domain/app.events
import { createId } from "@paralleldrive/cuid2";

// The base type for an event, which will be used to define individual event objects.
// src/cqrs-es/events/app-event.ts
/**
 * Example event structure:
 * {
 *   "version": "0",
 *   "id": "0be79de6-6927-ad2d-052b-f45d95ea644c",
 *   "detail-type": "OrderCreated",
 *   "source": "order-service",
 *   "account": "000000000000",
 *   "time": "2023-05-11T01:38:00Z",
 *   "region": "us-west-1",
 *   "resources": [],
 *   "detail": {
 *     "id": 101,
 *     "amount": 100
 *   }
 * }
 */

/**
 * Base event interface for all domain events.
 */
export interface AppEvent<T> {
  readonly id: string;           // Unique identifier for the event.
  readonly type: string;         // Event type (e.g., "OrderCreated").
  readonly source: string;       // Origin of the event (e.g., "order-service").
  readonly timestamp: number;    // Time the event occurred (ms since epoch).
  readonly payload: T;           // Data associated with the event.
  readonly version: number;      // Event version for versioning support.

  // Optional metadata for correlation and causation.
  readonly correlationId?: string;
  readonly causationId?: string;
}

/**
 * AggregateEvent extends AppEvent with properties that tie an event to a specific aggregate.
 */
export interface AggregateEvent<T> extends AppEvent<T> {
  readonly aggregateId: string;        // Unique identifier for the aggregate.
  readonly aggregateName: string;      // Name of the aggregate (e.g., "Order").
  readonly aggregateVersion: number;   // Version of the aggregate (for concurrency control).
}

/**
 * Parameters for constructing an BasicEvent.
 */
export interface BasicEventParams<T> {
  id: string;
  type: string;
  source: string;
  payload: T;
  aggregateId: string;
  aggregateName: string;
  aggregateVersion: number;
  timestamp?: number;
  version?: number;
  correlationId?: string;
  causationId?: string;
}

/**
 * Concrete implementation of AggregateEvent.
 */
export class BasicEvent<T> implements AggregateEvent<T> {
  public readonly id: string;
  public readonly type: string;
  public readonly source: string;
  public readonly timestamp: number;
  public readonly payload: T;
  public readonly version: number;
  public readonly correlationId?: string;
  public readonly causationId?: string;
  public readonly aggregateId: string;
  public readonly aggregateName: string;
  public readonly aggregateVersion: number;

  constructor(params: BasicEventParams<T>) {
    this.id = params.id ?? `EVT-${createId()}}`;
    this.type = params.type;
    this.source = params.source;
    this.payload = params.payload;
    this.aggregateId = params.aggregateId;
    this.aggregateName = params.aggregateName;
    this.aggregateVersion = params.aggregateVersion;
    this.timestamp = params.timestamp ?? Date.now();
    this.version = params.version ?? 0;
    this.correlationId = params.correlationId;
    this.causationId = params.causationId;
  }
}