// src/queries/get.allTransactions.handler.ts
import { GetAllTransactionsQuery } from '@domain/app.queries';
import { BankAccountProjection } from '@projections/account.projection';
import { IQueryHandler } from '@cqrs-es/handlers/query.handler';
import { Transaction } from '@domain/app.models';

export class GetAllTransactionsQueryHandler implements IQueryHandler<GetAllTransactionsQuery, Transaction[]> {
  constructor(private projection: BankAccountProjection) {}

  async handle(query: GetAllTransactionsQuery): Promise<Transaction[]> {
    return this.projection.getTransactions(query.payload.accountId);
  }
}
