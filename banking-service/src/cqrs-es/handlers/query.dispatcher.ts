// src/cqrs-es/query.dispatcher.ts
import { AppQuery } from '../domain/app.query';
import { IQueryHandler } from './query.handler';

export class QueryDispatcher {
  private useCases = new Map<string, IQueryHandler<AppQuery<any>, any>>();

  register<T extends AppQuery<any>, R>(queryType: string, useCase: IQueryHandler<T, R>): void {
    this.useCases.set(queryType, useCase as IQueryHandler<AppQuery<any>, any>);
  }

  async dispatch(query: AppQuery<any>): Promise<any> {
    const useCase = this.useCases.get(query.type);
    if (!useCase) {
      throw new Error(`No use case registered for query type: ${query.type}`);
    }
    return await useCase.handle(query);
  }
}
