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
})
