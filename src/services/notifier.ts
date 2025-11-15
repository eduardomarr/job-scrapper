import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import type { JobsBySite } from '../types/index.js';

dotenv.config();

export class Notifier {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  generateEmailHTML(jobsBySite: JobsBySite): string {
    const totalJobs = Object.values(jobsBySite).flat().length;

    let html = `
      <h1>🎯 Novas Vagas Encontradas!</h1>
      <p>Encontramos ${totalJobs} vagas que correspondem aos seus critérios:</p>
    `;

    for (const [siteName, jobs] of Object.entries(jobsBySite)) {
      html += `
        <h2>📍 ${siteName}</h2>
        <ul style="list-style: none; padding: 0;">
      `;

      for (const job of jobs) {
        html += `
          <li style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
            <strong style="color: #2563eb;">${job.title}</strong><br>
            <span style="color: #666;">📌 Palavra-chave: ${job.matchedKeyword}</span><br>
            ${job.location ? `<span style="color: #666;">📍 ${job.location}</span><br>` : ''}
            <a href="${job.url}" style="color: #2563eb;">Ver vaga →</a>
          </li>
        `;
      }

      html += '</ul>';
    }

    html += `
      <hr>
      <p style="color: #666; font-size: 12px;">
        Email gerado automaticamente pelo Job Monitor em ${new Date().toLocaleString('pt-BR')}
      </p>
    `;

    return html;
  }

  async sendEmail(jobsBySite: JobsBySite): Promise<void> {
    try {
      const totalJobs = Object.values(jobsBySite).flat().length;

      if (totalJobs === 0) {
        console.log('✅ Nenhuma vaga nova encontrada. Email não enviado.');
        return;
      }

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `🎯 ${totalJobs} Nova(s) Vaga(s) Encontrada(s)!`,
        html: this.generateEmailHTML(jobsBySite)
      });

      console.log(`✅ Email enviado com ${totalJobs} vagas!`);
    } catch (error) {
      console.error('❌ Erro ao enviar email:', (error as Error).message);
    }
  }

  printToConsole(jobsBySite: JobsBySite): void {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 VAGAS ENCONTRADAS');
    console.log('='.repeat(60) + '\n');

    const totalJobs = Object.values(jobsBySite).flat().length;

    if (totalJobs === 0) {
      console.log('❌ Nenhuma vaga encontrada com as palavras-chave especificadas.\n');
      return;
    }

    for (const [siteName, jobs] of Object.entries(jobsBySite)) {
      console.log(`\n📍 ${siteName} (${jobs.length} vagas)`);
      console.log('-'.repeat(60));

      for (const job of jobs) {
        console.log(`\n  ✨ ${job.title}`);
        console.log(`     🔑 Keyword: ${job.matchedKeyword}`);
        if (job.location) console.log(`     📍 Local: ${job.location}`);
        console.log(`     🔗 ${job.url}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Total: ${totalJobs} vaga(s) encontrada(s)`);
    console.log('='.repeat(60) + '\n');
  }
}