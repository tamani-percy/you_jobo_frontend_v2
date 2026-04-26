// useNotesAnalysis.ts
import {useMutation, useQuery, useQueryCache} from "@pinia/colada";
import type {NotesAnalysisResponse} from "@/api/interfaces/ai.interfaces.ts";
import {
    deleteNotesAnalysis,
    generateNotesAnalysis,
    getAllNotesAnalysis,
    getAllNotesAnalysisByJobApplication
} from "@/api/services/AiService.ts";
import {computed} from "vue";

export function useNotesAnalysis(jobApplicationId?: number) {
    const queryCache = useQueryCache()
    const toast = useToast()

    const notesAnalysisQuery = useQuery({
        key: ['notes-analyses'],
        query: ():Promise<NotesAnalysisResponse[]> => getAllNotesAnalysis()
    })

    const jobApplicationNotesAnalysisQuery = useQuery({
        key: () => ['notes-analyses', jobApplicationId ?? null],
        query: ():Promise<NotesAnalysisResponse> => getAllNotesAnalysisByJobApplication(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const createNotesAnalysisMutation = useMutation({
        mutation: (jobApplicationId: number) => generateNotesAnalysis(jobApplicationId),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['notes-analyses']})
        }
    })

    const deleteNotesAnalysisMutation = useMutation({
        mutation: (id: number) => deleteNotesAnalysis(id),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['notes-analyses']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted notes analysis successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    return {
        notesAnalysisQuery,
        notesAnalyses: computed(() => notesAnalysisQuery.data.value ?? []),
        jobApplicationNotesAnalysisQuery,
        jobApplicationNotesAnalysis: computed(() => jobApplicationNotesAnalysisQuery.data.value ?? null),
        createNotesAnalysis: createNotesAnalysisMutation.mutate,
        createNotesAnalysisMutation,
        deleteNotesAnalysis: deleteNotesAnalysisMutation.mutate,
        deleteNotesAnalysisMutation,
    }
}