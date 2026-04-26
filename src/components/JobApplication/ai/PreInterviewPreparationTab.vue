<script setup lang="ts">
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";

const props = defineProps<{
  jobApplicationId: number
}>()

const {
  jobApplicationPreInterviewPreparation,
  jobApplicationPreInterviewPreparationQuery,
  deletePreInterviewPreparation,
  deletePreInterviewPreparationMutation
} = useInterviewInsights(props.jobApplicationId)

console.log(jobApplicationPreInterviewPreparation)
</script>

<template>
  <UProgress v-if="jobApplicationPreInterviewPreparationQuery.isLoading.value"/>
  <UCard v-else variant="outline" class="me-2">
    <div v-if="jobApplicationPreInterviewPreparation">
      <div class="justify-start flex">
        <UTooltip text="Delete this analysis?" :delay-duration="0">
          <UButton color="error" icon="i-lucide-trash" size="xl"
                   @click="deletePreInterviewPreparation(jobApplicationPreInterviewPreparation.id)"
                   :loading="deletePreInterviewPreparationMutation.isLoading.value"/>
        </UTooltip>
      </div>
      <div class="mt-10">
        <UBadge trailing-icon="i-lucide-circle-question" size="xl">
          <HyperText
              text="LIKELY QUESTIONS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(likelyQuestion, index) in jobApplicationPreInterviewPreparation.likelyQuestions" :key="index">
            {{ likelyQuestion }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="warning" trailing-icon="i-lucide-laptop-minimal" size="xl">
          <HyperText
              text="TECHNICAL TOPICS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(technicalTopic, index) in jobApplicationPreInterviewPreparation.technicalTopics" :key="index">
            {{ technicalTopic }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="info" trailing-icon="i-lucide-book-open" size="xl">
          <HyperText
              text="PREPARATION TIPS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(preparationTip, index) in jobApplicationPreInterviewPreparation.preparationTips" :key="index">
            {{ preparationTip }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="secondary" trailing-icon="i-lucide-square-asterisk" size="xl">
          <HyperText
              text="FOCUS AREAS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(focusArea, index) in jobApplicationPreInterviewPreparation.focusAreas" :key="index">{{
              focusArea
            }}
          </li>
        </ul>
      </div>
      <div class="mt-10">
        <UBadge color="secondary" trailing-icon="i-lucide-bicep-flexed" size="xl">
          <HyperText
              text="CONFIDENCE TIPS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(confidenceTip, index) in jobApplicationPreInterviewPreparation.confidenceTips" :key="index">
            {{ confidenceTip }}
          </li>
        </ul>
      </div>
    </div>
    <UEmpty
        v-if="!jobApplicationPreInterviewPreparation "
        icon="i-lucide-file-text"
        title="No pre-interview preparation found"
        description="It looks like you haven't generated a pre-interview preparation for this job application. Generate one by picking a document."
    />
  </UCard>
</template>

<style scoped>

</style>