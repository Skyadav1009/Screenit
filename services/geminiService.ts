import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Score from 0 to 100" },
        issues: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["score", "issues"]
    },
    jobMatch: {
      type: Type.OBJECT,
      properties: {
        matchPercentage: { type: Type.NUMBER, description: "Percentage from 0 to 100" },
        strongMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
        weakMatches: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["matchPercentage", "strongMatches", "weakMatches"]
    },
    keywords: {
      type: Type.OBJECT,
      properties: {
        matched: { type: Type.ARRAY, items: { type: Type.STRING } },
        missing: { type: Type.ARRAY, items: { type: Type.STRING } },
        overused: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["matched", "missing", "overused"]
    },
    sectionFeedback: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        skills: { type: Type.STRING },
        experience: { type: Type.STRING },
        education: { type: Type.STRING },
        projects: { type: Type.STRING }
      },
      required: ["summary", "skills", "experience", "education", "projects"]
    },
    skillGap: {
      type: Type.OBJECT,
      properties: {
        missingMustHaves: { type: Type.ARRAY, items: { type: Type.STRING } },
        missingNiceToHaves: { type: Type.ARRAY, items: { type: Type.STRING } },
        learningPriority: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["missingMustHaves", "missingNiceToHaves", "learningPriority"]
    },
    bulletPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          improved: { type: Type.STRING }
        },
        required: ["original", "improved"]
      }
    },
    verdict: {
      type: Type.OBJECT,
      properties: {
        suitability: { type: Type.STRING, description: "e.g., High, Medium, Low" },
        nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        alternativeRoles: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["suitability", "nextSteps", "alternativeRoles"]
    },
    finalFeedback: {
      type: Type.OBJECT,
      properties: {
        topImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
        confidence: { type: Type.NUMBER, description: "Confidence score 0-100" }
      },
      required: ["topImprovements", "confidence"]
    }
  },
  required: ["atsScore", "jobMatch", "keywords", "sectionFeedback", "skillGap", "bulletPoints", "verdict", "finalFeedback"]
};

export const analyzeResume = async (
  resumeText: string, 
  resumeFile: { mimeType: string; data: string } | null, 
  jobDescription: string
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts = [];

  let promptText = `
    You are an expert AI Resume Screener and Career Coach.
    Analyze the uploaded resume (or text) against the provided job description.
  `;

  // If a file (PDF) is provided, append it as inline data
  if (resumeFile) {
    parts.push({
      inlineData: {
        mimeType: resumeFile.mimeType,
        data: resumeFile.data
      }
    });
    promptText += `\nThe resume is provided as a file attachment above.\n`;
  } else {
    // Otherwise use the text (which could be pasted text or extracted DOCX text)
    promptText += `\nRESUME TEXT:\n${resumeText}\n`;
  }

  promptText += `\nJOB DESCRIPTION:\n${jobDescription}\n`;
  promptText += `\nProvide a detailed analysis in strictly JSON format based on the schema provided.\nBe critical yet constructive. Focus on ATS compatibility, keyword matching, and specific improvements.`;
  
  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
