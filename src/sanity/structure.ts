import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portofolio')
    .items([
      S.listItem()
        .title('Profil & Tentang Saya')
        .id('profile')
        .child(S.document().schemaType('profile').documentId('profile').title('Profil & Tentang Saya')),
      S.divider(),
      S.listItem()
        .title('Proyek')
        .schemaType('project')
        .child(
          S.documentTypeList('project')
            .title('Proyek')
            .defaultOrdering([{ field: 'orderRank', direction: 'asc' }])
        ),
      S.listItem()
        .title('Pengalaman')
        .schemaType('experience')
        .child(
          S.documentTypeList('experience')
            .title('Pengalaman')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
      S.listItem()
        .title('Sertifikasi')
        .schemaType('certification')
        .child(
          S.documentTypeList('certification')
            .title('Sertifikasi')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Pesan Masuk')
        .schemaType('message')
        .child(
          S.documentTypeList('message')
            .title('Pesan Masuk')
            .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
        ),
    ]);
