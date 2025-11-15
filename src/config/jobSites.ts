import { JobSite, SearchConfig } from "../types";

// Configuração de sites e palavras-chave para monitorar
export const jobSites: JobSite[] = [
  {
    name: "Visa/Pismo",
    url: "https://careers.smartrecruiters.com/Visa/careers-at-pismo",
    type: "smartrecruiters",
  },
  {
    name: "Quinto andar",
    url: "https://carreiras.quintoandar.com.br/vagas-abertas/",
    type: "custom",
  },
  {
    name: "Ifood",
    url: "https://carreiras.ifood.com.br/jobs/",
    type: "smartrecruiters",
  },
  {
    name: "Nubank",
    url: "https://picpay.com/oportunidades-de-emprego-e-carreiras/central-de-vagas",
    type: "smartrecruiters",
  },
];

export const keywords: string[] = [
  "frontend",
  "front-end",
  "react",
  "javascript",
  "typescript",
  "fullstack",
  "full-stack",
  "nodejs",
  "node.js",
  "reactjs",
  "react.js",
  "staff",
];

// Configurações de busca
export const searchConfig: SearchConfig = {
  caseSensitive: false,
  matchWholeWord: false,
};
