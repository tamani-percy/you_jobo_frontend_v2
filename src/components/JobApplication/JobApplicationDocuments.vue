<script setup lang="ts">
import {useDocuments} from "@/composables/useDocuments.ts";
import CreateJobApplicationDocumentModal
  from "@/components/JobApplication/modals/CreateJobApplicationDocumentModal.vue";
import SplitText from "@/component/SplitText/SplitText.vue";
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import {useResumeCvJobMatch} from "@/composables/ai/useResumeCvJobMatch.ts";
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";
import {PDFViewer} from '@embedpdf/vue-pdf-viewer';
import {computed, ref} from "vue";
import type {DocumentResponse} from "@/api/interfaces/document.interfaces.ts";

const props = defineProps<{
  jobApplicationId: number
}>()

const toast = useToast()

const isPreviewOpen = ref(false)
const selectedDoc = ref<DocumentResponse | null>(null)

const {
  jobApplicationDocumentsQuery,
  jobApplicationDocuments,
  downloadJobApplicationDocument,
  deleteJobApplicationDocument,
  deleteJobApplicationDocumentMutation
} = useDocuments(props.jobApplicationId)

const {
  createResumeCvJobMatchMutation,
  createResumeCvJobMatch,
} = useResumeCvJobMatch(props.jobApplicationId)

const {
  createPreInterviewPreparationMutation,
  createPreInterviewPreparation
} = useInterviewInsights(props.jobApplicationId)

const resumeCvJobMatch = (docId: number) => {
  toast.add({
    title: 'Yaaay!!',
    description: 'Generating Resume/CV & Job Match. You will be notified of its completion shortly.',
    icon: 'i-lucide-sparkles',
    color: 'success'
  })
  createResumeCvJobMatch({
    jobApplicationId: props.jobApplicationId,
    documentId: docId
  })
}

const preInterviewAnalysis = (docId: number) => {
  toast.add({
    title: 'Yaaay!!',
    description: 'Generating Pre-Interview Preparation. You will be notified of its completion shortly.',
    icon: 'i-lucide-sparkles',
    color: 'success'
  })
  createPreInterviewPreparation({
    jobApplicationId: props.jobApplicationId,
    documentId: docId
  })
}

const previewUrl = computed(() => {
  //@ts-ignore
  const API_BASE_URL = import.meta.env.VITE_APP_YOU_JOBO_BACKEND
  if (!selectedDoc.value) return ''

  return `${API_BASE_URL}documents/preview?fileName=${encodeURIComponent(selectedDoc.value.fileName)}`
})

const openPreview = (doc: DocumentResponse) => {
  selectedDoc.value = doc
  isPreviewOpen.value = true
}
</script>

<template>
  <div class="flex justify-between mb-10">
    <div class="inline-flex items-center">
      <UIcon name="i-lucide-file-text" :size="20"/>&nbsp;
      <SplitText
          text="DOCUMENTS"
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
    <CreateJobApplicationDocumentModal :jobApplicationId="jobApplicationId"/>
  </div>
  <UProgress v-if="jobApplicationDocumentsQuery.isLoading.value"/>
  <div v-else>
    <div v-if=" jobApplicationDocuments.length> 0" class="w-full">
      <UPopover v-for="doc in jobApplicationDocuments" :key="doc.id" mode="click" class="">
        <UButton icon="i-lucide-file-text" color="warning" variant="solid" size="xl" class=""/>&nbsp;

        <template #content>

          <div class="p-5 flex justify-center items-center flex-col">
            <h1 class="font-bold">{{ doc.fileKey }}</h1>
            <p>v{{ doc.version }}</p>
            <p>{{ formatLocalDateTime(doc.createdAt) }}</p>
            <div class="mt-5">
              <UFieldGroup orientation="horizontal">
                <UTooltip arrow text="View Document" :delay-duration="0">
                  <UButton icon="i-lucide-eye" size="xl" color="success" @click="openPreview(doc)"/>

                </UTooltip>
                <UTooltip arrow text="Download Document" :delay-duration="0">
                  <UButton icon="i-lucide-download" size="xl" color="info"
                           @click="downloadJobApplicationDocument(doc.fileName, doc.fileKey)"/>
                </UTooltip>
                <UTooltip arrow text="Delete Document" :delay-duration="0">
                  <UButton :loading="deleteJobApplicationDocumentMutation.isLoading.value" icon="i-lucide-trash"
                           color="error" size="xl" @click="deleteJobApplicationDocument(doc.id)"/>
                </UTooltip>
                <UTooltip arrow text="Resume/CV & Job Match" :delay-duration="0">
                  <UButton :loading="createResumeCvJobMatchMutation.isLoading.value" icon="i-lucide-sparkles"
                           color="neutral" size="xl" variant="outline" @click="resumeCvJobMatch(doc.id)"/>
                </UTooltip>
                <UTooltip arrow text="Pre-Interview Preparation" :delay-duration="0">
                  <UButton :loading="createPreInterviewPreparationMutation.isLoading.value" icon="i-lucide-sparkles"
                           color="neutral" size="xl" variant="outline" @click="preInterviewAnalysis(doc.id)"/>
                </UTooltip>
              </UFieldGroup>
            </div>
          </div>
        </template>
      </UPopover>
      <USlideover v-model:open="isPreviewOpen">
        <template #content>
          <PDFViewer
              :config="{
                        src:previewUrl,
                        theme: { preference: 'light' }
                      }"
              :style="{ width: '100%', height: '100%' }"
          />
        </template>
      </USlideover>

    </div>
    <div v-else>
      <UEmpty
          icon="i-lucide-file"
          title="No documents found"
          description="It looks like you haven't added any documents. Create one to get started."
      />
    </div>
  </div>
</template>

<style scoped>

</style>