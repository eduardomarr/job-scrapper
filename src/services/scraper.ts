import * as cheerio from "cheerio";
import type { Job, JobSite } from "../types/index.js";
import { keywords } from "../config/jobSites.js";
import puppeteer from "puppeteer";

export class JobScraper {
  async fetchPage(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error(`Erro ao buscar ${url}:`, (error as Error).message);
      throw error;
    }
  }

  async scrapeSmartRecruiters(url: string): Promise<Job[]> {
    const html = await this.fetchPage(url);
    const $ = cheerio.load(html);
    const jobs: Job[] = [];

    // SmartRecruiters usa essa estrutura
    $(".opening-job").each((i, elem) => {
      const title = $(elem).find("h4").text().trim();
      const location = $(elem).find(".job-location").text().trim();
      const link = $(elem).find("a").attr("href");

      if (title) {
        jobs.push({
          title,
          location,
          url: link?.startsWith("http")
            ? link
            : `https://careers.smartrecruiters.com${link}`,
          site: url,
        });
      }
    });

    // Fallback: tenta outra estrutura comum
    if (jobs.length === 0) {
      $('li[class*="job"], div[class*="job"]').each((i, elem) => {
        const title = $(elem)
          .find('h3, h4, [class*="title"]')
          .first()
          .text()
          .trim();
        const link = $(elem).find("a").first().attr("href");

        if (title) {
          jobs.push({
            title,
            location: $(elem).find('[class*="location"]').first().text().trim(),
            url: link?.startsWith("http")
              ? link
              : `https://careers.smartrecruiters.com${link}`,
            site: url,
          });
        }
      });
    }

    return jobs;
  }

  async scrapeGeneric(url: string): Promise<Job[]> {
    // Implementação genérica para outros sites
    const html = await this.fetchPage(url);
    const $ = cheerio.load(html);
    const jobs: Job[] = [];

    // Tenta encontrar vagas com seletores comuns
    const selectors = [
      'div[class*="job"]',
      'li[class*="job"]',
      'article[class*="job"]',
      'div[class*="position"]',
      'div[class*="opening"]',
    ];

    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const title = $(elem)
          .find('h1, h2, h3, h4, [class*="title"]')
          .first()
          .text()
          .trim();
        const link = $(elem).find("a").first().attr("href");

        if (title && title.length > 3) {
          jobs.push({
            title,
            location: $(elem).find('[class*="location"]').first().text().trim(),
            url: link || "",
            site: url,
          });
        }
      });

      if (jobs.length > 0) break;
    }

    return jobs;
  }

  async getByDynamicPage(url: string): Promise<Job[]> {
    console.log("🚀 ~ JobScraper ~ getByDynamicPage ~ url:", url);
    const html = await this.fetchDynamicPage(url);
    const $ = cheerio.load(html);

    const jobs: Job[] = [];

    $("li").each((_, li) => {
      const title = $(li).find("h2, h3, a, span").first().text().trim();
      const link = $(li).find("a").attr("href");
      const location = $(li).find('[class*="location"]').text().trim();

      if (title && title.length > 3) {
        jobs.push({
          title,
          location,
          url: link?.startsWith("http") ? link : "",
          site: url,
        });
      }
    });

    return jobs;
  }

  async scrape(url: string, type: JobSite["type"]): Promise<Job[]> {
    console.log(`🔍 Buscando vagas em: ${url}`);

    try {
      if (type === "smartrecruiters") {
        return await this.scrapeSmartRecruiters(url);
      } else if (type === "DynamicPage") {
        return await this.getByDynamicPage(url);
      } else {
        return await this.scrapeGeneric(url);
      }
    } catch (error) {
      console.error(
        `Erro ao fazer scraping de ${url}:`,
        (error as Error).message,
      );
      return [];
    }
  }

  private async fetchDynamicPage(url: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      // Define um timeout maior
      page.setDefaultNavigationTimeout(60000); // 60 segundos
      page.setDefaultTimeout(60000);

      // Tenta carregar com timeout menor, mas não falha se não conseguir
      await page.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});

      // Aguarda os elementos de vagas carregarem
      await page.waitForSelector("li", { timeout: 15000 }).catch(() => {
        console.log("⚠️  Elementos não carregaram, continuando mesmo assim...");
      });

      // Aguarda um pouco extra para o conteúdo renderizar
      await page.evaluate(() => {
        return new Promise((resolve) => setTimeout(resolve, 2000));
      });

      const html = await page.content();

      return html;
    } catch (error: unknown) {
      const message = `❌ Error to get Dynamic Page ${url}: ${(error as Error).message}`;
      throw new Error(message);
    } finally {
      await browser.close();
    }
  }
}
