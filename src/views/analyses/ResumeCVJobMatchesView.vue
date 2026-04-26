<script setup lang="ts">
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import router from "@/router";
import {h, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import type {TableColumn} from '@nuxt/ui'
import {getPaginationRowModel} from "@tanstack/vue-table";
import type {ResumeCvJobMatchResponse} from "@/api/interfaces/ai.interfaces.ts";
import {useResumeCvJobMatch} from "@/composables/ai/useResumeCvJobMatch.ts";

const {resumeCvJobMatches, resumeCvJobMatchesQuery} = useResumeCvJobMatch()
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

const columns: TableColumn<ResumeCvJobMatchResponse>[] = [
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
    accessorKey: 'matchScore',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'MATCH SCORE',
        icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 font-bold',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({row}) => {

      return h(UBadge, {
            size: 'lg',
            color: 'info',
          }, () => (`${row.original.matchScore}%`)
      )
    }
  },
  {
    accessorKey: 'priorityRecommendation',
    header: 'PRIORITY RECOMMENDATION',
    cell: ({row}) => {
      return h(UBadge, {
            size: 'lg',
            color: 'error',
          }, () => (`${row.original.priorityRecommendation}%`)
      )
    }
  },
  {
    accessorKey: 'gaps',
    header: 'GAPS',
    cell: ({row}) => {
      const gaps = row.original.gaps || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          gaps.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
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
    accessorKey: 'suggestedKeywords',
    header: 'SUGGESTED KEYWORDS',
    cell: ({row}) => {
      const suggestedKeywords = row.original.suggestedKeywords || []

      return h(
          'ul',
          {class: 'list-disc pl-4'},
          suggestedKeywords.map((gap: string) =>
              h('li', {key: gap}, gap)
          )
      )
    }
  },
  {
    accessorKey: 'summary',
    header: 'SUMMARY',
    cell: ({row}) => {
      return h("p",{class:'w-66 text-wrap'},row.original.summary)
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'CREATED AT',
    cell: ({row}) => `${formatLocalDateTime(row.original.createdAt)}`
  },
]

const sorting = ref([
  {
    id: 'matchScore',
    desc: false
  }
])

</script>

<template>
  <UCard variant="outline">
    <UTable
        v-model:sorting="sorting"
        ref="table"
        v-model:pagination="pagination"
        v-model:global-filter="globalFilter"
        :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
        :columns="columns"
        :loading="resumeCvJobMatchesQuery.isLoading.value"
        :data="resumeCvJobMatches"
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