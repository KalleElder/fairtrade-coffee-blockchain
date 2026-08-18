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
})
