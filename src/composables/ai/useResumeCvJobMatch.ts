// useResumeCvJobMatch.ts
import {useMutation, useQuery, useQueryCache} from "@pinia/colada";
import type {ResumeCvJobMatchRequest, ResumeCvJobMatchResponse} from "@/api/interfaces/ai.interfaces.ts";
import {
    deleteResumeCvJobMatch,
    generateResumeCvJobMatch,
    getAllResumeCvJobMatches,
    getAllResumeCvJobMatchesByJobApplication
} from "@/api/services/AiService.ts";
import {computed} from "vue";

export function useResumeCvJobMatch(jobApplicationId?: number) {
    const queryCache = useQueryCache()
    const toast = useToast()

    const resumeCvJobMatchesQuery = useQuery({
        key: ["resume-cv-job-matches"],
        query: ():Promise<ResumeCvJobMatchResponse[]> => getAllResumeCvJobMatches()
    })

    const jobApplicationResumeCvJobMatchesQuery = useQuery({
        key: () => ['resume-cv-job-matches', jobApplicationId ?? null],
        query: ():Promise<ResumeCvJobMatchResponse[]> => getAllResumeCvJobMatchesByJobApplication(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const createResumeCvJobMatchMutation = useMutation({
        mutation: (payload: ResumeCvJobMatchRequest) => generateResumeCvJobMatch(payload),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['resume-cv-job-matches']})
        }
    })

    const deleteResumeCvJobMatchMutation = useMutation({
        mutation: (id: number) => deleteResumeCvJobMatch(id),
        onSuccess: async ():Promise<void> => {
            await queryCache.invalidateQueries({key: ['resume-cv-job-matches']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted resume/CV job match analysis successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    return {
        resumeCvJobMatchesQuery,
        resumeCvJobMatches: computed(() => resumeCvJobMatchesQuery.data.value ?? []),
        jobApplicationResumeCvJobMatchesQuery,
        jobApplicationResumeCvJobMatches: computed(() => jobApplicationResumeCvJobMatchesQuery.data.value ?? []),
        createResumeCvJobMatch: createResumeCvJobMatchMutation.mutate,
        createResumeCvJobMatchMutation,
        deleteResumeCvJobMatch: deleteResumeCvJobMatchMutation.mutate,
        deleteResumeCvJobMatchMutation,
    }
}