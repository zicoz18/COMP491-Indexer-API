export interface IBlock {
  hash: string
  parentHash: string
  number: number
  timestamp: number
  nonce: string
  difficulty: number
  gasLimit: string
  gasUsed: string
  miner: string
  extraData: string
  baseFeePerGas?: null | string
}

export interface ITransaction {
  hash: string
  type: number
  blockHash: string
  blockNumber: number
  transactionIndex: number
  confirmations: number
  from: string
  gasPrice: string
  maxPriorityFeePerGas: string
  maxFeePerGas: string
  gasLimit: string
  to: string
  value: string
  nonde: number
  data: string
}
