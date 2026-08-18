import express from 'express'
import Blockchain from './Blockchain.js'
import validateTransaction from './middleware/validateTransaction.js'

const app = express()
const blockchain = new Blockchain()

app.use(express.json())

app.get('/blockchain', (req, res) => {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions
  })
})

app.post('/transactions', validateTransaction, (req, res) => {
  const transaction = {
    sender: req.body.sender,
    recipient: req.body.recipient,
    batchId: req.body.batchId,
    weightKg: req.body.weightKg
  }

  blockchain.addTransaction(transaction)

  res.status(201).json({
    message: 'Transaktionen har lagts till',
    transaction
  })
})

export default app
