<script setup lang="ts">
import type {ResumeCvJobMatchResponse} from "@/api/interfaces/ai.interfaces.ts";
import {useResumeCvJobMatch} from "@/composables/ai/useResumeCvJobMatch.ts";

const props = defineProps<{
  jobApplicationResumeCvJobMatches: ResumeCvJobMatchResponse[],
  jobApplicationId: number
}>()

const {
  deleteResumeCvJobMatchMutation,
  deleteResumeCvJobMatch
} = useResumeCvJobMatch(props.jobApplicationId)
</script>

<template>
  <UCard v-if="jobApplicationResumeCvJobMatches" variant="outline" v-for="resumeCvJobMatch in jobApplicationResumeCvJobMatches"
         :key="resumeCvJobMatch.id" class="me-2">
    <div class="justify-between flex">
      <UTooltip text="Delete this analysis?" :delay-duration="0">
        <UButton color="error" icon="i-lucide-trash" size="xl"
                 @click="deleteResumeCvJobMatch(resumeCvJobMatch.id)"
                 :loading="deleteResumeCvJobMatchMutation.isLoading.value"/>
      </UTooltip>
      <UFieldGroup orientation="horizontal">
        <UTooltip text="Resume/CV Job Match Score" :delay-duration="0">
          <UBadge color="success" :label="`${resumeCvJobMatch.matchScore}%`" size="xl"/>
        </UTooltip>
        <UTooltip arrow text="Priority Recommendation" :delay-duration="0">
          <UBadge size="xl" color="warning" :label="resumeCvJobMatch.priorityRecommendation"
                  icon="i-lucide-triangle-alert"/>
        </UTooltip>
      </UFieldGroup>
    </div>
    <USeparator class="my-5" color="neutral" label="SUMMARY" icon="i-lucide-text-initial"/>
    <p>{{ resumeCvJobMatch.summary }}</p>
    <div class="mt-10">
      <UBadge trailing-icon="i-lucide-biceps-flexed" size="xl">
        <HyperText
            text="STRENGTHS"
            class="text-xl font-bold"
            :duration="800"
            :animate-on-load="true"
        />
      </UBadge>
      <ul class="list-disc px-5">
        <li v-for="(strength, index) in resumeCvJobMatch.strengths" :key="index">{{ strength }}</li>
      </ul>
    </div>
    <USeparator class="my-5"/>
    <div>
      <UBadge color="warning" trailing-icon="i-lucide-brain" size="xl">
        <HyperText
            text="GAPS"
            class="text-xl font-bold"
            :duration="800"
            :animate-on-load="true"
        />
      </UBadge>
      <ul class="list-disc px-5">
        <li v-for="(gap, index) in resumeCvJobMatch.gaps" :key="index">{{ gap }}</li>
      </ul>
    </div>
    <USeparator class="my-5"/>
    <div>
      <UBadge color="info" trailing-icon="i-lucide-lightbulb" size="xl">
        <HyperText
            text="SUGGESTED KEYWORDS"
            class="text-xl font-bold"
            :duration="800"
            :animate-on-load="true"
        />
      </UBadge>
      <ul class="list-disc px-5">
        <li v-for="(suggestedKeyword, index) in resumeCvJobMatch.suggestedKeywords" :key="index">
          {{ suggestedKeyword }}
        </li>
      </ul>
    </div>

  </UCard>
  <UEmpty
      v-if="jobApplicationResumeCvJobMatches.length <= 0"
      icon="i-lucide-file-text"
      title="No resume/CV & Job Match found"
      description="It looks like you haven't generated a resume/CV & job match for this job application. Generate one by picking a document."
  />
</template>

<style scoped>

</style>