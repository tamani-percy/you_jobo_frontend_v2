export type JobStatus =
    | 'DRAFT'
    | 'APPLIED'
    | 'UNDER_REVIEW'
    | 'SHORTLISTED'
    | 'INTERVIEW_SCHEDULED'
    | 'INTERVIEWED'
    | 'OFFER_RECEIVED'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'WITHDRAWN'


export const statusTypeMap: Record<JobStatus, string> = {
    DRAFT: 'info',
    APPLIED: 'primary',
    UNDER_REVIEW: 'info',
    SHORTLISTED: 'warning',
    INTERVIEW_SCHEDULED: 'warning',
    INTERVIEWED: 'warning',
    OFFER_RECEIVED: 'success',
    ACCEPTED: 'success',
    REJECTED: 'error',
    WITHDRAWN: 'danger',
}

export const JobTypes = {
    FULLTIME: 'FULL TIME',
    PARTTIME: 'PART TIME',
    TEMPORARY: 'TEMPORARY',
    INTERNSHIP: 'INTERNSHIP',
    CONSULTANCY: 'CONSULTANCY',
    CONTRACT: 'CONTRACT',
    FREELANCE: 'FREELANCE',
    SEASONAL: 'SEASONAL'
} as const

export const JobSources = {
    LINKEDIN: 'LINKEDIN',
    COMPANYWEBSITE: 'COMPANY WEBSITE',
    REFERRAL: 'REFERRAL'
} as const

export const JobSourcesB4B = {
    LINKEDIN: 'LINKEDIN',
    COMPANYWEBSITE: 'COMPANYWEBSITE',
    REFERRAL: 'REFERRAL'
} as const

export const JobStatuses = {
    DRAFT: 'DRAFT',
    APPLIED: 'APPLIED',
    UNDER_REVIEW: 'UNDER REVIEW',
    SHORTLISTED: 'SHORTLISTED',
    INTERVIEW_SCHEDULED: 'INTERVIEW SCHEDULED',
    INTERVIEWED: 'INTERVIEWED',
    OFFER_RECEIVED: 'OFFER RECEIVED',
    ACCEPTED: 'ACCEPTED',
    REJECTED: ' REJECTED',
    WITHDRAWN: 'WITHDRAWN'
}


export const JobPriorities = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
}

export const JobWorkModes = {
    HYBRID: 'HYBRID',
    ONSITE: 'ONSITE',
    REMOTE: 'REMOTE'
}


export const getDisplayValue = (
    obj: Record<string, string>,
    key: string
): string => {
    return obj[key as keyof typeof obj] ?? key
}


export const getJobSourceIcon = (source: string): string => {
    switch (source) {
        case JobSourcesB4B.COMPANYWEBSITE:
            return "i-lucide-code"
        case JobSourcesB4B.LINKEDIN:
            return "i-lucide-linkedin"
        case JobSourcesB4B.REFERRAL:
            return "i-lucide-megaphone"
        default:
            return "i-lucide-ban"
    }
}