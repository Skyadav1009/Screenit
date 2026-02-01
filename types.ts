export interface AtsScore {
  score: number;
  issues: string[];
}

export interface JobMatch {
  matchPercentage: number;
  strongMatches: string[];
  weakMatches: string[];
}

export interface Keywords {
  matched: string[];
  missing: string[];
  overused: string[];
}

export interface SectionFeedback {
  summary: string;
  skills: string;
  experience: string;
  education: string;
  projects: string;
}

export interface SkillGap {
  missingMustHaves: string[];
  missingNiceToHaves: string[];
  learningPriority: string[];
}

export interface BulletPointImprovement {
  original: string;
  improved: string;
}

export interface Verdict {
  suitability: string;
  nextSteps: string[];
  alternativeRoles: string[];
}

export interface FinalFeedback {
  topImprovements: string[];
  confidence: number;
}

export interface AnalysisResult {
  atsScore: AtsScore;
  jobMatch: JobMatch;
  keywords: Keywords;
  sectionFeedback: SectionFeedback;
  skillGap: SkillGap;
  bulletPoints: BulletPointImprovement[];
  verdict: Verdict;
  finalFeedback: FinalFeedback;
}
