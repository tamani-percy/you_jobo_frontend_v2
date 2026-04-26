<script setup lang="ts">
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";

const props = defineProps<{
  jobApplicationId: number
}>()

const {
  jobApplicationInterviewPatternAnalysisQuery,
  jobApplicationInterviewPatternAnalysis,
  deleteInterviewPatternAnalysis,
  deleteInterviewPatternAnalysisMutation
} = useInterviewInsights(props.jobApplicationId)

</script>

<template>
  <UProgress v-if="jobApplicationInterviewPatternAnalysisQuery.isLoading.value"/>
  <UCard v-else variant="outline" class="me-2">
    <div v-if="jobApplicationInterviewPatternAnalysis">
      <div class="justify-start flex">
        <UTooltip text="Delete this analysis?" :delay-duration="0">
          <UButton color="error" icon="i-lucide-trash" size="xl"
                   @click="deleteInterviewPatternAnalysis(jobApplicationInterviewPatternAnalysis.id)"
                   :loading="deleteInterviewPatternAnalysisMutation.isLoading.value"/>
        </UTooltip>
      </div>
      <USeparator class="my-5" color="neutral" label="SUMMARY" icon="i-lucide-text-initial"/>
      <p>{{ jobApplicationInterviewPatternAnalysis.overallAssessment }}</p>
      <div class="mt-10">
        <UBadge trailing-icon="i-lucide-bicep-flexed" size="xl">
          <HyperText
              text="RECURRING STRENGTHS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(likelyQuestion, index) in jobApplicationInterviewPatternAnalysis.recurringStrengths" :key="index">
            {{ likelyQuestion }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="warning" trailing-icon="i-lucide-shield-alert" size="xl">
          <HyperText
              text="RECURRING WEAKNESSES"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(recurringWeakness, index) in jobApplicationInterviewPatternAnalysis.recurringWeaknesses"
              :key="index">
            {{ recurringWeakness }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="info" trailing-icon="i-lucide-brain" size="xl">
          <HyperText
              text="RECOMMENDED FOCUS AREAS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(recommendedFocusArea, index) in jobApplicationInterviewPatternAnalysis.recommendedFocusAreas"
              :key="index">
            {{ recommendedFocusArea }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="secondary" trailing-icon="i-lucide-brush-cleaning" size="xl">
          <HyperText
              text="SKILL GAPS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(skillGap, index) in jobApplicationInterviewPatternAnalysis.skillGaps" :key="index">{{
              skillGap
            }}
          </li>
        </ul>
      </div>
      <div class="mt-10">
        <UBadge color="secondary" trailing-icon="i-lucide-fingerprint" size="xl">
          <HyperText
              text="BEHAVIORAL PATTERNS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(behavioralPattern, index) in jobApplicationInterviewPatternAnalysis.behavioralPatterns"
              :key="index">
            {{ behavioralPattern }}
          </li>
        </ul>
      </div>
    </div>
    <UEmpty
        v-if="!jobApplicationInterviewPatternAnalysis"
        icon="i-lucide-file-text"
        title="No interview pattern found"
        description="It looks like you haven't generated an interview pattern for this job application. Generate one by picking a document."
    />
  </UCard>
</template>

<style scoped>

</style>