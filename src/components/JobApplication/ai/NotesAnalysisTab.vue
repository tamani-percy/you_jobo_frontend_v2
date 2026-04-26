<script setup lang="ts">
import {useNotesAnalysis} from "@/composables/ai/useNotesAnalysis.ts";

const props = defineProps<{
  jobApplicationId: number
}>()

const {
  jobApplicationNotesAnalysis,
  jobApplicationNotesAnalysisQuery,
  deleteNotesAnalysis,
  deleteNotesAnalysisMutation
} = useNotesAnalysis(props.jobApplicationId)
</script>

<template>
  <UProgress v-if="jobApplicationNotesAnalysisQuery.isLoading.value"/>
  <UCard v-else variant="outline" class="me-2">
   <div v-if="jobApplicationNotesAnalysis">
     <div class="justify-start flex">
       <UTooltip text="Delete this analysis?" :delay-duration="0">
         <UButton color="error" icon="i-lucide-trash" size="xl"
                  @click="deleteNotesAnalysis(jobApplicationNotesAnalysis.id)"
                  :loading="deleteNotesAnalysisMutation.isLoading.value"/>
       </UTooltip>
     </div>
     <USeparator class="my-5" color="neutral" label="SUMMARY" icon="i-lucide-text-initial"/>
     <p>{{ jobApplicationNotesAnalysis.summary }}</p>
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
         <li v-for="(strength, index) in jobApplicationNotesAnalysis.strengths" :key="index">{{ strength }}</li>
       </ul>
     </div>
     <USeparator class="my-5"/>
     <div class="mt-10">
       <UBadge color="warning" trailing-icon="i-lucide-shield-alert" size="xl">
         <HyperText
             text="CONCERNS"
             class="text-xl font-bold"
             :duration="800"
             :animate-on-load="true"
         />
       </UBadge>
       <ul class="list-disc px-5">
         <li v-for="(concern, index) in jobApplicationNotesAnalysis.concerns" :key="index">{{ concern }}</li>
       </ul>
     </div>
     <USeparator class="my-5"/>
     <div class="mt-10">
       <UBadge color="info" trailing-icon="i-lucide-footprints" size="xl">
         <HyperText
             text="NEXT STEPS"
             class="text-xl font-bold"
             :duration="800"
             :animate-on-load="true"
         />
       </UBadge>
       <ul class="list-disc px-5">
         <li v-for="(nextStep, index) in jobApplicationNotesAnalysis.nextSteps" :key="index">{{ nextStep }}</li>
       </ul>
     </div>
     <USeparator class="my-5"/>
     <div class="mt-10">
       <UBadge color="secondary" trailing-icon="i-lucide-square-asterisk" size="xl">
         <HyperText
             text="PATTERNS"
             class="text-xl font-bold"
             :duration="800"
             :animate-on-load="true"
         />
       </UBadge>
       <ul class="list-disc px-5">
         <li v-for="(pattern, index) in jobApplicationNotesAnalysis.patterns" :key="index">{{ pattern }}</li>
       </ul>
     </div>
   </div>
    <UEmpty
        v-if="!jobApplicationNotesAnalysis "
        icon="i-lucide-file-text"
        title="No notes analysis found"
        description="It looks like you haven't generated a notes analysis for this job application."
    />
  </UCard>
</template>

<style scoped>

</style>