export interface ResumeCvJobMatchRequest {
    jobApplicationId: number,
    documentId: number
}

export interface PreInterviewPreparationRequest {
    jobApplicationId: number,
    documentId: number
}


export interface ResumeCvJobMatchResponse {
    id: number,
    matchScore: number,
    strengths: string[],
    gaps: string[],
    suggestedKeywords: string[],
    priorityRecommendation: string,
    summary: string,
    createdAt: string,
    jobApplicationId: number
}

export interface NotesAnalysisResponse {
    id: number,
    summary: string,
    strengths: string[],
    concerns: string[],
    nextSteps: string[],
    patterns: string[],
    createdAt: string,
    jobApplicationId: number
}

export interface InterviewPatternAnalysisResponse {
    id: number,
    overallAssessment: string,
    recurringStrengths: string[],
    recurringWeaknesses: string[],
    recommendedFocusAreas: string[],
    skillGaps: string[],
    behavioralPatterns: string[],
    createdAt: string,
    jobApplicationId: number
}

export interface PostInterviewReflectionResponse {
    id: number,
    confidenceAssessment: string,
    summary: string,
    nextSteps: string[],
    missedOpportunities: string[],
    weaknesses: string[],
    strengths: string[],
    createdAt: string,
    jobApplicationId: number
}

export interface PreInterviewPreparationResponse {
    id: number,
    likelyQuestions: string[],
    technicalTopics: string[],
    preparationTips: string[],
    focusAreas: string[],
    confidenceTips: string[],
    createdAt: string,
    jobApplicationId: number
}