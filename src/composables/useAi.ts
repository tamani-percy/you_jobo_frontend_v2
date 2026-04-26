// useAi.ts
import {useResumeCvJobMatch} from "@/composables/ai/useResumeCvJobMatch.ts";
import {useNotesAnalysis} from "@/composables/ai/useNotesAnalysis.ts";
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";

export function useAi(jobApplicationId?: number) {
    return {
        ...useResumeCvJobMatch(jobApplicationId),
        ...useNotesAnalysis(jobApplicationId),
        ...useInterviewInsights(jobApplicationId),
    }
}