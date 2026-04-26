<script setup lang="ts">
import type {DropdownMenuItem} from "@nuxt/ui/components/DropdownMenu.vue";
import {ref, type ShallowRef, useTemplateRef} from "vue";
import type {StepperItem} from '@nuxt/ui'
import {useNotesAnalysis} from "@/composables/ai/useNotesAnalysis.ts";
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";

const open = ref(false)

const props = defineProps<{
  jobApplicationId: number
}>()

const stepper: ShallowRef = useTemplateRef('stepper')
const toast = useToast()

const aiAnalysisSteps = [
  {
    slot: 'introduction' as const,
    title: 'Introduction',
    icon: 'i-lucide-info'
  }, {
    slot: 'explanation' as const,
    title: 'AI Analyses Explained',
    icon: 'i-lucide-book-open-check'
  },
] satisfies StepperItem[]

const {createNotesAnalysis} = useNotesAnalysis()

const {
  createInterviewPatternAnalysis,
  createPostInterviewReflection,
} = useInterviewInsights()

const dropdownItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'What is this?',
      icon: 'i-lucide-circle-question-mark',
      onClick() {
        open.value = true
      }
    }
  ],
  [
    {
      label: 'Generate Notes Analysis',
      icon: 'i-lucide-notebook-pen',
      onClick() {
        toast.add({
          title: 'Yaaay!!',
          description: 'Generating Notes Analysis. You will be notified of its completion shortly.',
          icon: 'i-lucide-sparkles',
          color: 'success'
        })
        createNotesAnalysis(props.jobApplicationId)
      }
    },
    {
      label: 'Generate Interview Pattern Analysis',
      icon: 'i-lucide-rotate-cw',
      onClick() {
        toast.add({
          title: 'Yaaay!!',
          description: 'Generating Interview Pattern Analysis. You will be notified of its completion shortly.',
          icon: 'i-lucide-sparkles',
          color: 'success'
        })
        createInterviewPatternAnalysis(props.jobApplicationId)
      }
    },
    {
      label: 'Generate Post-Interview Reflection',
      icon: 'i-lucide-chart-column-stacked',
      onClick() {
        toast.add({
          title: 'Yaaay!!',
          description: 'Generating Post-Interview Reflection. You will be notified of its completion shortly.',
          icon: 'i-lucide-sparkles',
          color: 'success'
        })
        createPostInterviewReflection(props.jobApplicationId)
      }
    }
  ]
])
</script>

<template>
  <UDropdownMenu
      :items="dropdownItems"
      :filter="{
      icon: 'i-lucide-search'
    }"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-fit'
      }"
  >
    <UButton color="warning" variant="outline" icon="i-lucide-chevron-down"/>
  </UDropdownMenu>
  <UModal v-model:open="open" title="AI Analyses Explained"
          :ui="{ content: 'sm:max-w-xl md:min-w-6xl' }"

  >
    <template #body>
      <UStepper ref="stepper" :items="aiAnalysisSteps" class="w-full">
        <template #introduction>
          <p class="text-center mt-10">
            Unlock AI-powered insights on your job applications — from resume matching to interview preparation and
            post-interview feedback.
          </p>
        </template>
        <div class="mt-10">
        </div>
        <template #explanation>
          <div class="mt-10 space-y-6">

            <p class="text-sm italic">
              Each analysis is generated once per job application (or per document where applicable).
              All analyses can be viewed on the analyses page and deleted when no longer needed.
            </p>

            <div class="space-y-4">
              <div>
                <p class="font-semibold inline-flex items-center">
                  <UIcon name="i-lucide-file-text"/> &nbsp;Resume/CV & Job Match
                </p>
                <p class="text-sm">
                  Compares your selected resume against the job description to produce a match score, highlight your
                  strengths,
                  identify skill gaps, and suggest keywords to improve your application. Works best with resumes and CVs
                  —
                  not certifications.
                </p>
                <div class="flex justify-center items-center">
                  <img src="/images/ai/resumejobmatch.png" alt="">
                </div>
              </div>
              <USeparator/>
              <div>
                <p class="font-semibold inline-flex items-center">
                  <UIcon name="i-lucide-notebook-pen"/> &nbsp;Notes Analysis
                </p>
                <p class="text-sm">
                  Analyses your personal notes about a job application to surface patterns, concerns, and actionable
                  next steps.
                  The more detailed and honest your notes, the more useful the insights.
                </p>
              </div>
              <USeparator/>

              <div>
                <p class="font-semibold inline-flex items-center">
                  <UIcon name="i-lucide-target"/> &nbsp;Pre-Interview Preparation
                </p>
                <p class="text-sm">
                  Generates tailored preparation guidance for your upcoming interview — including likely questions,
                  technical topics to revise, and confidence tips — based on the interview stage, type, and your resume.
                </p>
              </div>
              <USeparator/>

              <div>
                <p class="font-semibold inline-flex items-center">
                  <UIcon name="i-lucide-refresh-cw"/> &nbsp;Post-Interview Reflection
                </p>
                <p class="text-sm">
                  Reviews your post-interview notes to assess your performance, identify missed opportunities,
                  and recommend concrete next steps. Previous interview history is also factored in to detect recurring
                  patterns.
                </p>
              </div>
              <USeparator/>

              <div>
                <p class="font-semibold inline-flex items-center">
                  <UIcon name="i-lucide-chart-column-stacked"/> &nbsp;Interview Pattern Analysis
                </p>
                <p class="text-sm">
                  Looks across all your interview notes for a job to identify recurring strengths, weaknesses,
                  and behavioural patterns — giving you a big-picture view of where to focus your preparation.
                </p>
              </div>

            </div>
          </div>
        </template>
      </UStepper>
      <div class="flex gap-2 justify-between mt-4">
        <UButton
            leading-icon="i-lucide-arrow-left"
            :disabled="!stepper?.hasPrev"
            @click="stepper?.prev()"
        >
          Prev
        </UButton>

        <UButton
            trailing-icon="i-lucide-arrow-right"
            :disabled="!stepper?.hasNext"
            @click="stepper?.next()"
        >
          Next
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>