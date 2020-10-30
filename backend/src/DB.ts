import { DotenvParseOutput } from 'dotenv'
import { MongoClient, Db as MongoDb } from 'mongodb'

export default class DB {
  private db: MongoDb | null = null

  private config: DotenvParseOutput

  private DB_URL: string

  private DB_NAME: string = 'wordcards'

  public constructor(config: DotenvParseOutput) {
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

      console.info('mongo ok')

      this.db = client.db(this.DB_NAME)

      const collections: { name: string; type: string }[] = await this.db.listCollections({}, {
        nameOnly: true,
      }).toArray()
      const collectionNames: string[] = collections.map(v => v.name)

      if (!collectionNames.includes('words')) {
        this.db.createCollection('words').then(() => {
          console.info('collection created')
        })
      }
    } catch (e) {
      console.warn(e)
    }
  }
}
