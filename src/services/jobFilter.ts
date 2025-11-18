import { keywords, searchConfig } from "../config/jobSites.js";
import type { Job, MatchedJob } from "../types/index.js";

export class JobFilter {
  matchesKeyword(jobTitle: string, keyword: string): boolean {
    const title = searchConfig.caseSensitive
      ? jobTitle
      : jobTitle.toLowerCase();
    const key = searchConfig.caseSensitive ? keyword : keyword.toLowerCase();

    if (searchConfig.matchWholeWord) {
      const regex = new RegExp(`\\b${key}\\b`, "i");
      return regex.test(title);
    }

    return title.includes(key);
  }

  filterJobs(
    jobs: Job[],
    customKeywords: string[] | null = null,
  ): MatchedJob[] {
    if (jobs.length === 0) return [];

    const keywordsToUse = customKeywords || keywords;
    const matchedJobs: MatchedJob[] = [];

    for (const job of jobs) {
      for (const keyword of keywordsToUse) {
        if (this.matchesKeyword(job.title, keyword)) {
          matchedJobs.push({
            ...job,
            matchedKeyword: keyword,
          });
          break; // Evita duplicatas se múltiplas keywords fizerem match
        }
      }
    }

    return matchedJobs;
  }

  groupByKeyword(jobs: MatchedJob[]): Record<string, MatchedJob[]> {
    const grouped: Record<string, MatchedJob[]> = {};

    for (const job of jobs) {
      const keyword = job.matchedKeyword;
      if (!grouped[keyword]) {
        grouped[keyword] = [];
      }
      grouped[keyword].push(job);
    }

    return grouped;
  }
}
