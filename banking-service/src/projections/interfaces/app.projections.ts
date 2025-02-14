import { Transaction } from '@domain/app.models';
import { IProjection } from '@cqrs-es/domain/app.projection';

export interface IBankAccountProjection extends IProjection {
  /**
   * Retrieves all transactions for a given account.
   * @param accountId - The unique identifier of the account.
   * @returns An array of transactions.
   */
  getTransactions(accountId: string): Transaction[];
}
