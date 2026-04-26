import {useMutation, useQuery, useQueryCache} from "@pinia/colada"
import {
    changeJobApplicationStatus,
    createJobApplication,
    deleteJobApplicationById,
    getAllJobApplications,
    getJobApplicationById,
    updateJobApplication
} from "@/api/services/JobApplicationService"
import {computed} from "vue"
import type {
    ChangeJobApplicationStatusRequest,
    JobApplicationRequest,
    JobApplicationResponse
} from "@/api/interfaces/job.applications.interfaces"

export function useJobApplications(jobApplicationId?: number) {
    const queryCache = useQueryCache()
    const toast = useToast()

    const jobApplicationQuery = useQuery({
        key: () => ['job-application', jobApplicationId ?? 0],
        query: (): Promise<JobApplicationResponse> => getJobApplicationById(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const jobApplicationsQuery = useQuery({
        key: ['job-applications'],
        query: (): Promise<JobApplicationResponse[]> => getAllJobApplications(),
    })

    const deleteJobApplicationMutation = useMutation({
        mutation: (id: number) => deleteJobApplicationById(id),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-applications']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted job application successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const createJobApplicationMutation = useMutation({
        mutation: (payload: JobApplicationRequest) => createJobApplication(payload),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-applications', 'companies']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Created job application successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const updateJobApplicationMutation = useMutation({
        mutation: (payload: JobApplicationRequest) => updateJobApplication(payload),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-applications']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Updated job application successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const updateJobApplicationStatusMutation = useMutation({
        mutation: (changeJobApplicationStatusRequest: ChangeJobApplicationStatusRequest) => changeJobApplicationStatus(changeJobApplicationStatusRequest),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Updated job application status successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    return {
        jobApplications: computed(() => jobApplicationsQuery.data.value ?? []),
        jobApplicationsQuery,

        jobApplication: computed(() => jobApplicationQuery.data.value),
        jobApplicationQuery,

        createJobApplication: createJobApplicationMutation.mutate,
        createJobApplicationMutation,

        updateJobApplication: updateJobApplicationMutation.mutate,
        updateJobApplicationMutation,

        deleteJobApplication: deleteJobApplicationMutation.mutate,
        deleteJobApplicationMutation,

        updateJobApplicationStatus: updateJobApplicationStatusMutation.mutate,
        updateJobApplicationStatusMutation
    }
}