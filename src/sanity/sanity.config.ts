import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { projectId, dataset } from './env.js';
import { schemaTypes } from './schema';
import { structure } from './structure';
import { importTool } from './importTool';

export default defineConfig({
  name: 'default',
  title: 'Admin Portofolio',
  projectId,
  dataset,
  basePath: '/admin',
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
  tools: (prev) => [...prev, importTool],
  document: {
    // Profil hanya satu dokumen, pesan datang dari formulir kontak.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((t) => t.templateId !== 'profile' && t.templateId !== 'message')
        : prev,
  },
});
