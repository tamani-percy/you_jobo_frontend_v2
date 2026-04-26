<script setup lang="ts">
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import {useNotes} from "@/composables/useNotes.ts";
import router from "@/router";
import {h, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import {getPaginationRowModel} from '@tanstack/vue-table'
import type {TableColumn} from '@nuxt/ui'
import type {NoteResponse} from "@/api/interfaces/note.interfaces.ts";

const {notes, notesQuery} = useNotes()

const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')

const table: ShallowRef = useTemplateRef('table')
const goToJobApplication = async (jobApplicationId: number) => {
  await router.push(`/job-applications/${jobApplicationId}`)
}

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')

const columns: TableColumn<NoteResponse>[] = [
  {
    accessorKey: 'fileName',
    header: '',
    cell: ({row}) => {
      return h(UTooltip, {
        "delay-duration": 0,
        arrow: true,
        text: 'View job application attached to.'
      }, [
        h(UButton, {

              icon: 'i-lucide-eye',
              size: 'lg',
              color: 'neutral',
              variant: 'outline',
              onClick() {
                goToJobApplication(row.original.jobApplicationId)
              }
            },
        )
      ])
    }
  },
  {
    accessorKey: 'content',
    header: 'CONTENT',
    cell: ({row}) => {
      return h('div', {class: 'p-3 space-y-2 flex flex-col justify-center items-center text-wrap'}, [
        h('h1', row.original.content)
      ])
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'CREATED AT',
    cell: ({row}) => `${formatLocalDateTime(row.original.createdAt)}`
  },
  {
    accessorKey: 'updatedAt',
    header: 'UPDATED AT',
    cell: ({row}) => `${formatLocalDateTime(row.original.updatedAt)}`
  },
]

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
        :loading="notesQuery.isLoading.value"
        :data="notes"
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
</template>

<style scoped>

</style>