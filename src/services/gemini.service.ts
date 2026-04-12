import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * PROMPT ENGINEERING DOCUMENTATION
 * ================================
 * 
 * Purpose: Multi-candidate job matching with weighted scoring
 * 
 * Prompt Strategy:
 * 1. Role assignment - AI acts as experienced technical recruiter
 * 2. Structured input - Clear job vs candidates separation
 * 3. Explicit weights - Skills (40%), Experience (35%), Education (25%)
 * 4. Output schema - Strict JSON with all required fields
 * 5. Reasoning requirement - Natural language explanation per candidate
 * 
 * Few-shot technique: Output format example embedded in prompt
 * Chain-of-thought: AI evaluates each dimension separately before scoring
 */

export interface JobData {
  title: string;
  description: string;
  requirements: string[];
  weights?: {
    skills: number;
    experience: number;
    education: number;
  };
}

export interface CandidateData {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  bio?: string;
  skills: Array<{
    name: string;
    level: string;
    yearsOfExperience: number;
  }>;
  experience: Array<{
    company: string;
    role: string;
    description: string;
    technologies: string[];
    startDate: Date;
    endDate?: Date;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export interface CandidateScore {
  candidateId: string;
  rank: number;
  matchScore: number;
  confidence: "high" | "medium" | "low";
  strengths: string[];
  gaps: string[];
  reasoning: string;
  finalRecommendation: string;
}

export interface ScreeningResult {
  candidates: CandidateScore[];
  comparisonSummary: string;
}

const DEFAULT_WEIGHTS = {
  skills: 0.40,
  experience: 0.35,
  education: 0.25,
};

export async function evaluateCandidates(
  job: JobData,
  candidates: CandidateData[]
): Promise<ScreeningResult> {
  const weights = job.weights || DEFAULT_WEIGHTS;

  const prompt = buildPrompt(job, candidates, weights);

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from Gemini API");
  }

  try {
    const parsed: ScreeningResult = JSON.parse(text);
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse Gemini response: ${error}`);
  }
}

function buildPrompt(
  job: JobData,
  candidates: CandidateData[],
  weights: { skills: number; experience: number; education: number }
): string {
  const weightsPercent = {
    skills: Math.round(weights.skills * 100),
    experience: Math.round(weights.experience * 100),
    education: Math.round(weights.education * 100),
  };

  return `You are an expert technical recruiter with 10+ years experience. Evaluate candidates against job requirements.

## JOB DETAILS
Title: ${job.title}
Description: ${job.description}
Requirements:
${job.requirements.map((r) => `- ${r}`).join("\n")}

## SCORING WEIGHTS
- Skills match: ${weightsPercent.skills}%
- Experience relevance: ${weightsPercent.experience}%
- Education fit: ${weightsPercent.education}%

## CANDIDATES TO EVALUATE
${candidates.map((c, i) => `
### Candidate ${i + 1}: ${c.firstName} ${c.lastName} (ID: ${c.id})
Headline: ${c.headline}
Bio: ${c.bio || "N/A"}
Skills: ${c.skills.map((s) => `${s.name} (${s.level}, ${s.yearsOfExperience} yrs)`).join(", ")}
Experience:
${c.experience.map((e) => `- ${e.role} at ${e.company}: ${e.description} [Tech: ${e.technologies.join(", ")}]`).join("\n")}
Education: ${c.education.map((e) => `${e.degree} in ${e.fieldOfStudy} from ${e.institution}`).join(", ")}
Certifications: ${c.certifications?.map((c) => c.name).join(", ") || "None"}
Projects: ${c.projects?.map((p) => `${p.name} (${p.technologies.join(", ")})`).join(", ") || "None"}
`).join("\n---\n")}

## TASK
Evaluate all candidates. Return STRICT JSON:

{
  "candidates": [
    {
      "candidateId": "string",
      "rank": 1,
      "matchScore": 87,
      "confidence": "high",
      "strengths": ["string"],
      "gaps": ["string"],
      "reasoning": "Detailed explanation of fit...",
      "finalRecommendation": "Strong hire | Consider | Weak fit | Reject"
    }
  ],
  "comparisonSummary": "Brief comparison of top candidates and why rankings differ"
}

RULES:
- matchScore: 0-100 integer
- confidence: high (score 80+), medium (60-79), low (<60)
- Rank 1 = best candidate
- Strengths: specific skill/experience matches
- Gaps: missing requirements or weaknesses
- Reasoning: 2-3 sentences explaining score
- FinalRecommendation: actionable hiring verdict`;
}
