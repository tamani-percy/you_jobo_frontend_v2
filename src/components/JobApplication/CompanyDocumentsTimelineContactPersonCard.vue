<script setup lang="ts">
import type {JobApplicationResponse} from "@/api/interfaces/job.applications.interfaces.ts";
import JobApplicationContactPersons from "@/components/JobApplication/JobApplicationContactPersons.vue";
import JobApplicationNotes from "@/components/JobApplication/JobApplicationNotes.vue";

defineProps<{
  jobApplication: JobApplicationResponse
}>()

</script>

<template>
  <UCard variant="outline" class="mt-5">
    <div class="flex flex-row gap-6">
      <div class="w-full md:w-2/3">
        <JobApplicationCompany :company="jobApplication.company"/>
        <USeparator orientation="horizontal" class="my-10"/>
        <JobApplicationInterviewsTimeline :jobApplicationId="jobApplication.id"/>
      </div>
      <USeparator orientation="vertical" class="h-auto"/>
      <div class="md:w-1/3">
        <JobApplicationDocuments :jobApplicationId="jobApplication.id"/>
        <USeparator orientation="horizontal" class="my-10"/>
        <JobApplicationContactPersons :jobApplicationId="jobApplication.id"/>
      </div>
    </div>
  </UCard>
  <JobApplicationNotes :jobApplicationId="jobApplication.id"/>
</template>

<style scoped>

</style>