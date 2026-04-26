<script setup lang="ts">
import {useJobApplications} from "@/composables/useJobApplications"
import type {JobApplicationResponse} from "@/api/interfaces/job.applications.interfaces.ts";
import {h, type Ref, ref, resolveComponent, type ShallowRef, useTemplateRef} from "vue";
import {getPaginationRowModel} from '@tanstack/vue-table'
import type {TableColumn} from '@nuxt/ui'
import {statusTypeMap} from "@/utils/JobApplicationUtils.ts";
import router from "@/router";
import EditJobApplicationModal from "@/components/JobApplications/EditJobApplicationModal.vue";
import {formatLocalDateTime} from "@/utils/DateUtils.ts";

const {jobApplicationsQuery, jobApplications, deleteJobApplication, deleteJobApplicationMutation} = useJobApplications()
const UPopover = resolveComponent('UPopover')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')

const open = ref(false)
const jobApplication: Ref<JobApplicationResponse | null> = ref<JobApplicationResponse | null>(null)
const table: ShallowRef = useTemplateRef('table')
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')

const goToJobApplication = async (jobApplicationId: number) => {
  await router.push(`/job-applications/${jobApplicationId}`)
}

function onEdit(row: JobApplicationResponse) {
  jobApplication.value = row
  open.value = true
}

const columns: TableColumn<JobApplicationResponse>[] = [
  {
    accessorKey: 'id',
    header: '',
    cell: ({row}) => {

      return h(UTooltip, {
        "delay-duration": 0,
        arrow: true,
        text: 'View job application.'
      }, [
        h(UButton, {

              icon: 'i-lucide-eye',
              size: 'lg',
              color: 'neutral',
              variant: 'outline',
              onClick() {
                goToJobApplication(row.original.id)
              }
            },
        )
      ])
    }
  },
  {
    accessorKey: 'title',
    header: 'TITLE',
    cell: ({row}) => `${row.original.title}`
  },
  {
    accessorKey: 'company',
    header: 'COMPANY',
    cell: ({row}) => `${row.original.company.name}`
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({row}) => {
      //@ts-ignore
      const color = statusTypeMap[row.original.status] as const
      return h(UBadge, {
            size: 'lg',
            color,
          }, () => (row.original.status.replaceAll('_', ' '))
      )
    }
  },
  {
    accessorKey: 'dateApplied',
    header: 'DATE APPLIED',
    cell: ({row}) => `${row.original.dateApplied}`
  },
  {
    accessorKey: 'createdAt',
    header: 'CREATED AT',
    cell: ({row}) => `${formatLocalDateTime(row.original.createdAt)}`
  },
  {
    accessorKey: 'actions',
    header: 'ACTIONS',
    cell: ({row}) => {
      return h(
          'div',
          {class: 'flex gap-2'},
          [
            // EDIT BUTTON
            h(UButton, {
              color: "neutral",
              icon: 'i-lucide-pen',
              onClick: () => {
                onEdit(row.original)
              }
            }),

            // DELETE WITH POPOVER CONFIRM
            h(
                UPopover,
                {},
                {
                  default: () =>
                      h(UButton, {
                        icon: 'i-lucide-trash',
                        color: 'error'
                      }),
                  content: () =>
                      h('div', {class: 'p-3 space-y-2'}, [
                        h('p', {class: 'text-sm'}, 'Are you sure you want to delete?'),
                        h('div', {class: 'flex gap-2 justify-end'}, [
                          h(UButton, {
                            loading: deleteJobApplicationMutation.isLoading.value,
                            label: 'Delete',
                            color: 'error',
                            onClick: () => {
                              deleteJobApplication(row.original.id)
                            }
                          })
                        ])
                      ])
                }
            )
          ]
      )
    }
  },
]
</script>

<template>
  <div class="flex justify-end">
    <CreateJobApplicationModal/>
  </div>
  <UCard variant="soft">
    <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:global-filter="globalFilter"
        :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
        :data="jobApplications" :loading="jobApplicationsQuery.isLoading.value" :columns="columns">
      <template #empty>
        <UEmpty
            title="No job applications found"
            description="It looks like you haven't added any job applications. Create one to get started."
        />
      </template>

    </UTable>
    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
          :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p:any) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </UCard>
  <EditJobApplicationModal
      v-model:open="open"
      :job-application="jobApplication"
  />
</template>