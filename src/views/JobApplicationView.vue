<script setup lang="ts">
import {useRoute} from "vue-router";
import {useJobApplications} from "@/composables/useJobApplications.ts";
import {
  getDisplayValue,
  getJobSourceIcon,
  JobPriorities,
  JobSourcesB4B,
  JobStatuses,
  JobTypes,
  JobWorkModes
} from "@/utils/JobApplicationUtils.ts";
import UpdateJobApplicationStatus from "@/components/JobApplication/UpdateJobApplicationStatus.vue";
import JobApplicationAnalyses from "@/components/JobApplication/ai/JobApplicationAnalyses.vue";

const route = useRoute()
const id = route.params.id

const {jobApplication, jobApplicationQuery} = useJobApplications(Number(id))
</script>

<template>

  <h1 v-if="jobApplicationQuery.isLoading.value">Loading</h1>
  <div v-else>
    <div v-if="jobApplication" class="flex-col flex">
      <TextReveal class="leading-relaxed uppercase font-bold italic text-4xl">
        {{ jobApplication?.company.name }}
      </TextReveal>
      <p class="items-center inline-flex w-full">{{ jobApplication.title }} &nbsp;
        <ULink target="_blank" variant="link" :href="jobApplication.jobPostUrl">
          <UIcon name="i-lucide-link" class="text-green-400 text-xl"/>
        </ULink>
      </p>
      <UModal
          :ui="{ content: 'md:min-w-3xl overflow-y-auto p-5' }"
      >
        <UButton label="Job description" class="w-fit mb-10 mt-2" icon="i-lucide-text-initial"/>

        <template #content>
          <div v-html="jobApplication.description">
          </div>
        </template>
      </UModal>
      <div class="flex flex-row justify-between items-center">
        <div class="flex gap-5">
          <UFieldGroup orientation="horizontal">
            <UpdateJobApplicationStatus :job-application-id="jobApplication.id"/>
            <JobApplicationAnalyses :jobApplication="jobApplication"/>
          </UFieldGroup>

        </div>
        <div>
          <UFieldGroup orientation="horizontal">
            <UTooltip arrow text="Job Application Status" :delay-duration="0">
              <UBadge size="xl" color="secondary" :label="getDisplayValue(JobStatuses, jobApplication.status)"
                      icon="i-lucide-badge-check"/>
            </UTooltip>
            <UTooltip arrow text="Priority" :delay-duration="0">
              <UBadge size="xl" color="error" :label="getDisplayValue(JobPriorities, jobApplication.priority)"
                      icon="i-lucide-activity"/>
            </UTooltip>
            <UTooltip arrow text="Work Mode" :delay-duration="0">
              <UBadge size="xl" color="warning" :label="getDisplayValue(JobWorkModes, jobApplication.workMode)"
                      icon="i-lucide-laptop-minimal"/>
            </UTooltip>
            <UTooltip arrow text="Job Type" :delay-duration="0">
              <UBadge size="xl" color="neutral" :label="getDisplayValue(JobTypes, jobApplication.jobType)"
                      icon="i-lucide-clock-8"/>
            </UTooltip>
            <UTooltip arrow text="Job Source" :delay-duration="0">
              <UBadge size="xl" color="success" :label="getDisplayValue(JobSourcesB4B, jobApplication.source)"
                      :icon="getJobSourceIcon(jobApplication.source)"/>
            </UTooltip>
          </UFieldGroup>

        </div>
      </div>
      <CompanyDocumentsTimelineContactPersonCard :jobApplication="jobApplication"/>
    </div>
  </div>
</template>

<style scoped>

</style>