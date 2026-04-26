<script setup lang="ts">
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import router from "@/router";
import {h, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import type {TableColumn} from '@nuxt/ui'
import {getPaginationRowModel} from "@tanstack/vue-table";
import type {InterviewPatternAnalysisResponse} from "@/api/interfaces/ai.interfaces.ts";
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";

const {interviewPatternAnalyses, interviewPatternAnalysesQuery} = useInterviewInsights()
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

const columns: TableColumn<InterviewPatternAnalysisResponse>[] = [
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
    accessorKey: 'recurringStrengths',
    header: 'RECURRING STRENGTHS',
    cell: ({row}) => {
      const recurringStrengths = row.original.recurringStrengths || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          recurringStrengths.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'recurringWeaknesses',
    header: 'RECURRING WEAKNESSES',
    cell: ({row}) => {
      const recurringWeaknesses = row.original.recurringWeaknesses || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          recurringWeaknesses.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'skillGaps',
    header: 'SKILL GAPS',
    cell: ({row}) => {
      const skillGaps = row.original.skillGaps || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          skillGaps.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'recommendedFocusAreas',
    header: 'RECOMMENDED FOCUS AREAS',
    cell: ({row}) => {
      const recommendedFocusAreas = row.original.recommendedFocusAreas || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          recommendedFocusAreas.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'behavioralPatterns',
    header: 'BEHAVIORAL PATTERNS',
    cell: ({row}) => {
      const behavioralPatterns = row.original.behavioralPatterns || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          behavioralPatterns.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'overallAssessment',
    header: 'OVERALL ASSESSMENT',
    cell: ({row}) => {
      return h("p", {class: 'w-66 text-wrap'}, row.original.overallAssessment)
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
        :loading="interviewPatternAnalysesQuery.isLoading.value"
        :data="interviewPatternAnalyses"
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