import * as Https from 'https'
import { config as DotenvConfig, DotenvConfigOutput, DotenvParseOutput } from 'dotenv'
import * as Fs from 'fs'
import * as Http from 'http'
// import * as HttpProxy from 'http-proxy'
import { MongoClient, Db as MongoDb } from 'mongodb'

const dotenvResult: DotenvConfigOutput = DotenvConfig()
if (dotenvResult.error) {
  throw dotenvResult.error
}

const config: DotenvParseOutput | undefined = dotenvResult.parsed

if (!config) {
  throw new Error('no config found')
}

const serverOptions: Https.ServerOptions = {
  key: Fs.readFileSync(config?.SSL_KEY || ''),
  cert: Fs.readFileSync(config?.SSL_CERT || '')
}

const SERVER_PORT: number = Number(config?.SERVER_PORT) || 0

class DB {
  private db: MongoDb | null = null

  private config: DotenvParseOutput

  private DB_URL: string

  private DB_NAME: string = 'wordcards'

  public constructor(config: DotenvParseOutput) {
    this.config = config
    this.DB_URL = `mongodb://${config.MONGO_HOST || ''}:${config.MONGO_PORT || 0}/`
    this.connect()
  }

  public connect = async (): Promise<void> => {
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
if (config) {
  new DB(config)
}

const routes: Http.RequestListener = (q, r): void => {
  q.on('readable', () => {
    let chunk: string | Buffer | null = null
    do {
      console.log(chunk, `size: ${chunk?.length || 0}`)
    } while (null !== (chunk = q.read()))
  })

  const headers: Http.OutgoingHttpHeaders = {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  }
  r.writeHead(200, headers)

  const now = new Date()
  const data = {
    data: {
      it: 'good'
    },
    now
  }
  r.write(Number(now) % 2 ? JSON.stringify(data) : '')
  r.end()
}

Https.createServer(serverOptions, routes).listen(SERVER_PORT)
console.info('i\'m running now')
