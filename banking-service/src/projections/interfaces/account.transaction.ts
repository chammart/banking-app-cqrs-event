import { Transaction } from '@domain/app.models';

export interface AccountTransactions {
  accountId: string;
  transactions: Transaction[];
}
