<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {DocumentTypes} from "@/api/data/DocumentStatuses.ts";
import {useDocuments} from "@/composables/useDocuments.ts";
import type {DocumentRequest} from "@/api/interfaces/document.interfaces.ts";

const props = defineProps<{
  jobApplicationId: number
}>()

const {
  jobApplicationDocuments,
  jobApplicationDocumentsQuery,
  createJobApplicationDocumentMutation,
  createJobApplicationDocument,
  uploadProgress
} = useDocuments(props.jobApplicationId)

const open = ref(false)
const form = ref()

const acceptedTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const acceptedExtensions = ['.pdf', '.docx']

const schema = z.object({
  replaceExistingDocument: z.boolean().default(false),

  existingDocumentId: z.preprocess(
      (value) => {
        if (value === '' || value === null || value === undefined) return undefined
        return Number(value)
      },
      z.number().optional()
  ),

  documentType: z.string().trim().min(1, 'Document type is required'),

  documentVersion: z.preprocess(
      (value) => {
        if (value === '' || value === null || value === undefined) return undefined
        return Number(value)
      },
      z.number().min(1, 'Document version must be at least 1')
  ),

  documentFile: z.custom<File | undefined>((value) => {
    return value === undefined || value instanceof File
  }, 'Invalid file')
}).superRefine((data, ctx) => {
  if (data.replaceExistingDocument && !data.existingDocumentId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['existingDocumentId'],
      message: 'Please select a document to replace'
    })
  }

  if (!data.documentFile) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['documentFile'],
      message: 'Document upload is required'
    })
    return
  }

  const file = data.documentFile
  const hasValidMimeType = acceptedTypes.includes(file.type)
  const hasValidExtension = acceptedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
  )

  if (!hasValidMimeType && !hasValidExtension) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['documentFile'],
      message: 'Only PDF and DOCX files are allowed'
    })
  }
})

type FormState = {
  replaceExistingDocument: boolean
  existingDocumentId?: number
  documentType: string
  documentVersion?: number
  documentFile?: File
}

const state = reactive<FormState>({
  replaceExistingDocument: false,
  existingDocumentId: undefined,
  documentType: '',
  documentVersion: 1,
  documentFile: undefined
})

const selectedFileName = computed(() => state.documentFile?.name ?? '')

function onReplaceToggle() {
  if (!state.replaceExistingDocument) {
    state.existingDocumentId = undefined
  }
}

function onFileChange(files: File[] | File | null | undefined) {
  if (!files) {
    state.documentFile = undefined
    return
  }

  const file = Array.isArray(files) ? files[0] : files
  state.documentFile = file ?? undefined

  form.value?.setErrors?.(
      []
  )
}

async function onSubmit(event: FormSubmitEvent<FormState>) {
  console.log(event.data)
  const documentRequest: DocumentRequest = {
    id: event.data.replaceExistingDocument ? event.data.existingDocumentId : undefined,
    jobApplicationId: props.jobApplicationId,
    version: String(event.data.documentVersion),
    documentType: event.data.documentType,
  }
  //@ts-ignore
  createJobApplicationDocument({
    request: documentRequest,
    file: event.data.documentFile,
    replaceDocument: event.data.replaceExistingDocument,
  })
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="Add document">
    <UButton label="Add Document" color="secondary" variant="subtle"/>

    <template #body>
      <UForm
          ref="form"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
      >
        <UFormField name="replaceExistingDocument">
          <UCheckbox
              v-model="state.replaceExistingDocument"
              label="I want to replace an already existing document"
              @update:model-value="onReplaceToggle"
          />
        </UFormField>

        <UFormField
            v-if="state.replaceExistingDocument"
            label="Existing Document"
            name="existingDocumentId"
            required
        >
          <USelect
              :loading="jobApplicationDocumentsQuery.isLoading.value"
              v-model="state.existingDocumentId"
              :items="jobApplicationDocuments"
              label-key="fileKey"
              value-key="id"
              placeholder="Select document to replace"
              class="w-full"
          />
        </UFormField>

        <UFormField label="Document Type" name="documentType" required>
          <USelect
              v-model="state.documentType"
              :items="DocumentTypes"
              placeholder="Select document type"
              class="w-full"
          />
        </UFormField>

        <UFormField label="Document Version" name="documentVersion" required>
          <UInput
              v-model.number="state.documentVersion"
              type="number"
              min="1"
              placeholder="Enter document version"
              class="w-full"
          />
        </UFormField>

        <UFormField label="Document Upload" name="documentFile" required>
          <div class="space-y-2">
            <UFileUpload
                :multiple="false"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                @update:model-value="onFileChange"
            />

            <p v-if="selectedFileName" class="text-sm text-muted">
              Selected: {{ selectedFileName }}
            </p>
          </div>
        </UFormField>
        <UProgress v-model="uploadProgress"
                   v-if="jobApplicationDocumentsQuery.isLoading"
                   status
                   class="mt-3"/>

        <div class="flex justify-end">
          <UButton type="submit" :loading="createJobApplicationDocumentMutation.isLoading.value">
            Save Document
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped>
</style>