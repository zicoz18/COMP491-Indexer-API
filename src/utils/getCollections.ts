import { Db } from 'mongodb'

export const getCollections = (db: Db) => {
  const blockCollection = db.collection('block')
  const transactionCollection = db.collection('transaction')
  return { block: blockCollection, transaction: transactionCollection }
}
