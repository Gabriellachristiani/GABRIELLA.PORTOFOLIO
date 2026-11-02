import { projectId, dataset, apiVersion } from './env.js';
import seed from './seed/portfolio.json';
import type { PortfolioData } from '../types/portfolio';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;

export const sanityReady = !projectId.startsWith('GANTI');

const QUERY = `{
  "profile": *[_id == "profile"][0]{
    fullName, title, greeting, headline, email, phone, location, linkedInUrl, githubUrl,
    bioSummary, bioParagraphs,
    educationTimeline[]{degree, institution, period, gpa, notes},
    areasOfInterest, professionalStrengths,
    coreCompetencies[]{category, skills},
    "heroPhotoUrl": heroPhoto.asset->url,
    "aboutPhotoUrl": aboutPhoto.asset->url,
    "avatarUrl": coalesce(avatar.asset->url, heroPhoto.asset->url),
    "cvUrl": cv.asset->url,
    "cvFileName": cv.asset->originalFilename,
    "cvUpdatedAt": cv.asset->_updatedAt
  },
  "projects": *[_type == "project" && published != false] | order(orderRank asc, _createdAt desc){
    "id": _id, title, category, projectType, organization, period, role, tagline,
    problemStatement, methodology, deliverables, tools, results, score,
    aspectMetrics[]{aspect, sentimentDistribution, scoreOrAccuracy, note},
    liveUrl,
    "coverImage": coverImage.asset->url,
    "images": images[].asset->url,
    "supportingFiles": supportingFiles[]{"id": _key, name, "url": file.asset->url, size},
    "published": coalesce(published, true), "featured": coalesce(featured, false),
    date, "createdAt": _createdAt
  },
  "experiences": *[_type == "experience"] | order(order asc){
    "id": _id, role, company, division, location, period,
    "current": coalesce(current, false), description, bulletPoints, technologies
  },
  "certifications": *[_type == "certification"] | order(order asc){
    "id": _id, title, issuer, issueDate, period, credentialUrl,
    "credentialFileUrl": credentialFile.asset->url,
    skills,
    "imageUrl": image.asset->url,
    description
  }
}`;

/** GROQ mengembalikan null untuk field kosong; komponen situs mengharapkan undefined / array kosong. */
function stripNulls(value: unknown): unknown {
  if (Array.isArray(value)) return value.filter((v) => v !== null).map(stripNulls);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Json)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [k, stripNulls(v)])
    );
  }
  return value;
}

const arr = (v: unknown) => (Array.isArray(v) ? v : []);

function normalize(raw: Json): PortfolioData {
  const r = stripNulls(raw) as Json;
  const p: Json = r.profile ?? {};
  return {
    profile: {
      ...p,
      bioParagraphs: arr(p.bioParagraphs),
      educationTimeline: arr(p.educationTimeline),
      areasOfInterest: arr(p.areasOfInterest),
      professionalStrengths: arr(p.professionalStrengths),
      coreCompetencies: arr(p.coreCompetencies).map((c: Json) => ({ ...c, skills: arr(c.skills) })),
    } as PortfolioData['profile'],
    projects: arr(r.projects).map((x: Json) => ({
      ...x,
      deliverables: arr(x.deliverables),
      tools: arr(x.tools),
      results: arr(x.results),
      images: arr(x.images),
    })),
    experiences: arr(r.experiences).map((x: Json) => ({
      ...x,
      bulletPoints: arr(x.bulletPoints),
      technologies: arr(x.technologies),
    })),
    certifications: arr(r.certifications).map((x: Json) => ({ ...x, skills: arr(x.skills) })),
  } as PortfolioData;
}

/** Data bawaan (dari portfolio.json lama), dipakai selama database Sanity belum diisi. */
function fromSeed(): PortfolioData {
  const s = JSON.parse(JSON.stringify(seed)) as PortfolioData;
  s.profile.cvUrl = '';
  s.profile.heroPhotoUrl = s.profile.heroPhotoUrl || undefined;
  s.profile.aboutPhotoUrl = s.profile.aboutPhotoUrl || undefined;
  s.projects = s.projects.filter((p) => p.published);
  return s;
}

export async function loadPortfolio(): Promise<PortfolioData> {
  if (!sanityReady) return fromSeed();
  try {
    const url =
      `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
      `?perspective=published&query=${encodeURIComponent(QUERY)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity menjawab ${res.status}`);
    const { result } = await res.json();
    // Belum ada profil di database = data belum diimpor, pakai data bawaan.
    if (!result?.profile) return fromSeed();
    return normalize(result);
  } catch (err) {
    console.error('Gagal memuat data dari Sanity, memakai data bawaan:', err);
    return fromSeed();
  }
}
