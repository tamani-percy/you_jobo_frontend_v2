<script setup lang="ts">
import {computed, ref} from "vue";
import type {JobApplicationResponse} from "@/api/interfaces/job.applications.interfaces.ts";
import {useResumeCvJobMatch} from "@/composables/ai/useResumeCvJobMatch.ts";
import type {TabsItem} from "@nuxt/ui/components/Tabs.vue";
import ResumeCvJobMatchTab from "@/components/JobApplication/ai/ResumeCvJobMatchTab.vue";
import NotesAnalysisTab from "@/components/JobApplication/ai/NotesAnalysisTab.vue";
import PreInterviewPreparationTab from "@/components/JobApplication/ai/PreInterviewPreparationTab.vue";

const props = defineProps<{
  jobApplication: JobApplicationResponse
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const modalOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const closeDrawer = async () => {
  emit('update:open', false)
}

const items = ref<TabsItem[]>([
  {
    label: 'Resume/CV & Job Match',
    slot: 'resumeCvJobMatch' as const
  },
  {
    label: 'Notes Analysis',
    slot: 'notesAnalysis' as const
  },
  {
    label: 'Pre-Interview Preparation',
    slot: 'preInterviewPreparation' as const
  },
  {
    label: 'Post-Interview Reflection',
    slot: 'postInterviewReflection' as const
  },
  {
    label: 'Interview Pattern Analysis',
    slot: 'interviewPatternAnalysis' as const
  },
])


const {
  jobApplicationResumeCvJobMatchesQuery,
  jobApplicationResumeCvJobMatches,
} = useResumeCvJobMatch(props.jobApplication.id)


</script>

<template>
  <UDrawer
      v-model:open="modalOpen"
      should-scale-background
      set-background-color-on-scale
      direction="right"
      class="w-full md:w-1/2 overflow-y-auto overflow-x-hidden"
  >
    <template #content>
      <div class="w-full min-w-0 px-5">   <!-- add min-w-0 and move padding here -->
        <div class="flex items-center justify-between gap-4 mt-5 h-fit">
          <h1 class="text-highlighted font-semibold text-xl">AI Summary</h1>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="closeDrawer()"/>
        </div>
        <USeparator class="my-5"/>
        <UTabs :items="items" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
          <template #resumeCvJobMatch="{ item }">
            <UProgress v-if="jobApplicationResumeCvJobMatchesQuery.isLoading.value"/>
            <ResumeCvJobMatchTab :job-application-resume-cv-job-matches="jobApplicationResumeCvJobMatches"
                                 :jobApplicationId="props.jobApplication.id"/>
          </template>
          <template #notesAnalysis="{ item }">
            <NotesAnalysisTab
                :jobApplicationId="props.jobApplication.id"/>
          </template>
          <template #preInterviewPreparation="{ item }">
            <PreInterviewPreparationTab :jobApplicationId="props.jobApplication.id"/>
          </template>
          <template #interviewPatternAnalysis="{ item }">
            <InterviewPatternAnalysisTab :jobApplicationId="props.jobApplication.id"/>
          </template>
          <template #postInterviewReflection="{ item }">
            <PostInterviewReflectionTab :jobApplicationId="props.jobApplication.id"/>
          </template>
        </UTabs>
      </div>
    </template>
  </UDrawer>
</template>

<style scoped>

</style>