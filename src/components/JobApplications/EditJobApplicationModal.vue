<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue'
import * as z from 'zod'
import type {EditorToolbarItem, FormSubmitEvent, StepperItem} from '@nuxt/ui'
import {CalendarDate, parseDate} from '@internationalized/date'
import {Currencies} from '@/api/data/Currencies.ts'
import {JobApplicationStatus, JobType, Priority, Source, WorkMode} from '@/api/data/JobApplicationStatuses.ts'
import {useCompanies} from '@/composables/useCompanies.ts'
import {useJobApplications} from '@/composables/useJobApplications.ts'
import type {JobApplicationResponse} from '@/api/interfaces/job.applications.interfaces.ts'

const {companies, companiesQuery} = useCompanies()
const {updateJobApplicationMutation, updateJobApplication} = useJobApplications()

const props = defineProps<{
  jobApplication: JobApplicationResponse | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const modalOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const items = [
  {
    slot: 'job' as const,
    title: 'Job',
    description: 'Enter the main job details',
    icon: 'i-lucide-briefcase'
  },
  {
    slot: 'dates' as const,
    title: 'Dates',
    description: 'Enter posting, application, and deadline dates',
    icon: 'i-lucide-calendar'
  },
  {
    slot: 'salary' as const,
    title: 'Salary',
    description: 'Enter salary information if available',
    icon: 'i-lucide-banknote'
  },
  {
    slot: 'company' as const,
    title: 'Company',
    description: 'Choose an existing company or create a new one',
    icon: 'i-lucide-building'
  }
] satisfies StepperItem[]

const calendarDateSchema = z.custom<CalendarDate>(
    (val) => !!val && typeof val === 'object' && 'toDate' in val,
    {message: 'This field is required'}
)

const schema = z
    .object({
      jobTitle: z.string().trim().min(1, 'Job title is required'),
      jobDescription: z.string().trim().min(1, 'Job description is required'),
      jobType: z.string().trim().min(1, 'Job type is required'),
      jobSource: z.string().trim().min(1, 'Job source is required'),
      workMode: z.string().trim().min(1, 'Work mode is required'),
      department: z.string().optional(),
      jobApplicationStatus: z.string().trim().min(1, 'Job application status is required'),
      priority: z.string().trim().min(1, 'Priority is required'),
      jobPostUrl: z.union([z.literal(''), z.string().trim().url('Enter a valid URL')]).optional(),

      datePosted: calendarDateSchema,
      dateApplied: calendarDateSchema,
      deadline: calendarDateSchema,

      salaryMin: z.union([z.number(), z.nan()]).optional(),
      salaryMax: z.union([z.number(), z.nan()]).optional(),
      selectedCurrency: z.string().optional(),

      alreadySavedCompany: z.boolean().default(false),

      selectedCompanyId: z.preprocess(
          (value) => {
            if (value === '' || value === null || value === undefined) return undefined
            return Number(value)
          },
          z.number().optional()
      ),

      companyName: z.string().optional(),
      companyWebsite: z.union([z.literal(''), z.string().trim().url('Enter a valid website URL')]).optional(),
      companyLocation: z.string().optional(),
      companyIndustry: z.string().optional(),
      companyDescription: z.string().optional()
    })
    .superRefine((data, ctx) => {
      const min = typeof data.salaryMin === 'number' && !Number.isNaN(data.salaryMin) ? data.salaryMin : undefined
      const max = typeof data.salaryMax === 'number' && !Number.isNaN(data.salaryMax) ? data.salaryMax : undefined

      if (min !== undefined && min < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['salaryMin'],
          message: 'Salary min cannot be negative'
        })
      }

      if (max !== undefined && max < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['salaryMax'],
          message: 'Salary max cannot be negative'
        })
      }

      if (min !== undefined && max !== undefined && max < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['salaryMax'],
          message: 'Salary max cannot be less than salary min'
        })
      }

      if (data.dateApplied && data.deadline && data.deadline.compare(data.dateApplied) < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['deadline'],
          message: 'Deadline cannot be earlier than date applied'
        })
      }

      if (data.alreadySavedCompany) {
        if (!data.selectedCompanyId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['selectedCompanyId'],
            message: 'Please select a saved company'
          })
        }
      } else {
        if (!data.companyName?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['companyName'],
            message: 'Company name is required'
          })
        }

        if (!data.companyLocation?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['companyLocation'],
            message: 'Company location is required'
          })
        }

        if (!data.companyIndustry?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['companyIndustry'],
            message: 'Company industry is required'
          })
        }

        if (!data.companyDescription?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['companyDescription'],
            message: 'Company description is required'
          })
        }
      }
    })

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  jobTitle: '',
  jobDescription: '',
  jobType: '',
  jobSource: '',
  workMode: '',
  department: '',
  jobApplicationStatus: '',
  priority: '',
  jobPostUrl: '',
