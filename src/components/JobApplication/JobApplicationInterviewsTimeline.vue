<script setup lang="ts">
import {useInterviews} from "@/composables/useInterviews"
import SplitText from "@/component/SplitText/SplitText.vue";
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import EditJobApplicationInterviewModal from "@/components/JobApplication/modals/EditJobApplicationInterviewModal.vue";
import type {InterviewResponse} from "@/api/interfaces/interviews.interfaces.ts";

const props = defineProps<{
  jobApplicationId: number
}>()

const {
  jobApplicationInterviews,
  jobApplicationInterviewsQuery,
  deleteJobApplicationInterviewMutation,
  deleteJobApplicationInterview
} = useInterviews(props.jobApplicationId)

</script>

<template>

  <div class="flex justify-between mb-10">
    <div class="w-full flex justify-between">
      <div class="inline-flex items-center  w-full">
        <UIcon name="i-lucide-chart-no-axes-gantt" :size="20"/>&nbsp;
        <SplitText
            text="INTERVIEW TIMELINE"
            class-name="text-xl font-semibold text-center"
            :delay="100"
            :duration="0.6"
            ease="power3.out"
            split-type="chars"
            :from="{ opacity: 0, y: 40 }"
            :to="{ opacity: 1, y: 0 }"
            :threshold="0.1"
            root-margin="-100px"
            text-align="center"
        />
      </div>
      <CreateJobApplicationInterviewModal :jobApplicationId="jobApplicationId"/>
    </div>
  </div>
  <h1 v-if="jobApplicationInterviewsQuery.isLoading.value">
    Loading
  </h1>

  <div v-else>
    <div v-if="jobApplicationInterviews.length > 0">
      <UTimeline :items="jobApplicationInterviews">
        <template #indicator>
          <UIcon name="i-lucide-volume-2"/>
        </template>
        <template #date="{item}">
          {{ formatLocalDateTime(item.createdAt) }}
        </template>
        <template #description="{item}">
          <div class="flex justify-between w-full">
            <UFieldGroup orientation="horizontal">
              <UTooltip arrow text="Interviewer" :delay-duration="0">
                <UBadge icon="i-lucide-circle-user" variant="subtle" :label="item.interviewerName"/>
              </UTooltip>
              <UTooltip arrow text="Interview Type" :delay-duration="0">
                <UBadge icon="i-lucide-building" color="warning" variant="subtle" :label="item.interviewType"/>
              </UTooltip>
              <UTooltip arrow text="Interview Result" :delay-duration="0">
                <UBadge icon="i-lucide-tally-4" color="info" variant="subtle" :label="item.interviewResult"/>
              </UTooltip>
              <UTooltip arrow text="Interview Stage" :delay-duration="0">
                <UBadge icon="i-lucide-spotlight" color="error" variant="subtle" :label="item.interviewStage"/>
              </UTooltip>
              <UTooltip arrow text="Duration" :delay-duration="0">
                <UBadge icon="i-lucide-hourglass" color="neutral" variant="subtle"
                        :label="`${item.durationMinutes}min`"/>
              </UTooltip>
            </UFieldGroup>
            <UFieldGroup orientation="horizontal">
              <UTooltip arrow text="Edit interview?" :delay-duration="0">
                <EditJobApplicationInterviewModal :interview="item as InterviewResponse"/>
              </UTooltip>
              <UTooltip arrow text="Delete interview?" :delay-duration="0">
                <UButton icon="i-lucide-trash" variant="subtle" color="error"
                         @click="deleteJobApplicationInterview(item.id)"
                         :loading="deleteJobApplicationInterviewMutation.isLoading.value"/>
              </UTooltip>
            </UFieldGroup>
          </div>
          <p class="mt-3"> {{ item.notes }}</p>
        </template>
      </UTimeline>
    </div>
    <div v-else class="space-y-4">
      <UEmpty
          icon="i-lucide-megaphone"
          title="No interviews found"
          description="It looks like you haven't added any interviews. Create one to get started."
      />
    </div>
  </div>

</template>