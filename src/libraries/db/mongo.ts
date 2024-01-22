import {
    Collection,
    Db,
    MongoClient,
    ObjectId,
    OptionalUnlessRequiredId,
    WithoutId,
} from "mongodb"
import { DatabaseService } from "../../apps/db"

export class MongoDatabaseService<V> implements DatabaseService<string, V> {
    private readonly client: MongoClient

    constructor(
        uri: string,
        private readonly databaseName: string,
        private readonly collectionName: string,
    ) {
        this.client = new MongoClient(uri, {})
    }

    private async connectToDatabase(): Promise<Db> {
        return this.client.db(this.databaseName)
    }

    async create(value: V): Promise<string> {
        const db = await this.connectToDatabase()
        const collection = db.collection(this.collectionName)

        const insertedItem = await collection.insertOne(
            value as OptionalUnlessRequiredId<V>,
        )

        return insertedItem.insertedId.toString()
    }

    async get(id: string): Promise<V | null> {
        const db = await this.connectToDatabase()
        const collection = db.collection(this.collectionName)

        try {
            return await this.getRecord(id, collection)
        } catch (err) {
            console.error(err)
            return null
        }
    }

    async update(id: string, value: V): Promise<void> {
        const db = await this.connectToDatabase()
        const collection = db.collection(this.collectionName)

        collection.replaceOne(
            { _id: new ObjectId(id) },
            value as WithoutId<V>,
        )
    }

    async delete(id: string): Promise<void> {
        const db = await this.connectToDatabase()
        const collection = db.collection(this.collectionName)

        collection.deleteOne(
            { _id: new ObjectId(id) },
        )
    }

    private async getRecord(
        id: string,
        collection: Collection,
    ): Promise<V | null> {
        const result = await collection.findOne(
            { _id: new ObjectId(id) },
            { projection: { _id: 0 } },
        )

        if (result === null) {
            return null
        }

        return result as V
    }
}