//@ts-ignore
  datePosted: undefined as CalendarDate | undefined,
//@ts-ignore
  dateApplied: undefined as CalendarDate | undefined,
//@ts-ignore
  deadline: undefined as CalendarDate | undefined,

  salaryMin: Number.NaN,
  salaryMax: Number.NaN,
  selectedCurrency: '',

  alreadySavedCompany: false,
  selectedCompanyId: undefined,

  companyName: '',
  companyWebsite: '',
  companyLocation: '',
  companyIndustry: '',
  companyDescription: ''
})

const currentStep = ref(0)
const maxStepReached = ref(0)
const form = ref()

const stepFields = [
  [
    'jobTitle',
    'jobDescription',
    'jobType',
    'jobSource',
    'workMode',
    'department',
    'jobApplicationStatus',
    'priority',
    'jobPostUrl'
  ],
  ['datePosted', 'dateApplied', 'deadline'],
  ['salaryMin', 'salaryMax', 'selectedCurrency'],
  computed(() =>
      state.alreadySavedCompany
          ? ['alreadySavedCompany', 'selectedCompanyId']
          : [
            'alreadySavedCompany',
            'companyName',
            'companyWebsite',
            'companyLocation',
            'companyIndustry',
            'companyDescription'
          ]
  )
] as const

function toCalendarDate(value?: string | null) {
  return value ? parseDate(value) : undefined
}

function resetFormFromJob(job: JobApplicationResponse | null) {
  if (!job) return

  state.jobTitle = job.title ?? ''
  state.jobDescription = job.description ?? ''
  state.jobType = job.jobType ?? ''
  state.jobSource = job.source ?? ''
  state.workMode = job.workMode ?? ''
  state.department = job.department ?? ''
  state.jobApplicationStatus = job.status ?? ''
  state.priority = job.priority ?? ''
  state.jobPostUrl = job.jobPostUrl ?? ''

//@ts-ignore
  state.datePosted = toCalendarDate(job.datePosted)
//@ts-ignore
  state.dateApplied = toCalendarDate(job.dateApplied)
//@ts-ignore
  state.deadline = toCalendarDate(job.deadline)

  state.salaryMin = job.salaryMin ?? Number.NaN
  state.salaryMax = job.salaryMax ?? Number.NaN
  state.selectedCurrency = job.currency ?? ''

  if (job.company?.id) {
    state.alreadySavedCompany = true
    state.selectedCompanyId = job.company.id
    state.companyName = ''
    state.companyWebsite = ''
    state.companyLocation = ''
    state.companyIndustry = ''
    state.companyDescription = ''
  } else {
    state.alreadySavedCompany = false
    state.selectedCompanyId = undefined
    state.companyName = job.company?.name ?? ''
    state.companyWebsite = job.company?.website ?? ''
    state.companyLocation = job.company?.location ?? ''
    state.companyIndustry = job.company?.industry ?? ''
    state.companyDescription = job.company?.description ?? ''
  }

  currentStep.value = 0
  maxStepReached.value = 0
  form.value?.setErrors?.([])
}

watch(
    () => props.jobApplication,
    (job) => {
      resetFormFromJob(job)
    },
    {immediate: true}
)

function clearCompanyErrorsAndFields() {
  if (state.alreadySavedCompany) {
    state.companyName = ''
    state.companyWebsite = ''
    state.companyLocation = ''
    state.companyIndustry = ''
    state.companyDescription = ''
  } else {
    state.selectedCompanyId = undefined
  }
}

