<script setup lang="ts">
import {useCompanies} from "@/composables/useCompanies.ts";
import type {CompanyResponse} from "@/api/interfaces/company.interfaces.ts";
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import {h, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import {getPaginationRowModel} from '@tanstack/vue-table'
import type {TableColumn} from '@nuxt/ui'

const {companies, companiesQuery} = useCompanies()
const UBadge = resolveComponent('UBadge')

const table:ShallowRef = useTemplateRef('table')

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')


const columns: TableColumn<CompanyResponse>[] = [
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({row}) => `${row.original.name}`
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION',
    cell: ({row}) => {
      return h("p",{class:'w-66 text-wrap'},row.original.description)
    }
  },
  {
    accessorKey: 'industry',
    header: 'INDUSTRY',
    cell: ({row}) => {
      return h(UBadge, {
            size: 'lg',
            color: 'info',
          }, () => (row.original.industry.toUpperCase())
      )
    }
  },
  {
    accessorKey: 'location',
    header: 'LOCATION',
    cell: ({row}) => `${row.original.location}`
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
        :loading="companiesQuery.isLoading.value"
        :data="companies"
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