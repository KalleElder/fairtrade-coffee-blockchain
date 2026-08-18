import { describe, it, expect } from 'vitest'
import Blockchain from '../src/Blockchain.js'

describe('Blockchain', () => {
  describe('calculateHash', () => {
    it('ska skapa samma SHA-256-hash för samma data', () => {
      const blockchain = new Blockchain()

      const hash1 = blockchain.calculateHash(
        1,
        'previousHash',
        [{ sender: 'farm', recipient: 'roastery', batchId: 'batch-001', weightKg: 50 }],
        0
      )

      const hash2 = blockchain.calculateHash(
        1,
        'previousHash',
        [{ sender: 'farm', recipient: 'roastery', batchId: 'batch-001', weightKg: 50 }],
        0
      )

      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64)
    })
  })

  describe('mineBlock', () => {
    it('ska hitta en hash som uppfyller svårighetsgraden', () => {
      const blockchain = new Blockchain()
      blockchain.difficulty = 1

      const block = {
        index: 1,
        previousHash: 'previousHash',
        transactions: [
          {
            sender: 'farm',
            recipient: 'roastery',
            batchId: 'batch-001',
            weightKg: 50
          }
        ],
        nonce: 0,
        hash: ''
      }

      blockchain.mineBlock(block)

      expect(block.hash.startsWith('0')).toBe(true)
      expect(block.nonce).toBeGreaterThanOrEqual(0)
    })
  })

  describe('constructor', () => {
    it('ska starta med ett genesis-block och en tom lista med väntande transaktioner', () => {
      const blockchain = new Blockchain()

      expect(blockchain.chain).toHaveLength(1)
      expect(blockchain.pendingTransactions).toEqual([])

      expect(blockchain.chain[0]).toMatchObject({
        index: 0,
        transactions: [],
        previousHash: '0',
        nonce: 0
      })
    })
  })

  describe('addTransaction', () => {
    it('ska lägga till en transaktion i listan med väntande transaktioner', () => {
      const blockchain = new Blockchain()

      const transaction = {
        sender: 'Coffee Farm',
        recipient: 'Coffee Roastery',
        batchId: 'batch-002',
        weightKg: 75
      }

      blockchain.addTransaction(transaction)

      expect(blockchain.pendingTransactions).toHaveLength(1)
      expect(blockchain.pendingTransactions[0]).toEqual(transaction)
    })
  })
})

describe('minePendingTransactions', () => {
  it('ska skapa ett nytt block och tömma väntande transaktioner', () => {
    const blockchain = new Blockchain()

    const transaction = {
      sender: 'Coffee Farm',
      recipient: 'Coffee Roastery',
      batchId: 'batch-003',
      weightKg: 100
    }

    blockchain.addTransaction(transaction)

    const block = blockchain.minePendingTransactions()

    expect(blockchain.chain).toHaveLength(2)
    expect(block.transactions).toEqual([transaction])
    expect(block.previousHash).toBe(blockchain.chain[0].hash)
    expect(block.hash.startsWith('0')).toBe(true)
    expect(blockchain.pendingTransactions).toEqual([])
  })
})
