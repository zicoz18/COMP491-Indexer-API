import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as ethers from 'ethers'

import initMongoDB from './init/db'
import { getCollections } from './utils/getCollections'

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    'http://194.233.165.161:9650/ext/bc/zate/rpc'
  )
  const db = await initMongoDB()
  const collections = getCollections(db)

  const app = express()
  const port = 3000

  // Parse JSON bodies for this app
  app.use(bodyParser.json())
  app.use(cors())

  app.get('/blocks', async (req, res) => {
    // If block number is given, return the specific block
    if (req.query.number) {
      const block = await collections.block.findOne({
        number: parseInt(<string>req.query.number),
      })
      res.send(block)
      return
    } else if (req.query.latestCount) {
      // If latestCount is indicated return latest `latestCount` amount of blocks
      const blocks = await collections.block
        .find({})
        .sort({ number: -1 })
        .limit(parseInt(<string>req.query.latestCount))
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
      const transaction = await collections.transaction.findOne({ hash: req.query.hash })
      res.send(transaction)
      return
    } else if (req.query.latestCount) {
      // If latestCount is indicated return latest `latestCount` amount of transactions
      const transactions = await collections.transaction
        .find({})
        .sort({ blockNumber: -1 })
        .limit(parseInt(<string>req.query.latestCount))
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

  app.get('/search', async (req, res) => {
    // If an address is provided return the transaction that have the address inside `from` or `to` parameter
    if (req.query.address) {
      const transactions = await collections.transaction
        .find({
          $or: [{ from: req.query.address }, { to: req.query.address }],
        })
        .toArray()
      res.send(transactions)
      return
    } else if (req.query.transactionHash) {
      // If transaction hash is given, return the specific transaction
      const transaction = await collections.transaction.findOne({ hash: req.query.transactionHash })
      res.send(transaction)
      return
    } else if (req.query.blockNumber) {
      // If a blockNumber is provided retun the specific bloc
      const block = await collections.block.findOne({
        number: parseInt(<string>req.query.blockNumber),
      })
      res.send(block)
      return
    }
  })

  app.get('/balance', async (req, res) => {
    // If an address is provided return the balance of that address
    if (req.query.address) {
      const balance = await provider.getBalance(req.query.address as string)
      const balanceInEther = ethers.utils.formatEther(balance.toString())
      res.send({ balance: balanceInEther })
      return
    } else {
      return
    }
  })

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
main()
