
import { GoogleGenAI, Type } from '@google/genai';
import type { VideoData, AnalysisResult, ApiConfig } from '../types';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      properties: {
        compliance: { 
            type: Type.OBJECT, 
            properties: { 
                score: {type: Type.NUMBER}, 
                explanation: {type: Type.STRING} 
            }
        },
        thumbnail: { 
            type: Type.OBJECT, 
            properties: { 
                score: {type: Type.NUMBER}, 
                explanation: {type: Type.STRING} 
            }
        },
        title: { 
            type: Type.OBJECT, 
            properties: { 
                score: {type: Type.NUMBER}, 
                explanation: {type: Type.STRING} 
            }
        },
        description: { 
            type: Type.OBJECT, 
            properties: { 
                score: {type: Type.NUMBER}, 
                explanation: {type: Type.STRING} 
            }
        },
        seoOpportunity: { 
            type: Type.OBJECT, 
            properties: { 
                score: {type: Type.NUMBER}, 
                explanation: {type: Type.STRING} 
            }
        },
      },
    },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          ruleId: { type: Type.STRING },
          severity: { type: Type.STRING },
          evidence: { type: Type.STRING },
          fix: { type: Type.STRING },
        },
      },
    },
    recommendations: {
      type: Type.OBJECT,
      properties: {
        titles: { type: Type.ARRAY, items: { type: Type.STRING } },
        description: { type: Type.STRING },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        keywords: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phrase: { type: Type.STRING },
              intent: { type: Type.STRING },
              difficulty: { type: Type.STRING },
            },
          },
        },
        thumbnailVariants: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              rationale: { type: Type.STRING },
            },
          },
        },
      },
    },
  },
};

export const analyzeVideoContent = async (videoData: VideoData, thumbnailBase64: string | null, config: ApiConfig): Promise<AnalysisResult> => {
  if (config.provider === 'openai') {
      throw new Error("OpenAI provider is not yet implemented.");
  }

  if (!config.geminiKey) {
    throw new Error("Gemini API Key is not provided. Please add it in the configuration section.");
  }
  
  const ai = new GoogleGenAI({ apiKey: config.geminiKey });

  const prompt = `
    Act as an expert YouTube growth consultant and policy specialist. Your name is ClearCue.
    Analyze the following YouTube video content and provide a comprehensive report in JSON format.
    The user is from Vietnam, so all explanations, rationales, and fixes should be in Vietnamese.
    
    VIDEO DATA:
    - Title: ${videoData.title}
    - Description: ${videoData.description}
    - Tags: ${videoData.tags}
    - Transcript Snippet: ${videoData.transcript}

    THUMBNAIL:
    ${thumbnailBase64 ? "[An image is provided]" : "[No image provided]"}

    ANALYSIS REQUIREMENTS:

    1.  **Scoring (0-100):** Provide a score and a brief Vietnamese explanation for each category:
        -   \`compliance\`: How well it adheres to YouTube Community Guidelines and advertiser-friendly policies.
        -   \`thumbnail\`: CTR potential, clarity, legibility on mobile, and visual appeal.
        -   \`title\`: Clickability, clarity, and optimal length (~55-70 characters).
        -   \`description\`: SEO optimization, clarity, structure (chapters, CTAs), and use of hashtags.
        -   \`seoOpportunity\`: Potential to rank based on keywords, tags, and intent.

    2.  **Issues:** Identify specific violations or risks. For each issue:
        -   \`ruleId\`: A short identifier (e.g., 'ads-sensitive-violence').
        -   \`severity\`: 'low', 'medium', or 'high'.
        -   \`evidence\`: The exact text or element causing the issue.
        -   \`fix\`: A suggested Vietnamese replacement or solution.

    3.  **Recommendations:** Provide actionable suggestions to improve the video's performance.
        -   \`titles\`: Suggest 3 alternative, high-CTR titles.
        -   \`description\`: Rewrite the description to be more SEO-friendly, including a hook, timestamps (chapters), and a clear call-to-action.
        -   \`hashtags\`: Suggest up to 5 relevant, high-traffic hashtags.
        -   \`keywords\`: Suggest 3-5 keywords (seed and long-tail), identifying their search intent and difficulty.
        -   \`thumbnailVariants\`: Provide 2 rationales for A/B testing the thumbnail (e.g., 'Increase text contrast', 'Focus on a human face').

    Your entire output must be a single, valid JSON object that conforms to the provided schema.
  `;
  
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [];

  parts.push({ text: prompt });

  if (thumbnailBase64) {
    parts.unshift({ // Add image first for better performance in some models
        inlineData: {
          mimeType: 'image/jpeg',
          data: thumbnailBase64,
        },
      });
  }

  const response = await ai.models.generateContent({
    model: config.model,
    contents: { parts: parts },
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
    }
  });

  const jsonString = response.text.trim();

  try {
    const result: AnalysisResult = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error("Failed to parse Gemini response:", jsonString, error);
    throw new Error("Received invalid JSON format from the analysis service.");
  }
};
