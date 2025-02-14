// src/domain/app.queries.ts
import { BasicQuery } from '@cqrs-es/domain/app.query';

export class GetAllTransactionsQuery extends BasicQuery<{ accountId: string }> {
  constructor(accountId: string) {
    super({
      type: 'GetAllTransactionsQuery',
      source: 'bank-account-service',
      payload: { accountId },
    });
  }
}
