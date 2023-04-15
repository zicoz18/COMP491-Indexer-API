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

  app.get('/blocks', async (req, res) => {
    // If block number is given, return the specific block
    if (req.query.number) {
      const block = await collections.block.findOne({
        number: parseInt(req.query.number as unknown as string),
      })
      res.send(block)
      return
    } else if (req.query.latestCount) {
      // If latestCount is indicated return latest `latestCount` amount of blocks
      const blocks = await collections.block
        .find({})
        .sort({ number: -1 })
        .limit(parseInt(req.query.latestCount as unknown as string))
        .toArray()
      res.send(blocks)
      return
    } else {
      // If latestCount is not indicated return latest `10` amount of transactions
      const blocks = await collections.block.find({}).sort({ number: -1 }).limit(10).toArray()
      res.send(blocks)
      return
    }
  })

  app.get('/transactions', async (req, res) => {
    // If transaction hash is given, return the specific transaction
    if (req.query.hash) {
      console.log(req.query.hash)
      const transaction = await collections.transaction.findOne({ hash: req.query.hash })
      console.log(transaction)
      res.send(transaction)
      return
    } else if (req.query.latestCount) {
      // If latestCount is indicated return latest `latestCount` amount of transactions
      const transactions = await collections.transaction
        .find({})
        .sort({ blockNumber: -1 })
        .limit(parseInt(req.query.latestCount as unknown as string))
        .toArray()
      res.send(transactions)
      return
    } else {
      // If latestCount is not indicated return latest `10` amount of transactions
      const transactions = await collections.transaction
        .find({})
        .sort({ blockNumber: -1 })
        .limit(10)
        .toArray()
      res.send(transactions)
      return
    }
  })

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
main()
