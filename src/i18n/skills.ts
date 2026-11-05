// Stack, formación y certificaciones. Dueño en la fase 2: pf-work.

const es = {
  skills: {
    label: 'stack',
    title: 'Herramientas',
    lead: 'Lo que uso a diario, y lo que sé poner en producción.',
    groups: [
      { k: 'languages', t: 'Lenguajes', v: ['Java', 'TypeScript', 'JavaScript', 'PHP', 'Python', 'C#', 'SQL', 'Bash'] },
      { k: 'backend', t: 'Backend', v: ['Spring Boot', 'Node.js', 'NestJS', 'Express', 'Laravel', 'ASP.NET Core', 'Jakarta EE'] },
      { k: 'frontend', t: 'Frontend', v: ['Vue.js', 'React', 'Next.js', 'Angular', 'Quasar', 'Astro'] },
      { k: 'data', t: 'Datos', v: ['PostgreSQL', 'Oracle · PL/SQL', 'MySQL', 'MariaDB', 'SQL Server', 'MongoDB', 'Firebase'] },
      { k: 'ai', t: 'IA aplicada', v: ['Agentes de IA', 'Integración de LLMs', 'Automatización de flujos', 'IA multimodal', 'Google Gemini', 'Diseño de prompts'] },
      { k: 'infra', t: 'Infraestructura', v: ['Kubernetes', 'Docker', 'Podman', 'Linux · RHEL', 'Nginx', 'WildFly', 'Tomcat'] },
      { k: 'cloud', t: 'Nube y entrega', v: ['GCP', 'AWS', 'Azure DevOps', 'Cloudflare', 'GitHub Actions', 'GitLab', 'GitOps', 'OpenTofu', 'Ansible'] },
    ],
    eduTitle: 'Formación',
    edu: [
      { t: 'Ingeniería de Sistemas Informáticos', s: 'Universidad de El Salvador · 2023', n: 'Graduado con honores, primer lugar de la promoción.' },
      { t: 'Bachillerato Técnico en Infraestructura Tecnológica', s: 'CE INSA · 2017', n: 'Graduado con honores, primer lugar de la promoción.' },
      { t: 'Programa Jóvenes Talento en TI', s: 'Universidad Francisco Gavidia · 2017', n: '' },
      { t: 'Inglés, 20 niveles', s: 'Universidad de El Salvador · 2024', n: 'Nivel profesional.' },
    ],
    certTitle: 'Certificaciones',
    certs: ['MongoDB M121 · Aggregation Framework', 'MongoDB M001 · Basics'],
  },
};

type Skills = typeof es;

const en: Skills = {
  skills: {
    label: 'stack',
    title: 'Toolbox',
    lead: 'What I use every day, and what I know how to run in production.',
    groups: [
      { k: 'languages', t: 'Languages', v: ['Java', 'TypeScript', 'JavaScript', 'PHP', 'Python', 'C#', 'SQL', 'Bash'] },
      { k: 'backend', t: 'Backend', v: ['Spring Boot', 'Node.js', 'NestJS', 'Express', 'Laravel', 'ASP.NET Core', 'Jakarta EE'] },
      { k: 'frontend', t: 'Frontend', v: ['Vue.js', 'React', 'Next.js', 'Angular', 'Quasar', 'Astro'] },
      { k: 'data', t: 'Data', v: ['PostgreSQL', 'Oracle · PL/SQL', 'MySQL', 'MariaDB', 'SQL Server', 'MongoDB', 'Firebase'] },
      { k: 'ai', t: 'Applied AI', v: ['AI agents', 'LLM integrations', 'Workflow automation', 'Multimodal AI', 'Google Gemini', 'Prompt design'] },
      { k: 'infra', t: 'Infrastructure', v: ['Kubernetes', 'Docker', 'Podman', 'Linux · RHEL', 'Nginx', 'WildFly', 'Tomcat'] },
      { k: 'cloud', t: 'Cloud & delivery', v: ['GCP', 'AWS', 'Azure DevOps', 'Cloudflare', 'GitHub Actions', 'GitLab', 'GitOps', 'OpenTofu', 'Ansible'] },
    ],
    eduTitle: 'Education',
    edu: [
      { t: 'B.Sc. Computer Systems Engineering', s: 'Universidad de El Salvador · 2023', n: 'Graduated with honors, top of the class.' },
      { t: 'Technical High School, IT Infrastructure', s: 'CE INSA · 2017', n: 'Graduated with honors, valedictorian.' },
      { t: 'Young Talent IT Program', s: 'Universidad Francisco Gavidia · 2017', n: '' },
      { t: 'English, 20 levels', s: 'Universidad de El Salvador · 2024', n: 'Professional proficiency.' },
    ],
    certTitle: 'Certifications',
    certs: ['MongoDB M121 · Aggregation Framework', 'MongoDB M001 · Basics'],
  },
};

export const skills = { es, en };
