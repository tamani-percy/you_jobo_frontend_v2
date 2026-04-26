<script setup lang="ts">
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";

const props = defineProps<{
  jobApplicationId: number
}>()

const {
  jobApplicationPostInterviewReflection,
  jobApplicationPostInterviewReflectionQuery,
  deletePostInterviewReflection,
  deletePostInterviewReflectionMutation
} = useInterviewInsights(props.jobApplicationId)

</script>

<template>
  <UProgress v-if="jobApplicationPostInterviewReflectionQuery.isLoading.value"/>
  <UCard v-else variant="outline" class="me-2">
    <div v-if="jobApplicationPostInterviewReflection">
      <div class="justify-between flex">
        <UTooltip text="Delete this analysis?" :delay-duration="0">
          <UButton color="error" icon="i-lucide-trash" size="xl"
                   @click="deletePostInterviewReflection(jobApplicationPostInterviewReflection.id)"
                   :loading="deletePostInterviewReflectionMutation.isLoading.value"/>
        </UTooltip>
        <UTooltip text="Confidence Assessment" :delay-duration="0">
          <UBadge color="success" :label="jobApplicationPostInterviewReflection.confidenceAssessment" size="xl"/>
        </UTooltip>
      </div>
      <USeparator class="my-5" color="neutral" label="SUMMARY" icon="i-lucide-text-initial"/>
      <p>{{ jobApplicationPostInterviewReflection.summary }}</p>

      <div class="mt-10">
        <UBadge trailing-icon="i-lucide-bicep-flexed" size="xl">
          <HyperText
              text="STRENGTHS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(strength, index) in jobApplicationPostInterviewReflection.strengths" :key="index">
            {{ strength }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="warning" trailing-icon="i-lucide-shield-alert" size="xl">
          <HyperText
              text="WEAKNESSES"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(weakness, index) in jobApplicationPostInterviewReflection.weaknesses"
              :key="index">
            {{ weakness }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="info" trailing-icon="i-lucide-footsteps" size="xl">
          <HyperText
              text="NEXT STEPS"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(nextStep, index) in jobApplicationPostInterviewReflection.nextSteps"
              :key="index">
            {{ nextStep }}
          </li>
        </ul>
      </div>
      <USeparator class="my-5"/>
      <div class="mt-10">
        <UBadge color="secondary" trailing-icon="i-lucide-x" size="xl">
          <HyperText
              text="MISSED OPPORTUNITIES"
              class="text-xl font-bold"
              :duration="800"
              :animate-on-load="true"
          />
        </UBadge>
        <ul class="list-disc px-5">
          <li v-for="(missedOpportunity, index) in jobApplicationPostInterviewReflection.missedOpportunities"
              :key="index">{{
              missedOpportunity
            }}
          </li>
        </ul>
      </div>
    </div>
    <UEmpty
        v-if="!jobApplicationPostInterviewReflection"
        icon="i-lucide-file-text"
        title="No post-interview analysis found"
        description="It looks like you haven't generated a post-interview analysis for this job application. Generate one by picking a document."
    />
  </UCard>
</template>

<style scoped>

</style>