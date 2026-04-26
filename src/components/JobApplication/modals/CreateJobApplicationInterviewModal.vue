<script setup lang="ts">
import {reactive, ref} from 'vue'
import * as z from 'zod'
import type {FormSubmitEvent, StepperItem} from '@nuxt/ui'
import type {CalendarDate} from '@internationalized/date'
import {InterviewResults, InterviewStages, InterviewTypes} from "@/api/data/InterviewStatuses.ts";
import {useInterviews} from "@/composables/useInterviews.ts";
import {toLocalDateTimeString} from "@/utils/DateUtils.ts";


const props = defineProps<{
  jobApplicationId: number
}>()

const open = ref(false)
const currentStep = ref(0)
const maxStepReached = ref(0)
const form = ref()

const {createJobApplicationInterviewMutation, createJobApplicationInterview} = useInterviews()

const items = [
  {
    slot: 'details' as const,
    title: 'Details',
    description: 'Interviewer and meeting details',
    icon: 'i-lucide-user-round'
  },
  {
    slot: 'date' as const,
    title: 'Date',
    description: 'When the interview will happen',
    icon: 'i-lucide-calendar'
  },
  {
    slot: 'meta' as const,
    title: 'Interview Info',
    description: 'Stage, type, result and notes',
    icon: 'i-lucide-clipboard-list'
  }
] satisfies StepperItem[]

const calendarDateSchema = z.custom<CalendarDate>(
    (val) => !!val && typeof val === 'object' && 'toDate' in val,
    {message: 'This field is required'}
)

const schema = z.object({
  interviewerName: z.string().trim().min(1, 'Interviewer name is required'),
  interviewerEmail: z
      .union([
        z.literal(''),
        z.email('Enter a valid email')
      ])
      .optional(),
  locationOrLink: z.string().min(1, 'Location or Link is required'),
  durationInMinutes: z.preprocess(
      (value) => {
        if (value === '' || value === null || value === undefined) return undefined
        return Number(value)
      },
      z.number().min(1, 'Duration is required')
  ),

  interviewDate: calendarDateSchema,

  interviewStage: z.string().trim().min(1, 'Interview stage is required'),
  interviewType: z.string().trim().min(1, 'Interview type is required'),
  interviewResult: z.string().trim().min(1, 'Interview result is required'),
  notes: z.string().trim().min(1, 'Notes are required')
})

type Schema = z.output<typeof schema>

const state = reactive({
  interviewerName: '',
  interviewerEmail: '',
  locationOrLink: '',
  durationInMinutes: undefined as number | undefined,

  interviewDate: undefined as CalendarDate | undefined,

  interviewStage: '',
  interviewType: '',
  interviewResult: '',
  notes: ''
})

const stepFields = [
  ['interviewerName', 'interviewerEmail', 'locationOrLink', 'durationInMinutes'],
  ['interviewDate'],
  ['interviewStage', 'interviewType', 'interviewResult', 'notes']
] as const

function getCurrentStepFields(): string[] {
  //@ts-ignore
  return [...stepFields[currentStep.value]]
}

async function validateCurrentStep() {
  const result = schema.safeParse(state)
  const fields = getCurrentStepFields()

  form.value?.setErrors?.([])

  if (result.success) return true

  const currentStepErrors = result.error.issues.filter((issue) => {
    const field = String(issue.path[0] ?? '')
    return fields.includes(field)
  })

  if (!currentStepErrors.length) return true

  form.value?.setErrors?.(
      currentStepErrors.map((issue) => ({
        name: String(issue.path[0]),
        message: issue.message
      }))
  )

  return false
}

async function onStepChange(targetStep: number) {
  if (targetStep <= currentStep.value) {
    currentStep.value = targetStep
    return
  }

  if (targetStep > maxStepReached.value + 1) {
    return
  }

  const isValid = await validateCurrentStep()
  if (!isValid) return

  currentStep.value = targetStep
  maxStepReached.value = Math.max(maxStepReached.value, targetStep)
}

