# 🎯 Job Monitor

Sistema automatizado para monitorar vagas de emprego em sites de carreiras e receber notificações quando novas oportunidades surgirem.

## 📋 Funcionalidades

- ✅ Monitora múltiplos sites de vagas simultaneamente
- 🔍 Filtra vagas por palavras-chave configuráveis
- 📧 Envia notificações por email
- ⏰ Execução automática via cron job (padrão: 1x por semana)
- 🚀 API REST para controle manual
- 📊 Suporte a diferentes tipos de sites de vagas
- 🔧 Fácil de adicionar novos sites e keywords
- 🔒 **Escrito em TypeScript** com tipagem completa

## 🛠️ Instalação

```bash
# Clone o repositório ou crie a pasta do projeto
mkdir job-monitor
cd job-monitor

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Build do projeto TypeScript
npm run build
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente (.env)

```env
PORT=3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_TO=destinatario@email.com
CRON_SCHEDULE=0 9 * * 1  # Segunda às 9h
```

**Para Gmail:** Gere uma senha de app em https://myaccount.google.com/apppasswords

### 2. Adicionar Sites para Monitorar

Edite `src/config/jobSites.ts`:

```typescript
export const jobSites: JobSite[] = [
  {
    name: "Sua Empresa",
    url: "https://empresa.com/carreiras",
    type: "custom", // usa scraper genérico
  },
];
```

### 3. Configurar Palavras-chave

Edite `src/config/jobSites.ts`:

```typescript
export const keywords: string[] = [
  "frontend",
  "front-end",
  "react",
  "vue",
  "angular",
  "javascript",
  "typescript",
];
```

## 🚀 Uso

### Build do projeto

```bash
npm run build
```

### Iniciar o servidor (produção)

```bash
npm start
```

### Desenvolvimento (com auto-reload e sem build)

```bash
npm run dev
```

### Testar verificação manualmente

```bash
npm run check
```

### Type checking (sem compilar)

```bash
npm run type-check
```

## 📡 API Endpoints

### GET /

Health check do serviço

### GET /config

Retorna a configuração atual (sites, keywords, cron)

### POST /check-now

Dispara uma verificação manual imediatamente

```bash
curl -X POST http://localhost:3000/check-now
```

## 📅 Configuração do Cron

O formato do cron segue o padrão Unix:

```
 ┌────────────── segundo (opcional)
 │ ┌──────────── minuto (0 - 59)
 │ │ ┌────────── hora (0 - 23)
 │ │ │ ┌──────── dia do mês (1 - 31)
 │ │ │ │ ┌────── mês (1 - 12)
 │ │ │ │ │ ┌──── dia da semana (0 - 7)
 │ │ │ │ │ │
 * * * * * *
```

Exemplos:

- `0 9 * * 1` - Segunda-feira às 9h
- `0 9 * * 1-5` - Segunda a sexta às 9h
- `0 */6 * * *` - A cada 6 horas
- `0 9,15 * * *` - Às 9h e 15h todos os dias

## 🏗️ Estrutura do Projeto

```
job-monitor/
├── src/
│   ├── types/
│   │   └── index.ts              # Definições de tipos TypeScript
│   ├── config/
│   │   └── jobSites.ts           # Configuração de sites e keywords
│   ├── services/
│   │   ├── scraper.ts            # Web scraping
│   │   ├── jobFilter.ts          # Filtro de vagas
│   │   └── notifier.ts           # Notificações
│   ├── jobs/
│   │   └── checkJobs.ts          # Job principal
│   └── index.ts                  # Servidor Fastify
├── dist/                          # Código compilado (gerado)
├── .env                           # Variáveis de ambiente
├── tsconfig.json                  # Configuração TypeScript
├── package.json
└── README.md
```

## 🔧 Adicionando Suporte a Novos Sites

1. Analise a estrutura HTML do site de vagas
2. Adicione o site em `src/config/jobSites.ts`
3. Se necessário, crie um scraper específico em `src/services/scraper.ts`

Exemplo:

```typescript
async scrapeLinkedIn(url: string): Promise<Job[]> {
  const html = await this.fetchPage(url);
  const $ = cheerio.load(html);
  const jobs: Job[] = [];

  $('.job-card').each((i, elem) => {
    jobs.push({
      title: $(elem).find('.job-title').text().trim(),
      location: $(elem).find('.job-location').text().trim(),
      url: $(elem).find('a').attr('href') || '',
      site: url
    });
  });

  return jobs;
}
```

## 📧 Notificações

O sistema suporta:

- ✅ Email (via Nodemailer)
- ✅ Console/Logs
- 🔜 Slack (adicione conforme necessário)
- 🔜 Telegram (adicione conforme necessário)
- 🔜 Discord (adicione conforme necessário)

## 🐛 Troubleshooting

### Email não está sendo enviado

- Verifique se as credenciais estão corretas no `.env`
- Para Gmail, use uma senha de app, não a senha normal
- Verifique se a autenticação de 2 fatores está ativada

### Scraper não encontra vagas

- Execute `npm run check` para ver os logs detalhados
- O HTML do site pode ter mudado - atualize os seletores
- Alguns sites podem bloquear scrapers - considere usar APIs oficiais

### Cron não está executando

- Verifique o formato do `CRON_SCHEDULE` no `.env`
- Certifique-se de que o servidor está rodando continuamente

## 📝 Licença

MIT

## 🤝 Contribuindo

Sinta-se livre para abrir issues e pull requests!
