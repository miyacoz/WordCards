import { DotenvParseOutput } from 'dotenv'
import {
  MongoClient,
  Db as MongoDb,
  ObjectID,
} from 'mongodb'

import Config from './Config'
import Word from './Word'

class DBError extends Error {
  public constructor(message: string) {
    super(`[DBError] ${message}`)
    Error.captureStackTrace(this, DBError)
  }
}

class RecordNotFoundError extends Error {
  public constructor(message: string) {
    super(`[RecordNotFoundError] ${message}`)
    Error.captureStackTrace(this, RecordNotFoundError)
  }
}

class DB {
  private db: MongoDb | null = null

  private config: DotenvParseOutput

  private DB_URL: string

  private DB_NAME: string = 'wordcards'

  private COLLECTION_NAME: string = 'words'

  public constructor(config: Readonly<DotenvParseOutput>) {
    this.config = config
    this.DB_URL = `mongodb://${config.MONGO_HOST || ''}:${config.MONGO_PORT || 0}/`
    this.connect()
  }

  private connect = async (): Promise<void> => {
    try {
      const client: MongoClient = await MongoClient.connect(this.DB_URL, {
        useUnifiedTopology: true,
        auth: {
          user: this.config.MONGO_USER || '',
          password: this.config.MONGO_PASS || '',
        }
      })

      this.db = client.db(this.DB_NAME)

      const collections: { name: string; type: string }[] = await this.db.listCollections({}, {
        nameOnly: true,
      }).toArray()
      const collectionNames: string[] = collections.map(v => v.name)

      if (!collectionNames.includes(this.COLLECTION_NAME)) {
        this.db.createCollection(this.COLLECTION_NAME)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  private query = () => {
    const collection = this.db?.collection(this.COLLECTION_NAME)
    if (!collection) {
      throw new DBError(`collection "${this.COLLECTION_NAME}" was not found`)
    }
    return collection
  }

  public create = async (data: object): Promise<Word | {}> => {
    // TODO duplication check
    // TODO should wrap it with try-catch?
    const r = await this.query()?.insertOne(data)
    if (!r?.result.ok) {
      throw new DBError('"create" failed')
    }
    return r?.ops[0] || {}
  }

  public readAll = async (): Promise<Word[]> => {
    try {
      const r = await this.query()?.find().toArray()
      return r || []
    } catch (e) {
      throw new DBError(`"readAll" failed: ${e.message}`)
    }
  }

  public read = async (_id: string): Promise<Word> => {
    // TODO should wrap it with try-catch?
    const r = await this.query()?.findOne({ _id: new ObjectID(_id) })
    if (!r) {
      throw new RecordNotFoundError(`record where _id: ${_id} was not found`)
    }
    return r
  }

  public update = async (_id: string, data: object): Promise<Word> => {
    // TODO should wrap it with try-catch?
    const r = await this.query()?.findOneAndUpdate({ _id: new ObjectID(_id) }, data, { returnOriginal: false })
    if (!r.ok) {
      throw new DBError(`"update" for _id: ${_id} failed`)
    }
    return r.value
  }

  public delete = async (_id: string): Promise<void> => {
    // TODO should wrap it with try-catch?
    const r = await this.query()?.findOneAndDelete({ _id: new ObjectID(_id) })
    if (!r.ok) {
      throw new DBError(`"delete" for _id: ${_id} failed`)
    }
  }
}

const db = new DB(Config)

export default db
