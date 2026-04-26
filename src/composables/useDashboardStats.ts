import type {Ref} from "vue";
import {computed, ref} from "vue";
import type {
    JobApplicationFocusResponse,
    JobApplicationResponse
} from "@/api/interfaces/job.applications.interfaces.ts";
import {useQuery} from "@pinia/colada";
import {
    countJobApplications,
    countJobApplicationsByJobStatusActive,
    countJobApplicationsByJobStatusOffers,
    getDailyFocus,
    getJobApplicationsInterviewRate,
    getJobApplicationsJobStatusCount,
    getJobApplicationsOfferRate,
    getJobApplicationsSuccessRate,
    getOldestJobApplications
} from "@/api/services/JobApplicationService.ts";
import {countAllInterviews} from "@/api/services/InterviewService.ts";

const formatLabel = (key: string) => {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

export function useDashboardStats() {
    const jobApplicationCount: Ref<number> = ref(0)
    const interviewsCount: Ref<number> = ref(0)
    const jobApplicationsCountByJobStatusActive: Ref<number> = ref(0)
    const jobApplicationsCountByJobStatusOffers: Ref<number> = ref(0)
    const jobApplicationsInterviewRate: Ref<number> = ref(0)
    const jobApplicationsOfferRate: Ref<number> = ref(0)
    const jobApplicationsSuccessRate: Ref<number> = ref(0)
    const jobApplicationsResponseRate: Ref<number> = ref(0)
    const jobApplicationJobStatusCount: Ref<Record<string, number>> = ref({});
    const isDashboardStatsLoading: Ref<boolean> = ref(false)

    const OldestJobApplicationsQuery = useQuery({
        key: ['oldest-applications'],
        query: ():Promise<JobApplicationResponse> => getOldestJobApplications()
    })

    const dailyFocusQuery = useQuery({
        key: ['daily-focus'],
        query: ():Promise<JobApplicationFocusResponse[]> => getDailyFocus()
    })

    const onFetchJobApplicationCount = async (): Promise<void> => {
        try {
            jobApplicationCount.value = await countJobApplications()
        } catch (err: any) {
            const backendError = err.response?.data;
            throw {
                statusCode: backendError?.statusCode || backendError?.status || 500,
                message: backendError?.message || backendError || "An unexpected error occurred",
                error: true
            };
        }
    }

    const onFetchInterviewsCount = async (): Promise<void> => {
        try {
            interviewsCount.value = await countAllInterviews()
        } catch (err: any) {
            const backendError = err.response?.data;
            throw {
                statusCode: backendError?.statusCode || backendError?.status || 500,
                message: backendError?.message || backendError || "An unexpected error occurred",
                error: true
            };
        }
    }

    const onFetchJobApplicationsCountByJobStatusActive = async (): Promise<void> => {
        try {
            jobApplicationsCountByJobStatusActive.value =
                await countJobApplicationsByJobStatusActive()
        } catch (err: any) {
            const backendError = err.response?.data;
            throw {
                statusCode: backendError?.statusCode || backendError?.status || 500,
                message: backendError?.message || backendError || "An unexpected error occurred",
                error: true
            };
        }
    }

    const onFetchJobApplicationsCountByJobStatusOffers = async (): Promise<void> => {
        try {
            jobApplicationsCountByJobStatusOffers.value =
                await countJobApplicationsByJobStatusOffers()
        } catch (err: any) {
            const backendError = err.response?.data;
            throw {
                statusCode: backendError?.statusCode || backendError?.status || 500,
                message: backendError?.message || backendError || "An unexpected error occurred",
                error: true
            };
        }
    }

    const onFetchJobApplicationsInterviewRate = async (): Promise<void> => {
        try {
            jobApplicationsInterviewRate.value = await getJobApplicationsInterviewRate()
        } catch (err: any) {
            const backendError = err.response?.data;
            throw {
                statusCode: backendError?.statusCode || backendError?.status || 500,
                message: backendError?.message || backendError || "An unexpected error occurred",
                error: true
            };
        }
    }

    const onFetchJobApplicationsOfferRate = async (): Promise<void> => {
        try {
            jobApplicationsOfferRate.value = await getJobApplicationsOfferRate()
        } catch (err: any) {
            const backendError = err.response?.data;
            throw {
                statusCode: backendError?.statusCode || backendError?.status || 500,
                message: backendError?.message || backendError || "An unexpected error occurred",
                error: true
            };
        }
    }

    const onFetchJobApplicationsSuccessRate = async (): Promise<void> => {
        try {
            jobApplicationsSuccessRate.value = await getJobApplicationsSuccessRate()
        } catch (err: any) {
            const backendError = err.response?.data;
            throw {
                statusCode: backendError?.statusCode || backendError?.status || 500,
                message: backendError?.message || backendError || "An unexpected error occurred",
                error: true
            };
        }
    }


    const onFetchJobApplicationJobStatusCount = async () => {
        try {
            const res = await getJobApplicationsJobStatusCount();
            const formatted: Record<string, number> = {};

            Object.entries(res).forEach(([key, value]) => {
                formatted[formatLabel(key)] = Number(value);
            });
            jobApplicationJobStatusCount.value = formatted;
        } catch (err: any) {
            const backendError = err.response?.data;
            throw {
                statusCode: backendError?.statusCode || backendError?.status || 500,
                message: backendError?.message || backendError || "An unexpected error occurred",
                error: true
            };
        }
    };

    const onFetchDashboardStats = async (): Promise<void> => {
        try {
            isDashboardStatsLoading.value = true

            await Promise.all([
                onFetchJobApplicationCount(),
                onFetchInterviewsCount(),
                onFetchJobApplicationsCountByJobStatusActive(),
                onFetchJobApplicationsCountByJobStatusOffers(),
                onFetchJobApplicationsInterviewRate(),
                onFetchJobApplicationsOfferRate(),
                onFetchJobApplicationsSuccessRate(),
                onFetchJobApplicationJobStatusCount(),
            ])

        } finally {
            isDashboardStatsLoading.value = false
        }
    }


    return {
        oldestJobApplications: computed(() => OldestJobApplicationsQuery.data.value ?? []),
        jobApplicationCount,
        interviewsCount,
        jobApplicationsCountByJobStatusActive,
        jobApplicationsCountByJobStatusOffers,
        jobApplicationsInterviewRate,
        jobApplicationsOfferRate,
        jobApplicationsSuccessRate,
        jobApplicationsResponseRate,
        jobApplicationJobStatusCount,
        isDashboardStatsLoading,
        onFetchDashboardStats,


        dailyFocus: computed(() => dailyFocusQuery.data.value ?? []),
        dailyFocusQuery
    }
}