<script setup lang="ts">
import {JobApplicationStatus} from "@/api/data/JobApplicationStatuses.ts";
import {useJobApplications} from "@/composables/useJobApplications.ts";

const {updateJobApplicationStatus} = useJobApplications()

defineProps<{
  jobApplicationId: number
}>()
</script>

<template>
  <UDropdownMenu
      :items="JobApplicationStatus"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
  >
    <template #item-label="{item}">
      <h1 class="inline-flex items-center"
          @click="updateJobApplicationStatus({jobApplicationId:jobApplicationId,status:item.label})">
        <UIcon name="i-lucide-badge-check"/>&nbsp;{{ item.label }}
      </h1>
    </template>
    <UButton size="lg" label="UPDATE STATUS" color="info" variant="soft"/>
  </UDropdownMenu>
</template>

<style scoped>

</style>