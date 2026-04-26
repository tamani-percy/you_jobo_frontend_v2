<script setup lang="ts">
import {ref} from "vue";
import type {JobApplicationResponse} from "@/api/interfaces/job.applications.interfaces.ts";

const props = defineProps<{
  jobApplication: JobApplicationResponse
}>()

const isAiSummaryDrawerOpen = ref(false)
</script>

<template>
  <UFieldGroup>
    <UButton size="lg" icon="i-lucide-sparkles" color="warning" variant="outline">
      <SparklesText
          @click="isAiSummaryDrawerOpen = true"
          text="AI Summary"
          :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
          :sparkles-count="10"
      />
    </UButton>
    <JobApplicationAnalysisDropdown :jobApplicationId="jobApplication.id"/>
    <AiSummaryDrawer :job-application="props.jobApplication" v-model:open="isAiSummaryDrawerOpen"/>
  </UFieldGroup>
</template>