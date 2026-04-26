<script setup lang="ts">
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import {useInterviews} from "@/composables/useInterviews.ts";
import router from "@/router";
import {h, resolveComponent, type ShallowRef, useTemplateRef, ref} from "vue";
import type {TableColumn} from '@nuxt/ui'
import {getPaginationRowModel} from "@tanstack/vue-table";
import type {InterviewResponse} from "@/api/interfaces/interviews.interfaces.ts";

const {interviews, interviewsQuery} = useInterviews()
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')

const table: ShallowRef = useTemplateRef('table')

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')

const goToJobApplication = async (jobApplicationId: number) => {
  await router.push(`/job-applications/${jobApplicationId}`)
}

const columns: TableColumn<InterviewResponse>[] = [
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
    accessorKey: 'scheduledAt',
    header: 'SCHEDULED AT',
    cell: ({row}) => `${formatLocalDateTime(row.original.scheduledAt)}`
  },
  {
    accessorKey: 'durationMinutes',
    header: 'DURATION',
    cell: ({row}) => {
      return h(UBadge, {
            size: 'lg',
            color: 'info',
          }, () => (`${row.original.durationMinutes}min`)
      )
    }
  },
  {
    accessorKey: 'interviewerName',
    header: 'INTERVIEWER',
    cell: ({row}) => {
      return h('div', {class: 'p-3 space-y-2 flex flex-col justify-center items-center'}, [
        h('h1', row.original.interviewerName),
        h('p', {class: 'text-sm'}, row.original.interviewerEmail)
      ])
    }
  },
  {
    accessorKey: 'interviewType',
    header: 'INTERVIEW TYPE',
    cell: ({row}) => {
      return h(UBadge, {
            size: 'lg',
            color: 'info',
          }, () => (row.original.interviewType)
      )
    }
  },
  {
    accessorKey: 'interviewStage',
    header: 'INTERVIEW STAGE',
    cell: ({row}) => {
      return h(UBadge, {
            size: 'lg',
            color: 'success',
          }, () => (row.original.interviewStage)
      )
    }
  },
  {
    accessorKey: 'interviewResult',
    header: 'INTERVIEW RESULT',
    cell: ({row}) => {
      return h(UBadge, {
            size: 'lg',
            color: 'warning',
          }, () => (row.original.interviewResult)
      )
    }
  },
  {
    accessorKey: 'notes',
    header: 'INTERVIEW NOTES',
    cell: ({row}) => {
      return h('div', {class: 'p-3 space-y-2 flex flex-col justify-center items-center text-wrap'}, [
        h('h1', row.original.notes)
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
        :loading="interviewsQuery.isLoading.value"
        :data="interviews"
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