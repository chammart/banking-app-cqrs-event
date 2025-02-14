// src/crs-es/domain/app.event-bus.ts
import { BasicEvent } from './app.event';

/**
 * Provides the capability to publish events to the bus.
 */
export interface EventPublisher {
  /**
   * Publishes an event.
   *
   * @param event - The event to be published.
   */
  publish<T>(event: BasicEvent<T>): Promise<void>;
}

/**
 * Allows consumers to subscribe and unsubscribe to specific event types.
 */
export interface EventSubscriber {
  /**
   * Subscribes to a specific event type.
   *
   * @param eventType - The type of event to subscribe to.
   * @param callback - Callback invoked when the event is received.
   */
  subscribe<T>(
    eventType: string,
    callback: (event: BasicEvent<T>) => void
  ): Promise<void>;

  /**
   * Unsubscribes a callback from a specific event type.
   *
   * @param eventType - The type of event to unsubscribe from.
   * @param callback - The callback function to remove.
   */
  unsubscribe<T>(
    eventType: string,
    callback: (event: BasicEvent<T>) => void
  ): Promise<void>;
}

/**
 * Combines publishing and subscribing capabilities.
 */
export interface EventBus extends EventPublisher, EventSubscriber {
  /**
   * (Optional) Closes the event bus connection and cleans up resources.
   */
  close?(): Promise<void>;
}
