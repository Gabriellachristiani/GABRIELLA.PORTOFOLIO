import { Studio } from 'sanity';
import config from './sanity.config';
import { projectId } from './env.js';

export default function StudioPage() {
  if (projectId.startsWith('GANTI')) {
    return (
      <div style={{ padding: 40, maxWidth: 640, margin: '0 auto', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
        <h1>Admin belum aktif</h1>
        <p>
          Buka file <code>src/sanity/env.js</code> di GitHub, ganti <code>GANTI_DENGAN_PROJECT_ID</code> dengan
          Project ID dari sanity.io/manage, lalu simpan (Commit changes). Setelah Vercel selesai membangun
          ulang, halaman ini akan menampilkan panel admin.
        </p>
        <p><a href="/">Kembali ke situs</a></p>
      </div>
    );
  }
  return <Studio config={config} unstable_globalStyles />;
}
