// src/handlers/query.handler.ts
import { AppQuery } from '@cqrs-es/domain/app.query';

export interface IQueryHandler<T extends AppQuery<any>, R> {
  /**
   * Handles a query and returns a result.
   * @param query - The query to handle.
   * @returns A promise that resolves with the query result.
   */
  handle(query: T): Promise<R>;
}