function getCurrentStepFields(): string[] {
  const fields = stepFields[currentStep.value]
//@ts-ignore
  return Array.isArray(fields) ? [...fields] : [...fields.value]
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

  if (targetStep > maxStepReached.value + 1) return

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

function toDateString(value?: CalendarDate) {
  return value
      ? `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`
      : null
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!props.jobApplication?.id) return

  updateJobApplication({
    id: props.jobApplication.id,
    title: event.data.jobTitle,
    description: event.data.jobDescription,
    department: event.data.department,
    jobType: event.data.jobType,
    source: event.data.jobSource,
    workMode: event.data.workMode,
    status: event.data.jobApplicationStatus,
//@ts-ignore
    datePosted: toDateString(event.data.datePosted),
//@ts-ignore
    dateApplied: toDateString(event.data.dateApplied),
//@ts-ignore
    deadline: toDateString(event.data.deadline),
    salaryMin: event.data.salaryMin,
    salaryMax: event.data.salaryMax,
    currency: event.data.selectedCurrency,
    priority: event.data.priority,
    jobPostUrl: event.data.jobPostUrl,
    company: {
      id: event.data.alreadySavedCompany ? event.data.selectedCompanyId : undefined,
      name: event.data.companyName,
      website: event.data.companyWebsite,
      location: event.data.companyLocation,
      description: event.data.companyDescription,
      industry: event.data.companyIndustry
    }
  })

  modalOpen.value = false
}

const toolbarItems: EditorToolbarItem[][] = [
  [
    {
      icon: 'i-lucide-heading',
      tooltip: {text: 'Headings'},
      content: {
        align: 'start'
      },
      items: [
        {
          kind: 'heading',
          level: 1,
          icon: 'i-lucide-heading-1',
          label: 'Heading 1'
        },
        {
          kind: 'heading',
          level: 2,
          icon: 'i-lucide-heading-2',
          label: 'Heading 2'
        },
        {
          kind: 'heading',
          level: 3,
          icon: 'i-lucide-heading-3',
          label: 'Heading 3'
        },
        {
          kind: 'heading',
          level: 4,
          icon: 'i-lucide-heading-4',
          label: 'Heading 4'
        }
      ]
    }
  ],
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: 'i-lucide-bold',
      tooltip: {text: 'Bold'}
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: 'i-lucide-italic',
      tooltip: {text: 'Italic'}
    },
    {
      kind: 'mark',
      mark: 'underline',
      icon: 'i-lucide-underline',
      tooltip: {text: 'Underline'}
    },
    {
      kind: 'mark',
      mark: 'strike',
      icon: 'i-lucide-strikethrough',
      tooltip: {text: 'Strikethrough'}
    },
    {
      kind: 'mark',
      mark: 'code',
      icon: 'i-lucide-code',
      tooltip: {text: 'Code'}
    }
  ]
]
</script>

