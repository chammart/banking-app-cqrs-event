// src/cqrs-es/infrastructure/rabbitmq.event.bus.ts
import * as amqp from 'amqplib';
import { BasicEvent } from '../domain/app.event';
import { EventBus } from '../domain/app.event.bus';
import logger from '../utils/logger';

interface RabbitMQEventBusOptions {
  prefetchCount?: number;
  queueOptions?: amqp.Options.AssertQueue;
  reconnectInterval?: number; // in milliseconds (default: 5000)
  maxPublishRetries?: number; // (default: 3)
  publishRetryDelay?: number; // in milliseconds (default: 1000)
}

export class RabbitMQEventBus implements EventBus {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly exchange: string;
  private queueName: string;
  // Map event types to their registered callbacks.
  private callbacks: Map<string, ((event: BasicEvent<any>) => void)[]> = new Map();
  private url: string;
  private options: RabbitMQEventBusOptions;

  private constructor(
    connection: amqp.Connection,
    channel: amqp.Channel,
    queueName: string,
    exchange: string,
    url: string,
    options: RabbitMQEventBusOptions,
  ) {
    this.connection = connection;
    this.channel = channel;
    this.queueName = queueName;
    this.exchange = exchange;
    this.url = url;
    this.options = options;

    if (options.prefetchCount) {
      this.channel.prefetch(options.prefetchCount);
    }

    this.attachConnectionListeners();
  }

  /**
   * Attaches event listeners to the connection for handling close and error events.
   */
  private attachConnectionListeners(): void {
    this.connection.on('close', () => {
      logger.warn('RabbitMQ connection closed. Attempting to reconnect...');
      this.reconnect();
    });
    this.connection.on('error', (err) => {
      logger.error(`RabbitMQ connection error: ${err}`);
    });
  }

  /**
   * Creates and initializes a new instance of RabbitMQEventBus.
   *
   * @param url - The RabbitMQ connection URL.
   * @param exchange - The name of the RabbitMQ exchange to use.
   * @param options - Optional configuration options.
   */
  public static async create(
    url: string,
    exchange: string,
    options: RabbitMQEventBusOptions = {},
  ): Promise<RabbitMQEventBus> {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', { durable: true });
    const { queue } = await channel.assertQueue('', options.queueOptions || { exclusive: true });

    const eventBus = new RabbitMQEventBus(connection, channel, queue, exchange, url, options);
    await channel.consume(queue, (msg) => eventBus.handleMessage(msg), { noAck: false });

    return eventBus;
  }

  /**
   * Reconnects to RabbitMQ in case of connection loss.
   */
  private async reconnect(): Promise<void> {
    const reconnectInterval = this.options.reconnectInterval || 5000;
    try {
      await this.sleep(reconnectInterval);
      logger.info('Reconnecting to RabbitMQ...');
      const connection = await amqp.connect(this.url);
      const channel = await connection.createChannel();
      await channel.assertExchange(this.exchange, 'topic', { durable: true });
      const { queue } = await channel.assertQueue('', { exclusive: true });

      // Update instance variables.
      this.connection = connection;
      this.channel = channel;
      this.queueName = queue;
      if (this.options.prefetchCount) {
        this.channel.prefetch(this.options.prefetchCount);
      }

      // Rebind all subscriptions.
      for (const eventType of this.callbacks.keys()) {
        await this.channel.bindQueue(this.queueName, this.exchange, eventType);
        logger.info(`Rebound queue ${this.queueName} to event type ${eventType}`);
      }

      // Restart consuming messages.
      await this.channel.consume(this.queueName, (msg) => this.handleMessage(msg), {
        noAck: false,
      });

      // Reattach connection event listeners.
      this.attachConnectionListeners();
      logger.info('Reconnected to RabbitMQ successfully.');
    } catch (error) {
      logger.error(`Failed to reconnect to RabbitMQ: ${error}`);
      // Optionally implement further reconnection logic or propagate the error.
    }
  }

  /**
   * Helper method to create a delay.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Publishes an event to the RabbitMQ exchange with retry logic.
   *
   * @param event - The event to be published.
   */
  async publish<T>(event: BasicEvent<T>): Promise<void> {
    const routingKey = event.type;
    const content = Buffer.from(JSON.stringify(event));
    const maxRetries = this.options.maxPublishRetries || 3;
    const retryDelay = this.options.publishRetryDelay || 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const published = this.channel.publish(this.exchange, routingKey, content, {
          persistent: true,
        });
        if (!published) {
          throw new Error('Message not published');
        }
        logger.info(`Published event: ${event.type}`);
        return;
      } catch (error) {
        logger.warn(`Publish attempt ${attempt + 1} for event ${event.type} failed: ${error}`);
        if (attempt + 1 >= maxRetries) {
          logger.error(`Max publish retries reached for event ${event.type}`);
          throw error;
        }
        await this.sleep(retryDelay);
      }
    }
  }

  /**
   * Subscribes to a specific event type by binding the dedicated queue
   * to the exchange using the event type as the routing key.
   *
   * @param eventType - The type or pattern of event to subscribe to.
   * @param callback - Callback to invoke when the event is received.
   */
  async subscribe<T>(eventType: string, callback: (event: BasicEvent<T>) => void): Promise<void> {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, []);
      await this.channel.bindQueue(this.queueName, this.exchange, eventType);
      logger.info(`Bound queue ${this.queueName} to event type ${eventType}`);
    }
    this.callbacks.get(eventType)?.push(callback as (event: BasicEvent<any>) => void);
  }

  /**
   * Unsubscribes a callback for a specific event type. If no callbacks remain,
   * the queue is unbound from the exchange.
   *
   * @param eventType - The type of event.
   * @param callback - The callback to remove.
   */
  async unsubscribe<T>(eventType: string, callback: (event: BasicEvent<T>) => void): Promise<void> {
    if (this.callbacks.has(eventType)) {
      const callbacks = this.callbacks.get(eventType)!;
      const index = callbacks.findIndex((cb) => cb === callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        await this.channel.unbindQueue(this.queueName, this.exchange, eventType);
        this.callbacks.delete(eventType);
        logger.info(`Unbound queue ${this.queueName} from event type ${eventType}`);
      }
    }
  }

  /**
   * Handles incoming messages from RabbitMQ.
   *
   * @param msg - The message received from the channel.
   */
  private async handleMessage(msg: amqp.ConsumeMessage | null): Promise<void> {
    if (msg) {
      try {
        const content = msg.content.toString();
        const event: BasicEvent<any> = JSON.parse(content);
        logger.debug(`Received event: ${event.type}`);

        // Dispatch event to registered callbacks.
        const callbacks = this.callbacks.get(event.type);
        if (callbacks) {
          for (const callback of callbacks) {
            try {
              callback(event);
            } catch (cbError) {
              logger.error(`Error in callback for event ${event.type}: ${cbError}`);
            }
          }
        }
        this.channel.ack(msg);
      } catch (error) {
        logger.error(`Error processing message: ${error}`);
        this.channel.nack(msg);
      }
    }
  }

  /**
   * Closes the RabbitMQ channel and connection gracefully.
   */
  async close(): Promise<void> {
    try {
      await this.channel.close();
      await this.connection.close();
      logger.info('RabbitMQ connection closed gracefully.');
    } catch (error) {
      logger.error(`Error closing RabbitMQ connection: ${error}`);
      throw error;
    }
  }
}
