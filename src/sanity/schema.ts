import { defineArrayMember, defineField, defineType } from 'sanity';

const stringList = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    of: [defineArrayMember({ type: 'string' })],
  });

export const profile = defineType({
  name: 'profile',
  title: 'Profil',
  type: 'document',
  fields: [
    defineField({ name: 'fullName', title: 'Nama lengkap', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Jabatan / Judul profesi', type: 'string' }),
    defineField({ name: 'greeting', title: 'Sapaan di halaman utama', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'text', rows: 3 }),
    defineField({ name: 'heroPhoto', title: 'Foto halaman utama (Hero)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'aboutPhoto', title: 'Foto bagian About', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'avatar', title: 'Avatar kecil (opsional)', type: 'image' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Nomor telepon', type: 'string' }),
    defineField({ name: 'location', title: 'Lokasi', type: 'string' }),
    defineField({ name: 'linkedInUrl', title: 'Link LinkedIn', type: 'url' }),
    defineField({ name: 'githubUrl', title: 'Link GitHub', type: 'url' }),
    defineField({ name: 'bioSummary', title: 'Ringkasan singkat', type: 'text', rows: 4 }),
    stringList('bioParagraphs', 'Paragraf bio (satu item = satu paragraf)'),
    defineField({
      name: 'educationTimeline',
      title: 'Riwayat pendidikan',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'education',
          fields: [
            defineField({ name: 'degree', title: 'Jenjang / Jurusan', type: 'string' }),
            defineField({ name: 'institution', title: 'Institusi', type: 'string' }),
            defineField({ name: 'period', title: 'Periode', type: 'string' }),
            defineField({ name: 'gpa', title: 'IPK', type: 'string' }),
            defineField({ name: 'notes', title: 'Catatan', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'degree', subtitle: 'institution' } },
        }),
      ],
    }),
    stringList('areasOfInterest', 'Bidang minat'),
    stringList('professionalStrengths', 'Kekuatan profesional'),
    defineField({
      name: 'coreCompetencies',
      title: 'Kompetensi inti',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'competency',
          fields: [
            defineField({ name: 'category', title: 'Kategori', type: 'string' }),
            stringList('skills', 'Skill dalam kategori ini'),
          ],
          preview: { select: { title: 'category' } },
        }),
      ],
    }),
    defineField({
      name: 'cv',
      title: 'File CV (PDF)',
      description: 'Unggah CV terbaru di sini. Tombol Download CV di situs akan muncul otomatis.',
      type: 'file',
      options: { accept: '.pdf' },
    }),
  ],
  preview: { select: { title: 'fullName', subtitle: 'title' } },
});

