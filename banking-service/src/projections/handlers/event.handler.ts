// src/projections/handlers/event.handler.ts
import { BasicEvent } from '@cqrs-es/domain/app.event';
import { AccountTransactions } from '../interfaces/account.transaction';

/**
 * A generic interface for handling a specific type of event.
 */
export interface IEventHandler<E extends BasicEvent<any>> {
  /**
   * The type of event that this handler processes.
   */
  eventType: string;
  /**
   * Updates the projection based on the provided event.
   * @param event - The event to handle.
   * @param accounts - The in-memory accounts map to update.
   */
  handle(event: E, accounts: Map<string, AccountTransactions>): void;
}
