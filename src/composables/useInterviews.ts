import {useMutation, useQuery, useQueryCache} from "@pinia/colada"
import {
    createInterview,
    deleteInterviewById,
    getAllInterviews,
    getInterviewsByJobApplicationId, updateInterview
} from "@/api/services/InterviewService"
import type {InterviewRequest, InterviewResponse} from "@/api/interfaces/interviews.interfaces"
import {computed} from "vue"

export function useInterviews(jobApplicationId?: number) {
    const toast = useToast()
    const queryCache = useQueryCache()

    const interviewsQuery = useQuery({
        key: ['interviews'],
        query: (): Promise<InterviewResponse[]> => getAllInterviews(),
    })

    const jobApplicationInterviewsQuery = useQuery({
        key: () => ['job-application-interviews', jobApplicationId ?? null],
        query: (): Promise<InterviewResponse[]> => getInterviewsByJobApplicationId(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const createJobApplicationInterviewMutation = useMutation({
        mutation: (payload: InterviewRequest) => createInterview(payload),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-interviews']})

            toast.add({
                title: 'Yaaay!!',
                description: 'Created job application interview successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const updateJobApplicationInterviewMutation = useMutation({
        mutation: (payload: InterviewRequest) => updateInterview(payload),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-interviews']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Update job application interview successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })


    const deleteJobApplicationInterviewMutation = useMutation({
        mutation: (id: number) => deleteInterviewById(id),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-interviews']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted job application interview successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    return {
        interviews: computed(() => interviewsQuery.data.value ?? []),
        interviewsQuery,

        jobApplicationInterviews: computed(() => jobApplicationInterviewsQuery.data.value ?? []),
        jobApplicationInterviewsQuery,

        createJobApplicationInterview: createJobApplicationInterviewMutation.mutate,
        createJobApplicationInterviewMutation,

        updateJobApplicationInterview: updateJobApplicationInterviewMutation.mutate,
        updateJobApplicationInterviewMutation,

        deleteJobApplicationInterview: deleteJobApplicationInterviewMutation.mutate,
        deleteJobApplicationInterviewMutation
    }
}