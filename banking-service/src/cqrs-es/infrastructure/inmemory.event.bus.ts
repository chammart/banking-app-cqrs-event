// src/cqrs-es/bus/event-bus.ts
import { BasicEvent } from '../domain/app.event';
import { EventBus } from "../domain/app.event.bus";

export class InMemoryEventBus implements EventBus {
  // A map where the key is the event type and the value is an array of callbacks.
  private subscribers: Map<string, Array<(event: BasicEvent<any>) => void>> = new Map();

  /**
   * Publishes an event by invoking all subscriber callbacks for the event type.
   * @param event The event to be published.
   */
  async publish<T>(event: BasicEvent<T>): Promise<void> {
    const subs = this.subscribers.get(event.type);
    if (subs) {
      subs.forEach(callback => callback(event));
    }
  }

  /**
   * Subscribes a callback function to a specific event type.
   * @param eventType The type of event to subscribe to.
   * @param callback The function to call when the event is published.
   */
  async subscribe<T>(eventType: string, callback: (event: BasicEvent<T>) => void): Promise<void> {
    const currentSubscribers = this.subscribers.get(eventType) || [];
    currentSubscribers.push(callback as (event: BasicEvent<any>) => void);
    this.subscribers.set(eventType, currentSubscribers);
  }

  /**
   * Unsubscribes a callback function from a specific event type.
   * @param eventType The type of event to unsubscribe from.
   * @param callback The function to remove.
   */
  async unsubscribe<T>(eventType: string, callback: (event: BasicEvent<T>) => void): Promise<void> {
    const currentSubscribers = this.subscribers.get(eventType) || [];
    const updatedSubscribers = currentSubscribers.filter(sub => sub !== callback);
    this.subscribers.set(eventType, updatedSubscribers);
  }

  /**
   * Closes the event bus by clearing all subscribers.
   */
  async close(): Promise<void> {
    this.subscribers.clear();
  }
}
