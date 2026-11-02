import { createElement } from 'react';
import { buildLegacyTheme, defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { projectId, dataset } from './env.js';
import { schemaTypes } from './schema';
import { structure } from './structure';
import { importTool } from './importTool';

// Warna mengikuti palet situs portofolio (coklat dan krem).
const theme = buildLegacyTheme({
  '--font-family-base': '"Plus Jakarta Sans", system-ui, sans-serif',
  '--black': '#2A1E17',
  '--white': '#FFFDF9',
  '--gray': '#8C7B6B',
  '--gray-base': '#8C7B6B',
  '--component-bg': '#FAF7F2',
  '--component-text-color': '#3E2C22',
  '--brand-primary': '#8C5E34',
  '--focus-color': '#8C5E34',
  '--default-button-color': '#8C7B6B',
  '--default-button-primary-color': '#8C5E34',
  '--default-button-success-color': '#4F7A4A',
  '--default-button-warning-color': '#B7791F',
  '--default-button-danger-color': '#B3402F',
  '--state-info-color': '#8C5E34',
  '--state-success-color': '#4F7A4A',
  '--state-warning-color': '#B7791F',
  '--state-danger-color': '#B3402F',
  '--main-navigation-color': '#3E2C22',
  '--main-navigation-color--inverted': '#FAF7F2',
});

// Tulisan di pojok kiri atas panel admin.
const Logo = () =>
  createElement(
    'span',
    {
      style: {
        fontFamily: '"DM Serif Display", Georgia, serif',
        fontSize: 18,
        letterSpacing: 0.2,
      },
    },
    'Gabriella · Admin'
  );

export default defineConfig({
  name: 'default',
  title: 'Admin Portofolio',
  projectId,
  dataset,
  basePath: '/admin',
  theme,
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
  tools: (prev) => [...prev, importTool],
  studio: { components: { logo: Logo } },
  document: {
    // Profil hanya satu dokumen, pesan datang dari formulir kontak.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((t) => t.templateId !== 'profile' && t.templateId !== 'message')
        : prev,
  },
});
