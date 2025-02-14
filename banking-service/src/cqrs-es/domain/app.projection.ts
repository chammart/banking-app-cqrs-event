import { BasicEvent } from './app.event';

/**
 * A generic projection interface.
 */
export interface IProjection {
  /**
   * Handles a domain event to update the projection.
   * @param event - The domain event to handle.
   */
  handleEvent(event: BasicEvent<any>): void;
}
