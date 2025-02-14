// src/cqrs-es/repositories/in-memory.repository.ts

import { IRepository } from "../domain/app.repository";

export class InMemoryRepository<
  T extends { id: string },
  ID extends string = string,
> implements IRepository<T, ID>
{
  private data = new Map<string, T>();

  async create(entity: T): Promise<T> {
    this.data.set(entity.id, entity);
    return entity;
  }

  async findById(id: ID): Promise<T | null> {
    return this.data.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.data.values());
  }

  async update(entity: T): Promise<T> {
    if (!this.data.has(entity.id)) {
      throw new Error(`Entity with id ${entity.id} not found`);
    }
    this.data.set(entity.id, entity);
    return entity;
  }

  async delete(id: ID): Promise<void> {
    this.data.delete(id);
  }
}
