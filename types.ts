
import type { User } from '@supabase/supabase-js';

export type AIProvider = 'gemini' | 'openai';

export interface ApiConfig {
    provider: AIProvider;
    model: string;
    geminiKey: string;
    openAIKey: string;
    youtubeKey: string;
    youtubeTranscriptKey: string;
}

export interface VideoData {
  title: string;
  description: string;
  tags: string;
  transcript: string;
  youtubeLink: string;
}

// Giữ lại interface cũ để tương thích, nhưng ApiConfig mới sẽ được ưu tiên sử dụng
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
  imageUrl?: string;
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


export interface Session {
    id: string;
    user_id?: string;
    created_at: string;
    videoTitle: string;
    videoData: VideoData;
    analysisResult: AnalysisResult;
    thumbnailPreview: string | null;
}