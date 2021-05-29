import { db } from '../db';
import { UUID } from '../global/scalars/UUID';
import { v4 as uuid } from 'uuid';

export abstract class Service<E> {
  protected collection: string = '';

  public async findOneById(id: UUID): Promise<E> {
    const data = await db.fetch(this.collection, { _id: id });

    return data?.[0] || null as E;
  }

  public async find(filter: any, limit?: number, offset?: number): Promise<E[]> {
    return db.fetch(this.collection, filter, limit, offset);
  }

  public async update(id: UUID, ops: any, filter?: any): Promise<E> {
    return db.doOps(this.collection, id, ops, filter);
  }

  public async insert(doc: any): Promise<E> {
    doc._id = uuid();

    return db.insert(this.collection, doc);
  }

  public async delete(id: UUID): Promise<UUID> {
    return db.delete(this.collection, id);
  }
}