// src/infrastructure/account.repository.ts
import { IRepository } from '@cqrs-es/domain/app.repository';
import { BankAccount } from '@domain/app.models';

export class BankAccountRepository implements IRepository<BankAccount, string> {
  private store = new Map<string, BankAccount>();

  async create(entity: BankAccount): Promise<BankAccount> {
    this.store.set(entity.accountId, entity);
    return entity;
  }

  async findById(id: string): Promise<BankAccount | null> {
    return this.store.get(id) || null;
  }

  async findAll(): Promise<BankAccount[]> {
    return Array.from(this.store.values());
  }

  async update(entity: BankAccount): Promise<BankAccount> {
    this.store.set(entity.accountId, entity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