export const project = defineType({
  name: 'project',
  title: 'Proyek',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Judul proyek', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'published',
      title: 'Tampilkan di situs',
      description: 'Matikan untuk menyembunyikan proyek tanpa menghapusnya.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'featured', title: 'Proyek unggulan', type: 'boolean', initialValue: false }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Business Analysis', value: 'business-analysis' },
          { title: 'Data Analytics', value: 'data-analytics' },
        ],
        layout: 'radio',
      },
      initialValue: 'data-analytics',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'projectType', title: 'Jenis proyek', type: 'string' }),
    defineField({ name: 'organization', title: 'Organisasi / Klien', type: 'string' }),
    defineField({ name: 'period', title: 'Periode', type: 'string' }),
    defineField({ name: 'role', title: 'Peran', type: 'string' }),
    defineField({ name: 'date', title: 'Tahun / tanggal', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline (satu kalimat)', type: 'text', rows: 2 }),
    defineField({ name: 'problemStatement', title: 'Latar belakang masalah', type: 'text', rows: 6 }),
    defineField({ name: 'methodology', title: 'Metodologi', type: 'text', rows: 6 }),
    stringList('deliverables', 'Deliverables'),
    stringList('tools', 'Tools yang dipakai'),
    stringList('results', 'Hasil'),
    defineField({ name: 'score', title: 'Skor / metrik utama', type: 'string' }),
    defineField({
      name: 'aspectMetrics',
      title: 'Metrik per aspek (opsional)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'aspectMetric',
          fields: [
            defineField({ name: 'aspect', title: 'Aspek', type: 'string' }),
            defineField({ name: 'sentimentDistribution', title: 'Distribusi sentimen', type: 'string' }),
            defineField({ name: 'scoreOrAccuracy', title: 'Skor / akurasi', type: 'string' }),
            defineField({ name: 'note', title: 'Catatan', type: 'string' }),
          ],
          preview: { select: { title: 'aspect', subtitle: 'scoreOrAccuracy' } },
        }),
      ],
    }),
    defineField({ name: 'liveUrl', title: 'Link proyek (opsional)', type: 'url' }),
    defineField({ name: 'coverImage', title: 'Gambar sampul', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'images',
      title: 'Galeri gambar',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),
    defineField({
      name: 'supportingFiles',
      title: 'File pendukung',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'supportingFile',
          fields: [
            defineField({ name: 'name', title: 'Nama file', type: 'string' }),
            defineField({ name: 'file', title: 'File', type: 'file' }),
            defineField({ name: 'size', title: 'Ukuran (teks, mis. 2 MB)', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'size' } },
        }),
      ],
    }),
    defineField({
      name: 'orderRank',
      title: 'Urutan tampil',
      description: 'Angka kecil tampil lebih dulu (1, 2, 3, ...).',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [{ title: 'Urutan tampil', name: 'orderRankAsc', by: [{ field: 'orderRank', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', published: 'published' },
    prepare: ({ title, subtitle, published }) => ({
      title,
      subtitle: `${published === false ? '(disembunyikan) ' : ''}${subtitle ?? ''}`,
    }),
  },
});

export const experience = defineType({
  name: 'experience',
  title: 'Pengalaman',
  type: 'document',
  fields: [
    defineField({ name: 'role', title: 'Posisi', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'company', title: 'Perusahaan / Instansi', type: 'string' }),
    defineField({ name: 'division', title: 'Divisi', type: 'string' }),
    defineField({ name: 'location', title: 'Lokasi', type: 'string' }),
    defineField({ name: 'period', title: 'Periode (teks)', type: 'string' }),
    defineField({ name: 'current', title: 'Masih berjalan', type: 'boolean', initialValue: false }),
    defineField({ name: 'description', title: 'Deskripsi', type: 'text', rows: 5 }),
    stringList('bulletPoints', 'Poin pencapaian'),
    stringList('technologies', 'Teknologi / tools'),
    defineField({
      name: 'order',
      title: 'Urutan tampil',
      description: 'Angka kecil tampil lebih dulu.',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [{ title: 'Urutan tampil', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'role', subtitle: 'company' } },
});

export const certification = defineType({
  name: 'certification',
  title: 'Sertifikasi',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Nama sertifikat', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'issuer', title: 'Penerbit', type: 'string' }),
    defineField({ name: 'issueDate', title: 'Tahun terbit', type: 'string' }),
    defineField({ name: 'period', title: 'Masa berlaku', type: 'string' }),
    defineField({ name: 'credentialUrl', title: 'Link verifikasi', type: 'url' }),
    defineField({ name: 'credentialFile', title: 'File sertifikat (PDF)', type: 'file' }),
    defineField({ name: 'image', title: 'Gambar sertifikat', type: 'image' }),
    stringList('skills', 'Skill yang tercakup'),
    defineField({ name: 'description', title: 'Deskripsi', type: 'text', rows: 4 }),
    defineField({
      name: 'order',
      title: 'Urutan tampil',
      description: 'Angka kecil tampil lebih dulu.',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [{ title: 'Urutan tampil', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'issuer' } },
});

export const message = defineType({
  name: 'message',
  title: 'Pesan masuk',
  type: 'document',
  readOnly: false,
  fields: [
    defineField({ name: 'name', title: 'Nama', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'subject', title: 'Subjek', type: 'string' }),
    defineField({ name: 'message', title: 'Pesan', type: 'text', rows: 8 }),
    defineField({ name: 'receivedAt', title: 'Diterima', type: 'datetime' }),
    defineField({ name: 'read', title: 'Sudah dibaca', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Terbaru', name: 'receivedDesc', by: [{ field: 'receivedAt', direction: 'desc' }] }],
  preview: { select: { title: 'name', subtitle: 'subject' } },
});

export const schemaTypes = [profile, project, experience, certification, message];
