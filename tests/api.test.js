import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('API', () => {
  describe('GET /blockchain', () => {
    it('ska returnera blockkedjan', async () => {
      const response = await request(app)
        .get('/blockchain')
        .expect(200)

      expect(response.body.chain).toBeDefined()
      expect(response.body.pendingTransactions).toBeDefined()
      expect(response.body.chain).toHaveLength(1)
    })
  })

  describe('POST /transactions', () => {
    it('ska lägga till en giltig transaktion', async () => {
      const transaction = {
        sender: 'Coffee Farm',
        recipient: 'Coffee Roastery',
        batchId: 'batch-004',
        weightKg: 120
      }

      const response = await request(app)
        .post('/transactions')
        .send(transaction)
        .expect(201)

      expect(response.body.message).toBe('Transaktionen har lagts till')
      expect(response.body.transaction).toEqual(transaction)
    })

    it('ska avvisa en transaktion som saknar batchId', async () => {
      const transaction = {
        sender: 'Coffee Farm',
        recipient: 'Coffee Roastery',
        weightKg: 120
      }

      const response = await request(app)
        .post('/transactions')
        .send(transaction)
        .expect(400)

      expect(response.body.error).toBeDefined()
    })
  })
})

describe('POST /mine', () => {
  it('ska mine:a väntande transaktioner till ett nytt block', async () => {
    const transaction = {
      sender: 'Coffee Farm',
      recipient: 'Coffee Roastery',
      batchId: 'batch-005',
      weightKg: 80
    }

    await request(app)
      .post('/transactions')
      .send(transaction)
      .expect(201)

    const response = await request(app)
      .post('/mine')
      .expect(201)

    expect(response.body.message).toBe('Nytt block har skapats')
    expect(response.body.block).toBeDefined()
    expect(response.body.block.transactions).toContainEqual(transaction)
    expect(response.body.block.hash.startsWith('0')).toBe(true)

    const blockchainResponse = await request(app)
      .get('/blockchain')
      .expect(200)

    expect(blockchainResponse.body.pendingTransactions).toEqual([])
  })
})
