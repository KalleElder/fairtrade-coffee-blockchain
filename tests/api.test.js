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
})
