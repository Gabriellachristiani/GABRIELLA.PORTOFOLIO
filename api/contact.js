// Fungsi server Vercel: menyimpan pesan dari formulir kontak ke Sanity (dokumen "message").
// Butuh environment variable SANITY_WRITE_TOKEN (token Sanity dengan peran Editor).
import { projectId, dataset, apiVersion } from '../src/sanity/env.js';

const clean = (value, max) => String(value ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = (process.env.SANITY_WRITE_TOKEN || '').trim();
  if (!token || projectId.startsWith('GANTI')) {
    return res.status(503).json({
      error: 'Formulir belum aktif. Silakan hubungi lewat email langsung.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  // Kolom jebakan untuk bot: pengunjung asli tidak pernah mengisinya.
  if (body.website) return res.status(200).json({ success: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 200) || 'Portfolio Inquiry';
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nama, email, dan pesan wajib diisi.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Format email tidak valid.' });
  }

  try {
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        mutations: [
          {
            create: {
              _type: 'message',
              name,
              email,
              subject,
              message,
              receivedAt: new Date().toISOString(),
              read: false,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Sanity menolak pesan:', response.status, await response.text());
      return res.status(502).json({ error: 'Pesan belum bisa disimpan. Silakan coba lagi nanti.' });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Gagal menyimpan pesan:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan. Silakan coba lagi nanti.' });
  }
}
