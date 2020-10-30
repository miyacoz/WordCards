import { DotenvParseOutput } from 'dotenv'
import {
  MongoClient,
  Db as MongoDb,
} from 'mongodb'

interface Word {
  _id: string
  lang: string
  lemma: string
  words: any[]
  tags: string
}

import Config from './Config'

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

  private query = () => this.db?.collection(this.COLLECTION_NAME)

  public create = async (data: object): Promise<Word | {}> => {
    const r = await this.query()?.insertOne(data)
    return r?.ops[0] || {}
  }

  public readAll = async (): Promise<Word[]> => {
    const r = await this.query()?.find().toArray()
    return r || []
  }
}

const db = new DB(Config)

export default db
