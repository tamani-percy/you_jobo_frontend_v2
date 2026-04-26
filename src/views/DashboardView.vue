<script setup lang="ts">
import type {ButtonProps} from '@nuxt/ui'
import {ref} from "vue";
import {useDashboardStats} from "@/composables/useDashboardStats.ts";

const actions = ref<ButtonProps[]>([
  {
    label: 'View',
    variant: 'outline',
    trailingIcon: 'i-lucide-arrow-right',
    onClick() {
      open.value = true
    }
  }
])

const {dailyFocusQuery, dailyFocus} = useDashboardStats()

const open = ref(false)
</script>

<template>
  <UBanner v-if="dailyFocus.length > 0" close color="info" class="rounded-lg mb-5"
           title="Daily focus list ranked by focus score, deadline urgency & application status."
           :actions="actions"/>

  <OverviewCards/>
  <JobStatusBreakdownChart/>

  <USlideover v-model:open="open"
              title="Daily focus"
              description="Your daily focus list ranked by focus score, deadline urgency & application status."
  >

    <template #body>
      <UProgress v-if="dailyFocusQuery.isLoading.value"/>
      <div v-else>
        <UCard class="mb-5" variant="soft" v-for="foc in dailyFocus" :key="foc.jobApplicationResponse.id">
          <template #header>
            <div class="flex justify-between">
              <UFieldGroup orientation="horizontal">
                <UTooltip arrow text="Company" :delay-duration="0">
                  <UBadge icon="i-lucide-building" variant="subtle" color="neutral" size="sm"
                          :label="foc.jobApplicationResponse.company.name"/>
                </UTooltip>
                <UTooltip arrow text="Status" :delay-duration="0">
                  <UBadge icon="i-lucide-route" variant="subtle" color="success" size="sm"
                          :label="foc.jobApplicationResponse.status"/>
                </UTooltip>
              </UFieldGroup>
              <UTooltip arrow text="Focus Score" :delay-duration="0">
                <UBadge icon="i-lucide-brain" variant="solid" color="warning" class="font-bold" size="lg"
                        :label="`${foc.score.toFixed()}%`"/>
              </UTooltip>
            </div>
          </template>
          <TextReveal class="text-2xl leading-relaxed font-semibold">
            {{ foc.jobApplicationResponse.title }}
          </TextReveal>
          <template #footer>
            <ULink :to="`/job-applications/${foc.jobApplicationResponse.id}`" class="inline-flex items-center">
              <span>View&nbsp;</span>
              <UIcon name="i-lucide-eye"/>
            </ULink>
          </template>
        </UCard>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>

</style>