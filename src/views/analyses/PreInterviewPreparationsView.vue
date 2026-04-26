<script setup lang="ts">
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import router from "@/router";
import {h, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import type {TableColumn} from '@nuxt/ui'
import {getPaginationRowModel} from "@tanstack/vue-table";
import type {PreInterviewPreparationResponse} from "@/api/interfaces/ai.interfaces.ts";
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";

const {preInterviewPreparations, preInterviewPreparationsQuery} = useInterviewInsights()
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

const columns: TableColumn<PreInterviewPreparationResponse>[] = [
  {
    accessorKey: 'jobApplicationId',
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
    accessorKey: 'technicalTopics',
    header: 'TECHNICAL TOPICS',
    cell: ({row}) => {
      const technicalTopics = row.original.technicalTopics || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          technicalTopics.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'likelyQuestions',
    header: 'LIKELY QUESTIONS',
    cell: ({row}) => {
      const likelyQuestions = row.original.likelyQuestions || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          likelyQuestions.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'preparationTips',
    header: 'PREPARATION TIPS',
    cell: ({row}) => {
      const preparationTips = row.original.preparationTips || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          preparationTips.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'focusAreas',
    header: 'FOCUS AREAS',
    cell: ({row}) => {
      const focusAreas = row.original.focusAreas || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          focusAreas.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'confidenceTips',
    header: 'CONFIDENCE TIPS',
    cell: ({row}) => {
      const confidenceTips = row.original.confidenceTips || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          confidenceTips.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'CREATED AT',
    cell: ({row}) => `${formatLocalDateTime(row.original.createdAt)}`
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
        :loading="preInterviewPreparationsQuery.isLoading.value"
        :data="preInterviewPreparations"
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