async function nextStep() {
  const isValid = await validateCurrentStep()
  if (!isValid) return

  if (currentStep.value < items.length - 1) {
    currentStep.value++
    maxStepReached.value = Math.max(maxStepReached.value, currentStep.value)
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  createJobApplicationInterview({
    notes: event.data.notes,
    jobApplicationId: props.jobApplicationId,
    //@ts-ignore
    scheduledAt: toLocalDateTimeString(event.data.interviewDate),
    durationMinutes: event.data.durationInMinutes,
    locationOrLink: event.data.locationOrLink,
    interviewerName: event.data.interviewerName,
    interviewType: event.data.interviewType,
    interviewStage: event.data.interviewStage,
    interviewResult: event.data.interviewResult,
    interviewerEmail: event.data.interviewerEmail
  })
  open.value = false
  currentStep.value = 0
  maxStepReached.value = 0
}
</script>


<template>
  <UModal v-model:open="open" title="Add interview" :ui="{ content: 'sm:max-w-xl md:min-w-6xl' }">
    <UButton label="Add Interview" color="secondary" variant="subtle"/>
    <template #body>
      <!-- @vue-ignore -->
      <UForm
          ref="form"
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
      >
        <!-- @vue-ignore -->
        <UStepper
            :model-value="currentStep"
            :items="items"
            class="w-full"
            @update:model-value="onStepChange"
        >
          <template #details>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Interviewer Name" name="interviewerName" required>
                <UInput
                    v-model="state.interviewerName"
                    class="w-full"
                    placeholder="Enter interviewer name"
                />
              </UFormField>

              <UFormField label="Interviewer Email" name="interviewerEmail">
                <UInput
                    v-model="state.interviewerEmail"
                    class="w-full"
                    placeholder="Enter interviewer email"
                />
              </UFormField>

              <UFormField label="Location or Link" name="locationOrLink">
                <UInput
                    v-model="state.locationOrLink"
                    class="w-full"
                    placeholder="Enter meeting location or link"
                />
              </UFormField>

              <UFormField label="Duration in minutes" name="durationInMinutes" required>
                <UInput
                    v-model="state.durationInMinutes"
                    type="number"
                    class="w-full"
                    placeholder="Enter duration"
                />
              </UFormField>
            </div>
          </template>

          <template #date>
            <div class="grid grid-cols-1 gap-4">
              <UFormField label="Interview Date" name="interviewDate" required>
                <!-- @vue-ignore -->
                <UInputDate v-model="state.interviewDate" class="w-full"/>
              </UFormField>
            </div>
          </template>

          <template #meta>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Interview Stage" name="interviewStage" required>
                <USelect
                    v-model="state.interviewStage"
                    :items="InterviewStages"
                    class="w-full"
                    placeholder="Select interview stage"
                />
              </UFormField>

              <UFormField label="Interview Type" name="interviewType" required>
                <USelect
                    v-model="state.interviewType"
                    :items="InterviewTypes"
                    class="w-full"
                    placeholder="Select interview type"
                />
              </UFormField>

              <UFormField label="Interview Result" name="interviewResult" required>
                <USelect
                    v-model="state.interviewResult"
                    :items="InterviewResults"
                    class="w-full"
                    placeholder="Select interview result"
                />
              </UFormField>

              <div class="md:col-span-2">
                <UFormField label="Notes" name="notes" required>
                  <UTextarea
                      v-model="state.notes"
                      :rows="5"
                      class="w-full"
                      placeholder="Enter interview notes"
                  />
                </UFormField>
              </div>
            </div>
          </template>
        </UStepper>

        <div class="flex items-center justify-between pt-4">
          <UButton
              type="button"
              color="neutral"
              variant="outline"
              :disabled="currentStep === 0"
              @click="previousStep"
          >
            Previous
          </UButton>

          <div>
            <UButton
                v-if="currentStep < items.length - 1"
                type="button"
                @click="nextStep"
            >
              Next
            </UButton>

            <UButton
                :loading="createJobApplicationInterviewMutation.isLoading.value"
                v-else
                type="submit"
            >
              Submit
            </UButton>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped>
</style>