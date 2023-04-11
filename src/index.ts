import express from 'express'
import bodyParser from 'body-parser'

import initMongoDB from './init/db'
import { getCollections } from './utils/getCollections'

const main = async () => {
  const db = await initMongoDB()
  const collections = getCollections(db)

  const app = express()
  const port = 3000

  // Parse JSON bodies for this app
  app.use(bodyParser.json())

  // Simple "Hello World" endpoint
  app.get('/blocks', async (req, res) => {
    const blocks = await collections.block.find({}).sort({ number: -1 }).limit(2).toArray()
    res.send(blocks)
  })

  app.get('/transactions', async (req, res) => {
    const transactions = await collections.transaction
      .find({})
      .sort({ blockNumber: -1 })
      .limit(2)
      .toArray()
    res.send(transactions)
  })

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
main()
