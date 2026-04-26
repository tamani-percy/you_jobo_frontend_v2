import { onUnmounted } from 'vue'

const toastMessages: Record<string, { title: string; description: string; color: 'success' | 'error' }> = {
    JOB_AND_DOCUMENT_ANALYSIS_COMPLETE:      { title: 'Analysis Complete',  description: 'Job & document analysis finished.',       color: 'success' },
    JOB_AND_DOCUMENT_ANALYSIS_ERROR:         { title: 'Analysis Failed',    description: 'Job & document analysis failed.',          color: 'error'   },
    JOB_NOTES_ANALYSIS_COMPLETE:             { title: 'Notes Analysed',     description: 'Notes analysis finished.',                 color: 'success' },
    JOB_NOTES_ANALYSIS_ERROR:                { title: 'Notes Failed',       description: 'Notes analysis failed.',                   color: 'error'   },
    JOB_PRE_INTERVIEW_ANALYSIS_COMPLETE:     { title: 'Ready to Interview', description: 'Pre-interview analysis finished.',         color: 'success' },
    JOB_PRE_INTERVIEW_ANALYSIS_ERROR:        { title: 'Analysis Failed',    description: 'Pre-interview analysis failed.',           color: 'error'   },
    JOB_POST_INTERVIEW_ANALYSIS_COMPLETE:    { title: 'Debrief Ready',      description: 'Post-interview analysis finished.',        color: 'success' },
    JOB_POST_INTERVIEW_ANALYSIS_ERROR:       { title: 'Analysis Failed',    description: 'Post-interview analysis failed.',          color: 'error'   },
    JOB_INTERVIEW_PATTERN_ANALYSIS_COMPLETE: { title: 'Patterns Found',     description: 'Interview pattern analysis finished.',     color: 'success' },
    JOB_INTERVIEW_PATTERN_ANALYSIS_ERROR:    { title: 'Analysis Failed',    description: 'Interview pattern analysis failed.',       color: 'error'   },
}

export const useEventSource = () => {
    const toast = useToast()

    //@ts-ignore
    const source = new EventSource(`${import.meta.env.VITE_APP_YOU_JOBO_BACKEND}ai/events`)

    source.onmessage = (e) => {
        const config = toastMessages[e.data]
        if (config) {
            toast.add({
                title: config.title,
                description: config.description,
                icon: config.color === 'success' ? 'i-lucide-check' : 'i-lucide-x',
                color: config.color
            })
        }
    }

    source.onerror = () => {
        console.error('SSE connection error')
        source.close()
    }

    onUnmounted(() => source.close())

    return { source }
}