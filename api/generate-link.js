import { kv } from '@vercel/kv'
import { randomUUID } from 'node:crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { ttlMinutes = 60 } = req.body || {}
    const token = randomUUID()
    await kv.set(`one:${token}`, 'ok', { ex: Math.max(1, Math.floor(ttlMinutes * 60)) })

    const baseUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`
    const url = `${baseUrl}/secure.html?token=${token}`

    res.status(200).json({ url })
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate link' })
  }
}
