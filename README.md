# Portofolio Gabriella Christiani

Situs portofolio (React + Vite) dengan database dan panel admin dari Sanity.

- Situs publik: `/`
- Panel admin: `/admin` (login dengan akun Google atau GitHub yang dipakai di Sanity)
- Data (profil, proyek, pengalaman, sertifikasi, pesan masuk) tersimpan di Sanity

## Pengaturan awal (sekali saja)

1. Buat project di https://www.sanity.io/manage, lalu salin **Project ID**.
2. Edit `src/sanity/env.js`: ganti `GANTI_DENGAN_PROJECT_ID` dengan Project ID tadi.
3. Di sanity.io/manage > project > API > CORS origins, tambahkan alamat situs
   (`https://gabriellaportfolio.vercel.app`) dengan **Allow credentials** dicentang.
4. Buka `/admin`, login, pilih menu **Impor Data Awal**, lalu klik tombolnya sekali.
5. (Opsional, untuk formulir kontak) Buat token API Sanity dengan peran **Editor**, lalu simpan
   di Vercel > Settings > Environment Variables dengan nama `SANITY_WRITE_TOKEN`.
   Setelah itu lakukan Redeploy.

## Menjalankan di komputer sendiri

```
npm install
npm run dev
```
