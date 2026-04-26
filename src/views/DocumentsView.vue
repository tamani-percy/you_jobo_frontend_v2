<script setup lang="ts">
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import {useDocuments} from "@/composables/useDocuments.ts";
import router from "@/router";
import {computed, h, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import {getPaginationRowModel} from '@tanstack/vue-table'
import type {TableColumn} from '@nuxt/ui'
import type {DocumentResponse} from "@/api/interfaces/document.interfaces.ts";
import {PDFViewer} from '@embedpdf/vue-pdf-viewer';

const {documentsQuery, documents, deleteJobApplicationDocumentMutation, deleteJobApplicationDocument} = useDocuments()
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')

const table: ShallowRef = useTemplateRef('table')

const isPreviewOpen = ref(false)
const selectedDoc = ref<DocumentResponse | null>(null)

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')

const goToJobApplication = async (jobApplicationId: number) => {
  await router.push(`/job-applications/${jobApplicationId}`)
}

const columns: TableColumn<DocumentResponse>[] = [
  {
    accessorKey: 'fileName',
    header: '',
    cell: ({row}) => {
      return h("div", {class: 'space-x-2'}, [
        h(UTooltip, {
          "delay-duration": 0,
          arrow: true,
          text: 'View document.'
        }, [
          h(UButton, {
                icon: 'i-lucide-eye',
                size: 'lg',
                color: 'neutral',
                variant: 'outline',
                onClick() {
                  selectedDoc.value = row.original
                  isPreviewOpen.value = true
                }
              },
          )
        ]),
        h(UTooltip, {
          "delay-duration": 0,
          arrow: true,
          text: 'Delete document.'
        }, [
          h(UButton, {
                icon: 'i-lucide-trash',
                size: 'lg',
                color: 'error',
                variant: 'outline',
                loading: deleteJobApplicationDocumentMutation.isLoading.value,
                onClick() {
                  deleteJobApplicationDocument(row.original.id)
                }
              },
          )
        ]),
        h(UTooltip, {
          "delay-duration": 0,
          arrow: true,
          text: 'View job application attached to.'
        }, [
          h(UButton, {
                icon: 'i-lucide-folder',
                size: 'lg',
                color: 'neutral',
                variant: 'outline',
                onClick() {
                  goToJobApplication(row.original.jobApplicationId)
                }
              },
          )
        ])
      ])
    }
  },
  {
    accessorKey: 'fileName',
    header: 'FILENAME',
    cell: ({row}) => `${row.original.fileName}`
  },
  {
    accessorKey: 'fileKey',
    header: 'FILE KEY',
    cell: ({row}) => `${row.original.fileKey}`
  },
  {
    accessorKey: 'documentType',
    header: 'DOCUMENT TYPE',
    cell: ({row}) => {
      return h(UBadge, {
            size: 'lg',
            color: 'info',
          }, () => (row.original.documentType)
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'CREATED AT',
    cell: ({row}) => `${formatLocalDateTime(row.original.createdAt)}`
  },
]

const previewUrl = computed(() => {
  //@ts-ignore
  const API_BASE_URL = import.meta.env.VITE_APP_YOU_JOBO_BACKEND
  if (!selectedDoc.value) return ''

  return `${API_BASE_URL}documents/preview?fileName=${encodeURIComponent(selectedDoc.value.fileName)}`
})
</script>

<template>
  <UCard variant="outline">
    <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:global-filter="globalFilter"
        :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
        :columns="columns"
        :loading="documentsQuery.isLoading.value"
        :data="documents"
    />
    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
          :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p:any) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </UCard>

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
</template>

<style scoped>

</style>