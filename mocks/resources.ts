export type ResourceType = 'app' | 'web' | 'book' | 'video' | 'audio';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  url: string;
}

export const resources: Resource[] = [
  {
    id: '1',
    type: 'app',
    title: 'Headspace - Meditación guiada',
    description: 'Aplicación con meditaciones guiadas, ejercicios de respiración y técnicas para dormir mejor.',
    url: 'https://www.headspace.com',
  },
  {
    id: '2',
    type: 'web',
    title: 'Teléfono de la Esperanza',
    description: 'Línea de ayuda emocional disponible 24 horas, los 365 días del año. Llamada gratuita: 717 003 717',
    url: 'https://telefonodelaesperanza.org/',
  },
  {
    id: '3',
    type: 'audio',
    title: 'Música para relajación profunda',
    description: 'Playlist de Spotify con música ambiental y sonidos de la naturaleza para relajarte.',
    url: 'https://open.spotify.com/',
  },
  {
    id: '4',
    type: 'app',
    title: 'Petit BamBou',
    description: 'Aplicación móvil con programas de meditación y Mindfulness para ayudarte a prestar atención al presente sin hacer juicios de valor.',
    url: 'https://www.petitbambou.com',
  },
  {
    id: '5',
    type: 'book',
    title: 'El poder del ahora - Eckhart Tolle',
    description: 'Un libro que ofrece consejos y estrategias para vivir en el presente y reducir la ansiedad.',
    url: 'https://www.amazon.com',
  },
];
