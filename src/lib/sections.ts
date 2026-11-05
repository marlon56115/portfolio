// Orden de las secciones de la página: una sola fuente para Home.astro, la navegación y los índices "01 / …".
// `key` es la clave en dict[lang].nav. Cambiar el orden aquí reordena nav e índices (Home.astro sigue este orden).

export const sections = [
  { id: 'work', key: 'work' },
  { id: 'projects', key: 'projects' },
  { id: 'skills', key: 'skills' },
  { id: 'system', key: 'system' },
  { id: 'contact', key: 'contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

/** Índice de dos dígitos de una sección: sectionIndex('work') → "01". */
export function sectionIndex(id: SectionId): string {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0');
}
