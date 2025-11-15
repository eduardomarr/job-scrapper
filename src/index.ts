import Fastify from 'fastify';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { checkJobs } from './jobs/checkJobs.js';
import { jobSites, keywords } from './config/jobSites.js';
import type { ApiConfig } from './types/index.js';
import { CronPeriod } from './enums/CronPeriod.js';

dotenv.config();

const fastify = Fastify({
  logger: true
});

// Configuração do cron job (padrão: toda segunda às 9h)
const cronSchedule = process.env.CRON_SCHEDULE || CronPeriod.WEEKLY;

// Agenda a verificação periódica
cron.schedule(cronSchedule, () => {
  console.log('⏰ Executando verificação agendada...');
  checkJobs();
});

// Rotas da API

// Health check
fastify.get('/', async (request, reply) => {
  return {
    status: 'ok',
    message: 'Job Monitor API',
    nextRun: 'Verificação agendada via cron'
  };
});

// Status da configuração
fastify.get<{ Reply: ApiConfig }>('/config', async (request, reply) => {
  return {
    sites: jobSites.map(s => ({ name: s.name, url: s.url })),
    keywords,
    cronSchedule,
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_TO)
  };
});

// Trigger manual da verificação
fastify.post('/check-now', async (request, reply) => {
  try {
    // Executa de forma assíncrona para não travar a resposta
    setImmediate(() => checkJobs());

    return {
      status: 'started',
      message: 'Verificação iniciada. Acompanhe os logs do console.'
    };
  } catch (error) {
    reply.code(500).send({ error: (error as Error).message });
  }
});

// Inicia o servidor
const start = async (): Promise<void> => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });

    console.log('\n' + '='.repeat(60));
    console.log('🚀 Job Monitor iniciado!');
    console.log('='.repeat(60));
    console.log(`📡 API rodando em: http://localhost:${port}`);
    console.log(`⏰ Cron agendado: ${cronSchedule}`);
    console.log(`📧 Email configurado: ${process.env.EMAIL_USER ? 'Sim' : 'Não'}`);
    console.log(`🎯 Monitorando ${jobSites.length} site(s)`);
    console.log(`🔑 Buscando por ${keywords.length} keyword(s)`);
    console.log('='.repeat(60) + '\n');
    console.log('💡 Dica: Execute "npm run check" para testar agora!\n');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();