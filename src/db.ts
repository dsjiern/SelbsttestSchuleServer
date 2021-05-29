import * as MongoClient from 'mongodb';
import { UUID } from './global/scalars/UUID';
import { DBDATA } from './config';

export class DB {
    private mongo: MongoClient;
    private db: MongoClient.Db;

    public getDB(): MongoClient.Db {
        return this.db
    }

    public async connect(): MongoClient.Db {
        this.mongo = await new Promise((resolve, reject) => {
            MongoClient.connect(`mongodb://${DBDATA.user}:${DBDATA.pwd}@${DBDATA.host}:${DBDATA.port}`, {
                authSource: DBDATA.source,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                poolSize: 20,
            }, (err, database) => {
                if (err) {
                    reject(err);
                }
                resolve(database);
            });
        });

        this.db = this.mongo.db(DBDATA.db);
    }

    public collection(coll): MongoClient.Collection {
        return this.db.collection(coll);
    }

    public async fetch(collection: string, filter: any = {}, limit?: number, offset?: number): Promise<any[]> {
        if (!limit || limit > 1000) limit = 1001;
        if (limit < 0) limit = -limit;

        if (offset) {
            return new Promise<any[]>((resolve, reject) => this.db.collection(collection).find(filter).skip(offset).limit(limit).toArray((e, d) => {
                if (e) {
                    return reject(e);
                }
                resolve(d);
            }))
        } else {
            return new Promise<any[]>((resolve, reject) => this.db.collection(collection).find(filter).limit(limit).toArray((e, d) => {
                if (e) {
                    return reject(e);
                }
                resolve(d);
            }))
        }
    }

    public async fetchAll(collection: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => this.db.collection(collection).find(true).toArray((e, d) => {
            if (e) {
                return reject(e);
            }
            resolve(d);
        }))
    }

    public async insert(collection: string, doc: any): Promise<any> {
        const d = await this.db.collection(collection).insertOne(doc)

        if (d.insertedCount !== 1) { return null; }

        return d?.ops?.[0];
    }

    public async update(collection: string, doc: any): Promise<any> {
        const old = await this.db.collection(collection).findOne({ _id: doc._id });
        if (!old) return null;

        const neu = { ...old, ...doc };
        const d = await this.db.collection(collection).replaceOne({_id: doc._id}, neu);

        if (d.modifiedCount !== 1) { return null; }

        return d?.ops?.[0];
    }

    public async delete(collection: string, id: UUID): Promise<UUID> {
        const old = await this.db.collection(collection).findOne({ _id: id });
        if (!old) { return null; }

        const del = await this.db.collection(collection).deleteOne({ _id: id });
        if (del.deletedCount !== 1) { return null; }

        return id;
    }

    public async doOps(collection: string, id: UUID, ops: any, filter: any): Promise<any> {
        const doc: any = await this.fetch(collection, { _id: id });
        if (!doc) return null;

        await db.collection(collection).updateOne({_id: id}, ops, filter);

        const neu = await this.fetch(collection, { _id: id });

        return neu[0];
    }

}

export const db = new DB();