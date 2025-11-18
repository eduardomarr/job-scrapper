export interface Job {
  title: string;
  location?: string;
  url: string;
  site: string;
}

export interface MatchedJob extends Job {
  matchedKeyword: string;
}

export interface JobSite {
  name: string;
  url: string;
  type: "smartrecruiters" | "custom" | "htmlDOM" | "DynamicPage";
}

export interface SearchConfig {
  caseSensitive: boolean;
  matchWholeWord: boolean;
}

export interface JobsBySite {
  [siteName: string]: MatchedJob[];
}

export interface ApiConfig {
  sites: Array<{ name: string; url: string }>;
  keywords: string[];
  cronSchedule: string;
  emailConfigured: boolean;
}
