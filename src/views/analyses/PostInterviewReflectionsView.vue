<script setup lang="ts">
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import router from "@/router";
import {h, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import type {TableColumn} from '@nuxt/ui'
import {getPaginationRowModel} from "@tanstack/vue-table";
import type {PostInterviewReflectionResponse} from "@/api/interfaces/ai.interfaces.ts";
import {useInterviewInsights} from "@/composables/ai/useInterviewInsights.ts";

const {postInterviewReflections, postInterviewReflectionsQuery} = useInterviewInsights()
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

const columns: TableColumn<PostInterviewReflectionResponse>[] = [
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
    accessorKey: 'strengths',
    header: 'STRENGTHS',
    cell: ({row}) => {
      const strengths = row.original.strengths || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          strengths.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'weaknesses',
    header: 'WEAKNESSES',
    cell: ({row}) => {
      const weaknesses = row.original.weaknesses || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          weaknesses.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'missedOpportunities',
    header: 'MISSED OPPORTUNITIES',
    cell: ({row}) => {
      const missedOpportunities = row.original.missedOpportunities || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          missedOpportunities.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'nextSteps',
    header: 'NEXT STEPS',
    cell: ({row}) => {
      const nextSteps = row.original.nextSteps || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          nextSteps.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'summary',
    header: 'SUMMARY',
    cell: ({row}) => {
      return h("p", {class: 'w-66 text-wrap'}, row.original.summary)
    }
  },
  {
    accessorKey: 'confidenceAssessment',
    header: 'CONFIDENCE ASSESSMENT',
    cell: ({row}) => {
      return h("p", {class: 'w-66 text-wrap'}, row.original.confidenceAssessment)
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
        :loading="postInterviewReflectionsQuery.isLoading.value"
        :data="postInterviewReflections"
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