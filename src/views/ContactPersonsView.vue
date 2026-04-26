<script setup lang="ts">
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import {h, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import {getPaginationRowModel} from '@tanstack/vue-table'
import type {TableColumn} from '@nuxt/ui'
import {useContactPersons} from "@/composables/useContactPersons.ts";
import router from "@/router";
import type {ContactPersonResponse} from "@/api/interfaces/contact.person.interfaces.ts";

const {contactPersons, contactPersonsQuery} = useContactPersons()
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

const columns: TableColumn<ContactPersonResponse>[] = [
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
    accessorKey: 'fullName',
    header: 'FULL NAME',
    cell: ({row}) => `${row.original.fullName}`
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({row}) => `${row.original.email}`
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
    cell: ({row}) => `${row.original.phone}`
  },
  {
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({row}) => {
      return h(UBadge, {
            size: 'lg',
            color: 'info',
          }, () => (row.original.role)
      )
    }
  },
  {
    accessorKey: 'linkedinUrl',
    header: 'LinkedIn',
    cell: ({row}) => {
      return h(UButton, {
            onClick: () => {
              window.location.href = row.original.linkedinUrl
            },
            icon: 'i-lucide-link',
            href: row.original.linkedinUrl,
          },
      )
    }
  },
  {
    accessorKey: 'notes',
    header: 'NOTES',
    cell: ({row}) => `${row.original.notes}`
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
        :loading="contactPersonsQuery.isLoading.value"
        :data="contactPersons"
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