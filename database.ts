import { MongoClient } from 'https://deno.land/x/mongo@v0.8.0/mod.ts'
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const client = new MongoClient()
client.connectWithUri(config().mongoURI)

const db = client.database('shortener')
const urlCollection = db.collection('url')

export default urlCollection
