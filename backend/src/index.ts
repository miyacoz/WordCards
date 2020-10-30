import * as Https from 'https'
import * as Dotenv from 'dotenv'
import * as Fs from 'fs'
import * as Http from 'http'
// import * as HttpProxy from 'http-proxy'
import { MongoClient, Db as MongoDb } from 'mongodb'

const dotenvResult: Dotenv.DotenvConfigOutput = Dotenv.config()
if (dotenvResult.error) {
  throw dotenvResult.error
}

const config = dotenvResult.parsed
const serverOptions: Https.ServerOptions = {
  key: Fs.readFileSync(config?.SSL_KEY || ''),
  cert: Fs.readFileSync(config?.SSL_CERT || '')
}

const SERVER_PORT: number = Number(config?.SERVER_PORT) || 0

const DB_URL: string = `mongodb://${config?.MONGO_HOST || ''}:${config?.MONGO_PORT || 0}/`
const DB_NAME: string = 'wordcards'

let db: MongoDb;

const connectDb = async (): Promise<void> => {
  try {
    const client: MongoClient = await MongoClient.connect(DB_URL, {
      useUnifiedTopology: true,
      auth: {
        user: config?.MONGO_USER || '',
        password: config?.MONGO_PASS || '',
      }
    })
      
    console.info('mongo ok')

    db = client.db(DB_NAME)

    const collections: { name: string; type: string }[] = await db.listCollections({}, {
      nameOnly: true,
    }).toArray()
    const collectionNames: string[] = collections.map(v => v.name)

    if (!collectionNames.includes('words')) {
      db.createCollection('words').then(() => {
        console.info('collection created')
      })
    }
  } catch (e) {
    console.warn(e)
  }
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

connectDb()
Https.createServer(serverOptions, routes).listen(SERVER_PORT)
console.info('i\'m running now')
