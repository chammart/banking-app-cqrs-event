// src/cqrs-es/repositories/mongodb.repository.ts

import { IRepository } from "../domain/app.repository";
import {
  Collection,
  ObjectId,
  OptionalUnlessRequiredId,
  Filter,
  WithId,
} from "mongodb";

/**
 * T is expected to be an object with an optional _id property.
 * When reading from MongoDB, documents will have an _id assigned.
 */
export class MongoRepository<T extends { _id?: ObjectId }, ID = string>
  implements IRepository<T, ID>
{
  constructor(private collection: Collection<T>) {}

  async create(entity: T): Promise<T> {
    // Cast entity to OptionalUnlessRequiredId<T> to satisfy insertOne's type requirement.
    const result = await this.collection.insertOne(
      entity as OptionalUnlessRequiredId<T>
    );
    // Return the entity with _id set to the generated id.
    return { ...entity, _id: result.insertedId };
  }

  async findById(id: ID): Promise<T | null> {
    // Convert the id to an ObjectId.
    const _id = new ObjectId(id as unknown as string);
    // Cast the filter to Filter<T>.
    const filter: Filter<T> = { _id } as Filter<T>;
    const result = await this.collection.findOne(filter);
    // Explicitly cast the result from WithId<T> to T.
    return result ? (result as unknown as T) : null;
  }

  async findAll(): Promise<T[]> {
    const docs = await this.collection.find({}).toArray();
    // Cast the array of WithId<T> documents to T[].
    return docs as unknown as T[];
  }

  async update(entity: T): Promise<T> {
    if (!entity._id) {
      throw new Error("Cannot update entity without _id");
    }
    // Cast the filter to Filter<T>
    await this.collection.replaceOne({ _id: entity._id } as Filter<T>, entity);
    return entity;
  }

  async delete(id: ID): Promise<void> {
    const _id = new ObjectId(id as unknown as string);
    await this.collection.deleteOne({ _id } as Filter<T>);
  }
}
