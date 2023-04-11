import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
config()

const initMongoDB = async () => {
  const uri = process.env.MONGO_DB_URI ?? ''
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(`blockchain`)
  return db
}

export default initMongoDB
