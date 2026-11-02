import { useState } from 'react';
import { useClient, type Tool } from 'sanity';
import seed from './seed/portfolio.json';
import { apiVersion } from './env.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;

/** Buang nilai kosong supaya tidak melanggar validasi (mis. link kosong). */
const compact = (obj: Json): Json =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );

const keyed = (items: Json[] | undefined, prefix: string): Json[] =>
  (items ?? []).map((item, i) => ({ _key: `${prefix}${i + 1}`, ...compact(item) }));

function buildDocuments(): Json[] {
  const data = seed as Json;
  const p: Json = data.profile ?? {};
  const docs: Json[] = [];

  docs.push(
    compact({
      _id: 'profile',
      _type: 'profile',
      fullName: p.fullName,
      title: p.title,
      greeting: p.greeting,
      headline: p.headline,
      email: p.email,
      phone: p.phone,
      location: p.location,
      linkedInUrl: p.linkedInUrl,
      githubUrl: p.githubUrl,
      bioSummary: p.bioSummary,
      bioParagraphs: p.bioParagraphs ?? [],
      educationTimeline: keyed(p.educationTimeline, 'edu'),
      areasOfInterest: p.areasOfInterest ?? [],
      professionalStrengths: p.professionalStrengths ?? [],
      coreCompetencies: (p.coreCompetencies ?? []).map((c: Json, i: number) => ({
        _key: `cc${i + 1}`,
        category: c.category,
        skills: c.skills ?? [],
      })),
    })
  );

  (data.projects ?? []).forEach((x: Json, i: number) => {
    docs.push(
      compact({
        _id: `project-${x.id}`,
        _type: 'project',
        title: x.title,
        category: x.category,
        projectType: x.projectType,
        organization: x.organization,
        period: x.period,
        role: x.role,
        date: x.date,
        tagline: x.tagline,
        problemStatement: x.problemStatement,
        methodology: x.methodology,
        deliverables: x.deliverables ?? [],
        tools: x.tools ?? [],
        results: x.results ?? [],
        score: x.score,
        aspectMetrics: keyed(x.aspectMetrics, 'am'),
        liveUrl: x.liveUrl,
        published: x.published !== false,
        featured: Boolean(x.featured),
        orderRank: i + 1,
      })
    );
  });

  (data.experiences ?? []).forEach((x: Json, i: number) => {
    docs.push(
      compact({
        _id: `experience-${x.id}`,
        _type: 'experience',
        role: x.role,
        company: x.company,
        division: x.division,
        location: x.location,
        period: x.period,
        current: Boolean(x.current),
        description: x.description,
        bulletPoints: x.bulletPoints ?? [],
        technologies: x.technologies ?? [],
        order: i + 1,
      })
    );
  });

  (data.certifications ?? []).forEach((x: Json, i: number) => {
    docs.push(
      compact({
        _id: `certification-${x.id}`,
        _type: 'certification',
        title: x.title,
        issuer: x.issuer,
        issueDate: x.issueDate,
        period: x.period,
        credentialUrl: x.credentialUrl,
        skills: x.skills ?? [],
        description: x.description,
        order: i + 1,
      })
    );
  });

  return docs;
}

function ImportData() {
  const client = useClient({ apiVersion });
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [info, setInfo] = useState('');

  const run = async () => {
    setStatus('working');
    setInfo('');
    try {
      const docs = buildDocuments();
      const tx = client.transaction();
      // createIfNotExists: aman diklik berulang, data yang sudah kamu edit tidak ditimpa.
      docs.forEach((d) => tx.createIfNotExists(d as never));
      await tx.commit();
      setStatus('done');
      setInfo(`${docs.length} data diproses (profil, proyek, pengalaman, sertifikasi).`);
    } catch (err) {
      setStatus('error');
      setInfo(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 640, fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
      <h2 style={{ marginTop: 0 }}>Impor data awal portofolio</h2>
      <p>
        Tombol ini mengisi database dengan data portofolio yang sudah ada (profil, proyek, pengalaman,
        dan sertifikasi). Cukup klik sekali. Data yang sudah kamu ubah di panel ini tidak akan ditimpa.
      </p>
      <button
        onClick={run}
        disabled={status === 'working'}
        style={{
          padding: '10px 18px',
          fontSize: 15,
          borderRadius: 8,
          border: 'none',
          cursor: status === 'working' ? 'wait' : 'pointer',
          background: '#3E2C22',
          color: '#fff',
        }}
      >
        {status === 'working' ? 'Memproses...' : 'Impor data awal'}
      </button>
      {status === 'done' && (
        <p style={{ color: '#1a7f37' }}>
          Berhasil. {info} Buka menu Proyek atau Pengalaman untuk melihat hasilnya, lalu klik Publish bila
          ada yang kamu ubah.
        </p>
      )}
      {status === 'error' && (
        <p style={{ color: '#cf222e' }}>
          Gagal: {info}
          <br />
          Pastikan kamu login dan alamat situs sudah ditambahkan di pengaturan CORS Sanity.
        </p>
      )}
    </div>
  );
}

export const importTool: Tool = {
  name: 'import',
  title: 'Impor Data Awal',
  component: ImportData,
};
