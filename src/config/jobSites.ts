import { JobSite, SearchConfig } from "../types";

// Configuração de sites e palavras-chave para monitorar
export const jobSites: JobSite[] = [
  {
    name: "Visa/Pismo",
    url: "https://careers.smartrecruiters.com/Visa/careers-at-pismo",
    type: "smartrecruiters",
  },
  // {
  //   name: "Quinto andar",
  //   url: "https://carreiras.quintoandar.com.br/vagas-abertas/",
  //   type: "htmlDOM",
  // },
  {
    name: "Ifood",
    url: "https://carreiras.ifood.com.br/jobs/",
    type: "htmlDOM",
  },
  // {
  //   name: "Picpay",
  //   url: "https://picpay.com/oportunidades-de-emprego-e-carreiras/central-de-vagas",
  //   type: "htmlDOM",
  // },
];

export const keywords: string[] = [
  "frontend",
  "front-end",
  "react",
  "javascript",
  "typescript",
  "fullstack",
  "full-stack",
  "full stack",
  "nodejs",
  "node.js",
  "reactjs",
  "react.js",
];

// Configurações de busca
export const searchConfig: SearchConfig = {
  caseSensitive: false,
  matchWholeWord: false,
};
