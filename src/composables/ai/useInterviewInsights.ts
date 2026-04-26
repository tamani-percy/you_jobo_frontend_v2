// useInterviewInsights.ts
import {useMutation, useQuery, useQueryCache} from "@pinia/colada";
import type {
    InterviewPatternAnalysisResponse,
    PostInterviewReflectionResponse,
    PreInterviewPreparationRequest,
    PreInterviewPreparationResponse,
} from "@/api/interfaces/ai.interfaces.ts";
import {
    deleteInterviewPatternAnalysis,
    deletePostInterviewReflection,
    deletePreInterviewPreparation,
    generateInterviewPatternAnalysis,
    generatePostInterviewReflection,
    generatePreInterviewPreparation,
    getAllInterviewPatternAnalyses,
    getAllInterviewPatternAnalysesByJobApplication,
    getAllPostInterviewReflections,
    getAllPostInterviewReflectionsByJobApplication,
    getAllPreInterviewPreparations,
    getAllPreInterviewPreparationsByJobApplication,
} from "@/api/services/AiService.ts";
import {computed} from "vue";

export function useInterviewInsights(jobApplicationId?: number) {
    const queryCache = useQueryCache()
    const toast = useToast()

    const preInterviewPreparationsQuery = useQuery({
        key: ["pre-interview-preparations"],
        query: ():Promise<PreInterviewPreparationResponse[]> => getAllPreInterviewPreparations()
    })

    const postInterviewReflectionsQuery = useQuery({
        key: ["post-interview-reflections"],
        query: ():Promise<PostInterviewReflectionResponse[]> => getAllPostInterviewReflections()
    })

    const interviewPatternAnalysesQuery = useQuery({
        key: ["interview-pattern-analyses"],
        query: ():Promise<InterviewPatternAnalysisResponse[]> => getAllInterviewPatternAnalyses()
    })

    const jobApplicationPreInterviewPreparationQuery = useQuery({
        key: () => ['pre-interview-preparations', jobApplicationId ?? null],
        query: ():Promise<PreInterviewPreparationResponse> => getAllPreInterviewPreparationsByJobApplication(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const jobApplicationPostInterviewReflectionQuery = useQuery({
        key: () => ['post-interview-reflections', jobApplicationId ?? null],
        query: ():Promise<PostInterviewReflectionResponse> => getAllPostInterviewReflectionsByJobApplication(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const jobApplicationInterviewPatternAnalysisQuery = useQuery({
        key: () => ['interview-pattern-analyses', jobApplicationId ?? null],
        query: ():Promise<InterviewPatternAnalysisResponse> => getAllInterviewPatternAnalysesByJobApplication(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const createPreInterviewPreparationMutation = useMutation({
        mutation: (preInterviewPreparationRequest: PreInterviewPreparationRequest) => generatePreInterviewPreparation(preInterviewPreparationRequest),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['pre-interview-preparations']})
        }
    })

    const createPostInterviewReflectionMutation = useMutation({
        mutation: (jobApplicationId: number) => generatePostInterviewReflection(jobApplicationId),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['post-interview-reflections']})
        }
    })

    const createInterviewPatternAnalysisMutation = useMutation({
        mutation: (jobApplicationId: number) => generateInterviewPatternAnalysis(jobApplicationId),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['interview-pattern-analyses']})
        }
    })

    const deletePreInterviewPreparationMutation = useMutation({
        mutation: (id: number) => deletePreInterviewPreparation(id),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['pre-interview-preparations']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted Pre-Interview Preparation successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const deletePostInterviewReflectionMutation = useMutation({
        mutation: (id: number) => deletePostInterviewReflection(id),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['post-interview-reflections']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted Post-Interview Reflection successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const deleteInterviewPatternAnalysisMutation = useMutation({
        mutation: (id: number) => deleteInterviewPatternAnalysis(id),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['interview-pattern-analyses']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted Interview Pattern Analyses successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    return {
        preInterviewPreparationsQuery,
        postInterviewReflectionsQuery,
        interviewPatternAnalysesQuery,
        preInterviewPreparations: computed(() => preInterviewPreparationsQuery.data.value ?? []),
        postInterviewReflections: computed(() => postInterviewReflectionsQuery.data.value ?? []),
        interviewPatternAnalyses: computed(() => interviewPatternAnalysesQuery.data.value ?? []),

        jobApplicationPreInterviewPreparationQuery,
        jobApplicationPostInterviewReflectionQuery,
        jobApplicationInterviewPatternAnalysisQuery,
        jobApplicationPreInterviewPreparation: computed(() => jobApplicationPreInterviewPreparationQuery.data.value ?? null),
        jobApplicationPostInterviewReflection: computed(() => jobApplicationPostInterviewReflectionQuery.data.value ?? null),
        jobApplicationInterviewPatternAnalysis: computed(() => jobApplicationInterviewPatternAnalysisQuery.data.value ?? null),

        createPreInterviewPreparation: createPreInterviewPreparationMutation.mutate,
        createPostInterviewReflection: createPostInterviewReflectionMutation.mutate,
        createInterviewPatternAnalysis: createInterviewPatternAnalysisMutation.mutate,
        createPreInterviewPreparationMutation,
        createPostInterviewReflectionMutation,
        createInterviewPatternAnalysisMutation,
        deletePreInterviewPreparation: deletePreInterviewPreparationMutation.mutate,
        deletePostInterviewReflection: deletePostInterviewReflectionMutation.mutate,
        deleteInterviewPatternAnalysis: deleteInterviewPatternAnalysisMutation.mutate,
        deletePreInterviewPreparationMutation,
        deletePostInterviewReflectionMutation,
        deleteInterviewPatternAnalysisMutation,
    }
}