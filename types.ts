
export interface VideoData {
  title: string;
  description: string;
  tags: string;
  transcript: string;
  youtubeLink: string;
}

export interface ApiKeys {
  gemini: string;
  youtube: string;
}

export interface Score {
  score: number;
  explanation: string;
}

export interface Issue {
  ruleId: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string;
  fix: string;
}

export interface Keyword {
  phrase: string;
  intent: string;
  difficulty: 'low' | 'medium' | 'high';
}

export interface ThumbnailVariant {
  id: string;
  rationale: string;
  imageUrl?: string; // For potential future use where AI generates image variants
}

export interface Recommendations {
  titles: string[];
  description: string;
  hashtags: string[];
  keywords: Keyword[];
  thumbnailVariants: ThumbnailVariant[];
}

export interface AnalysisResult {
  scores: {
    compliance: Score;
    thumbnail: Score;
    title: Score;
    description: Score;
    seoOpportunity: Score;
  };
  issues: Issue[];
  recommendations: Recommendations;
}
