import { JobScraper } from '../services/scraper';
import { JobFilter } from '../services/jobFilter';
import { Notifier } from '../services/notifier';
import { jobSites } from '../config/jobSites';
import type { JobsBySite } from '../types/index';

export async function checkJobs(): Promise<void> {
  console.log('🚀 Iniciando verificação de vagas...\n');

  const scraper = new JobScraper();
  const filter = new JobFilter();
  const notifier = new Notifier();

  const jobsBySite: JobsBySite = {};

  for (const site of jobSites) {
    try {
      // Faz scraping do site
      const jobs = await scraper.scrape(site.url, site.type);
      console.log(`   Encontradas ${jobs.length} vagas no total`);

      // Filtra por palavras-chave
      const matchedJobs = filter.filterJobs(jobs);
      console.log(`   ✅ ${matchedJobs.length} vagas correspondem às keywords\n`);

      if (matchedJobs.length > 0) {
        jobsBySite[site.name] = matchedJobs;
      }

      // Aguarda um pouco entre requisições para não sobrecarregar os sites
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ Erro ao processar ${site.name}:`, (error as Error).message);
    }
  }

  // Notifica sobre as vagas encontradas
  notifier.printToConsole(jobsBySite);

  // Envia email se configurado
  if (process.env.EMAIL_USER && process.env.EMAIL_TO) {
    await notifier.sendEmail(jobsBySite);
  }

  console.log('✅ Verificação concluída!\n');
}

// Permite executar diretamente: tsx src/jobs/checkJobs.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  checkJobs().catch(console.error);
}