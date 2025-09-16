import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { token } = req.body || {}
    if (!token) return res.status(400).json({ ok: false, reason: 'missing token' })

    const key = `one:${token}`
    const exists = await kv.get(key)
    if (!exists) return res.status(200).json({ ok: false, reason: 'invalid-or-used' })

    await kv.del(key) // forbrug engangstoken
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ ok: false, reason: 'server-error' })
  }
}
