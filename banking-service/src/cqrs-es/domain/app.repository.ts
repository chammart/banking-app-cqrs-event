// src/cqrs-es/domain/app.repository.ts

export interface IRepository<T, ID = string> {
  /**
   * Persists a new entity in the repository.
   * @param entity - The entity to create.
   * @returns A promise that resolves with the created entity.
   */
  create(entity: T): Promise<T>;

  /**
   * Retrieves an entity by its unique identifier.
   * @param id - The identifier of the entity.
   * @returns A promise that resolves with the entity, or null if not found.
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Retrieves all entities from the repository.
   * @returns A promise that resolves with an array of entities.
   */
  findAll(): Promise<T[]>;

  /**
   * Updates an existing entity.
   * @param entity - The entity with updated values.
   * @returns A promise that resolves with the updated entity.
   */
  update(entity: T): Promise<T>;

  /**
   * Deletes an entity by its identifier.
   * @param id - The identifier of the entity to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: ID): Promise<void>;
}