<template>
  <UModal
      v-model:open="modalOpen"
      :ui="{ content: 'sm:max-w-xl md:min-w-6xl' }"
      title="Edit job application"
      description="Update the selected job application."
  >
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
          <template #job>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Job Title" name="jobTitle" required>
                <UInput v-model="state.jobTitle" class="w-full" placeholder="Enter job title"/>
              </UFormField>

              <UFormField label="Job Type" name="jobType" required>
                <USelect v-model="state.jobType" :items="JobType" placeholder="Select job type" class="w-full"/>
              </UFormField>

              <div class="md:col-span-2">
                <UFormField label="Job Description" name="jobDescription" required>
                  <!-- @vue-ignore -->
                  <UEditor
                      v-slot="{editor}"
                      :starter-kit="{
                        blockquote: false,
                        headings: {
                          levels: [1, 2, 3, 4]
                        },
                        dropcursor: {
                          color: 'var(--ui-primary)',
                          width: 2
                        },
                        link: {
                          openOnClick: false
                        }
                      }"
                      content-type="html"
                      class="border rounded-lg border-gray-600 p-2 w-full h-44 overflow-y-auto"
                      v-model="state.jobDescription"
                      placeholder="Describe the job. The more comprehensive, the better the analysis...">
                    <UEditorToolbar :editor="editor" :items="toolbarItems" layout="bubble" class="border-b border-muted py-2 px-8 sm:px-16 overflow-x-auto"/>
                  </UEditor>

                </UFormField>
              </div>

              <UFormField label="Job Source" name="jobSource" required>
                <USelect v-model="state.jobSource" :items="Source" class="w-full" placeholder="Enter job source"/>
              </UFormField>

              <UFormField label="Work Mode" name="workMode" required>
                <USelect v-model="state.workMode" :items="WorkMode" class="w-full" placeholder="Enter work mode"/>
              </UFormField>

              <UFormField label="Department" name="department">
                <UInput v-model="state.department" class="w-full" placeholder="Enter department"/>
              </UFormField>

              <UFormField label="Job Application Status" name="jobApplicationStatus" required>
                <USelect
                    v-model="state.jobApplicationStatus"
                    :items="JobApplicationStatus"
                    class="w-full"
                    placeholder="Select job status"
                />
              </UFormField>

              <div class="md:col-span-2">
                <UFormField label="Priority" name="priority" required>
                  <URadioGroup v-model="state.priority" :items="Priority" class="w-full"/>
                </UFormField>
              </div>

              <div class="md:col-span-2">
                <UFormField label="Job Post URL" name="jobPostUrl">
                  <UInput v-model="state.jobPostUrl" placeholder="https://example.com/job-post" class="w-full"/>
                </UFormField>
              </div>
            </div>
          </template>

          <template #dates>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormField label="Date Posted" name="datePosted" required>
                <!-- @vue-ignore -->
                <UInputDate v-model="state.datePosted" class="w-full"/>
              </UFormField>

              <UFormField label="Date Applied" name="dateApplied" required>
                <!-- @vue-ignore -->
                <UInputDate v-model="state.dateApplied" class="w-full"/>
              </UFormField>

              <UFormField label="Deadline" name="deadline" required>
                <!-- @vue-ignore -->
                <UInputDate v-model="state.deadline" class="w-full"/>
              </UFormField>
            </div>
          </template>

          <template #salary>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormField label="Salary Min" name="salaryMin">
                <UInput v-model.number="state.salaryMin" type="number" class="w-full"
                        placeholder="Enter minimum salary"/>
              </UFormField>

              <UFormField label="Salary Max" name="salaryMax">
                <UInput v-model.number="state.salaryMax" type="number" class="w-full"
                        placeholder="Enter maximum salary"/>
              </UFormField>

              <UFormField label="Selected Currency" name="selectedCurrency">
                <USelect v-model="state.selectedCurrency" :items="Currencies" class="w-full"
                         placeholder="Select currency"/>
              </UFormField>
            </div>
          </template>

          <template #company>
            <div class="space-y-4">
              <UFormField name="alreadySavedCompany">
                <UCheckbox
                    v-model="state.alreadySavedCompany"
                    label="I already saved Company"
                    class="w-full"
                    @update:model-value="clearCompanyErrorsAndFields"
                />
              </UFormField>

              <div v-if="state.alreadySavedCompany">
                <UFormField label="Select Company" name="selectedCompanyId" required>
                  <USelect
                      v-model="state.selectedCompanyId"
                      :loading="companiesQuery.isLoading.value"
                      :items="companies"
                      label-key="name"
                      value-key="id"
                      placeholder="Select company"
                      class="w-full"
                  />
                </UFormField>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Company Name" name="companyName" required>
                  <UInput v-model="state.companyName" class="w-full" placeholder="Enter company name"/>
                </UFormField>

                <UFormField label="Company Website" name="companyWebsite">
                  <UInput v-model="state.companyWebsite" placeholder="https://company.com" class="w-full"/>
                </UFormField>

                <UFormField label="Company Location" name="companyLocation" required>
                  <UInput v-model="state.companyLocation" class="w-full" placeholder="Enter company location"/>
                </UFormField>

                <UFormField label="Company Industry" name="companyIndustry" required>
                  <UInput v-model="state.companyIndustry" class="w-full" placeholder="Enter company industry"/>
                </UFormField>

                <div class="md:col-span-2">
                  <UFormField label="Company Description" name="companyDescription" required>
                    <UTextarea
                        v-model="state.companyDescription"
                        :rows="5"
                        class="w-full"
                        placeholder="Enter company description"
                    />
                  </UFormField>
                </div>
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
                v-else
                type="submit"
                :loading="updateJobApplicationMutation.isLoading.value"
            >
              Update
            </UButton>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>