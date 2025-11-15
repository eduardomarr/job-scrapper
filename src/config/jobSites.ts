import { JobSite, SearchConfig } from "../types";

// Configuração de sites e palavras-chave para monitorar
export const jobSites: JobSite[] = [
  {
    name: 'Visa/Pismo',
    url: 'https://careers.smartrecruiters.com/Visa/careers-at-pismo',
    type: 'smartrecruiters'
  },
  // Adicione mais sites aqui
  // {
  //   name: 'Outra Empresa',
  //   url: 'https://...',
  //   type: 'custom'
  // }
];

export const keywords: string[] = [
  'frontend',
  'front-end',
  'react',
  'javascript',
  'typescript',
  'fullstack',
  'full-stack',
  'nodejs',
  'node.js',
  'reactss'
];

// Configurações de busca
export const searchConfig: SearchConfig = {
  caseSensitive: false,
  matchWholeWord: false
};