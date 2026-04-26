import type {
    InterviewPatternAnalysisResponse,
    NotesAnalysisResponse,
    PostInterviewReflectionResponse,
    PreInterviewPreparationRequest,
    PreInterviewPreparationResponse,
    ResumeCvJobMatchRequest,
    ResumeCvJobMatchResponse
} from "@/api/interfaces/ai.interfaces.ts";
import type {AxiosResponse} from "axios";
import axiosInstance from "@/api/axiosInstance/axiosInstance.ts";

// RESUME/CV & JOB MATCH
export const generateResumeCvJobMatch = async (resumeCvJobMatchRequest: ResumeCvJobMatchRequest): Promise<ResumeCvJobMatchResponse> => {
    const response: AxiosResponse<ResumeCvJobMatchResponse> = await axiosInstance.post("ai/job-and-document-analysis", resumeCvJobMatchRequest)
    return response.data
}

export const getAllResumeCvJobMatches = async (): Promise<ResumeCvJobMatchResponse[]> => {
    const response: AxiosResponse<ResumeCvJobMatchResponse[]> = await axiosInstance.get("ai/job-and-document-analysis/all")
    return response.data
}

export const getAllResumeCvJobMatchesByJobApplication = async (jobApplicationId: number): Promise<ResumeCvJobMatchResponse[]> => {
    const response: AxiosResponse<ResumeCvJobMatchResponse[]> = await axiosInstance.get(`ai/job-and-document-analysis?jobApplicationId=${jobApplicationId}`)
    return response.data
}

export const deleteResumeCvJobMatch = async (documentId: number): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await axiosInstance.delete(`ai/job-and-document-analysis?documentId=${documentId}`)
    return response.data
}


// NOTES ANALYSIS
export const generateNotesAnalysis = async (jobApplicationId: number): Promise<NotesAnalysisResponse> => {
    const response: AxiosResponse<NotesAnalysisResponse> = await axiosInstance.post(`ai/job-notes-analysis?jobApplicationId=${jobApplicationId}`)
    return response.data
}

export const getAllNotesAnalysis = async (): Promise<NotesAnalysisResponse[]> => {
    const response: AxiosResponse<NotesAnalysisResponse[]> = await axiosInstance.get(`ai/job-notes-analysis/all`)
    return response.data
}

export const getAllNotesAnalysisByJobApplication = async (jobApplicationId: number): Promise<NotesAnalysisResponse> => {
    const response: AxiosResponse<NotesAnalysisResponse> = await axiosInstance.get(`ai/job-notes-analysis/job-application?jobApplicationId=${jobApplicationId}`)
    return response.data
}

export const deleteNotesAnalysis = async (jobNotesAnalysisId: number): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await axiosInstance.delete(`ai/job-notes-analysis?jobNotesAnalysisId=${jobNotesAnalysisId}`)
    return response.data
}

// INTERVIEWS
export const generatePreInterviewPreparation = async (preInterviewPreparationRequest: PreInterviewPreparationRequest): Promise<PreInterviewPreparationResponse> => {
    const response: AxiosResponse<PreInterviewPreparationResponse> = await axiosInstance.post(`ai/job-pre-interview-analysis`, preInterviewPreparationRequest)
    return response.data
}

export const generatePostInterviewReflection = async (jobApplicationId: number): Promise<PostInterviewReflectionResponse> => {
    const response: AxiosResponse<PostInterviewReflectionResponse> = await axiosInstance.post(`ai/job-post-interview-analysis?jobApplicationId=${jobApplicationId}`)
    return response.data
}

export const generateInterviewPatternAnalysis = async (jobApplicationId: number): Promise<InterviewPatternAnalysisResponse> => {
    const response: AxiosResponse<InterviewPatternAnalysisResponse> = await axiosInstance.post(`ai/job-interview-pattern-analysis?jobApplicationId=${jobApplicationId}`)
    return response.data
}

export const getAllPreInterviewPreparations = async (): Promise<PreInterviewPreparationResponse[]> => {
    const response: AxiosResponse<PreInterviewPreparationResponse[]> = await axiosInstance.get(`ai/job-pre-interview-analysis/all`)
    return response.data
}

export const getAllPostInterviewReflections = async (): Promise<PostInterviewReflectionResponse[]> => {
    const response: AxiosResponse<PostInterviewReflectionResponse[]> = await axiosInstance.get(`ai/job-post-interview-analysis/all`)
    return response.data
}

export const getAllInterviewPatternAnalyses = async (): Promise<InterviewPatternAnalysisResponse[]> => {
    const response: AxiosResponse<InterviewPatternAnalysisResponse[]> = await axiosInstance.get(`ai/job-interview-pattern-analysis/all`)
    return response.data
}

export const getAllPreInterviewPreparationsByJobApplication = async (jobApplicationId: number): Promise<PreInterviewPreparationResponse> => {
    const response: AxiosResponse<PreInterviewPreparationResponse> = await axiosInstance.get(`ai/job-pre-interview-analysis/job-application?jobApplicationId=${jobApplicationId}`)
    return response.data
}

export const getAllPostInterviewReflectionsByJobApplication = async (jobApplicationId: number): Promise<PostInterviewReflectionResponse> => {
    const response: AxiosResponse<PostInterviewReflectionResponse> = await axiosInstance.get(`ai/job-post-interview-analysis/job-application?jobApplicationId=${jobApplicationId}`)
    return response.data
}

export const getAllInterviewPatternAnalysesByJobApplication = async (jobApplicationId: number): Promise<InterviewPatternAnalysisResponse> => {
    const response: AxiosResponse<InterviewPatternAnalysisResponse> = await axiosInstance.get(`ai/job-interview-pattern-analysis/job-application?jobApplicationId=${jobApplicationId}`)
    return response.data
}

export const deletePreInterviewPreparation = async (preInterviewPreparationId: number): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await axiosInstance.delete(`ai/job-pre-interview-analysis/${preInterviewPreparationId}`)
    return response.data
}

export const deletePostInterviewReflection = async (postInterviewReflectionId: number): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await axiosInstance.delete(`ai/job-post-interview-analysis/${postInterviewReflectionId}`)
    return response.data
}

export const deleteInterviewPatternAnalysis = async (interviewPatternAnalysisId: number): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await axiosInstance.delete(`ai/job-interview-pattern-analysis/${interviewPatternAnalysisId}`)
    return response.data
}