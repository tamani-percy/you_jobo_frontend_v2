<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import type {AccordionItem} from "@nuxt/ui/components/Accordion.vue";
import {onMounted, ref} from "vue";
import {useDashboardStats} from "@/composables/useDashboardStats.ts";
const active = ref('0')
const items = [
  {
    label: 'General Stats',
    icon: 'i-lucide-chart-candlestick',
    slot: 'general_stats' as const,
    content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
  },
  {
    label: 'Insights',
    icon: 'i-lucide-eye',
    slot: 'insights' as const,
    content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
  }
] satisfies AccordionItem[]


const {
  onFetchDashboardStats,
  jobApplicationCount,
  interviewsCount,
  jobApplicationsCountByJobStatusActive,
  jobApplicationsCountByJobStatusOffers,
  jobApplicationsInterviewRate,
  jobApplicationsOfferRate,
  jobApplicationsSuccessRate,
  jobApplicationsResponseRate,
} = useDashboardStats()


onMounted(() => {
  onFetchDashboardStats()
})
</script>

<template>
  <UCard variant="outline">
    <UAccordion  :items="items" v-model="active">
      <template #general_stats="{ item }">
        <div class="flex md:flex-row flex-col flex-wrap gap-10 my-10 px-2">
          <UCard class="w-full md:w-[300px]" variant="outline">
            <template #header>
              <UBadge color="neutral" icon="i-lucide-list-plus" size="xl">TOTAL APPLICATIONS</UBadge>
            </template>
            <NumberFlow :value="jobApplicationCount"/>
          </UCard>
          <UCard class="w-full md:w-[300px]" variant="outline">
            <template #header>
              <UBadge color="neutral" icon="i-lucide-activity" size="xl">ACTIVE APPLICATIONS</UBadge>
            </template>
            <NumberFlow :value="jobApplicationsCountByJobStatusActive"/>
          </UCard>
          <UCard class="w-full md:w-[300px]" variant="outline">
            <template #header>
              <UBadge color="neutral" icon="i-lucide-hand-helping" size="xl">OFFERS</UBadge>
            </template>
            <NumberFlow :value="jobApplicationsCountByJobStatusOffers"/>
          </UCard>
          <UCard class="w-full md:w-[300px]" variant="outline">
            <template #header>
              <UBadge color="neutral" icon="i-lucide-volume-2" size="xl">INTERVIEWS</UBadge>
            </template>
            <NumberFlow :value="interviewsCount"/>
          </UCard>
        </div>
      </template>
      <template #insights="{ item }">
        <div class="flex md:flex-row flex-col flex-wrap gap-10 my-10 px-2">
          <UCard class="w-full md:w-[300px]" variant="outline">
            <template #header>
              <UBadge color="neutral" icon="i-lucide-volume" size="xl">INTERVIEW RATE</UBadge>
            </template>
            <NumberFlow suffix="%" :value="jobApplicationsInterviewRate"/>
          </UCard>
          <UCard class="w-full md:w-[300px]" variant="outline">
            <template #header>
              <UBadge color="neutral" icon="i-lucide-hand-coins" size="xl">OFFER RATE</UBadge>
            </template>
            <NumberFlow suffix="%" :value="jobApplicationsOfferRate"/>
          </UCard>
          <UCard class="w-full md:w-[300px]" variant="outline">
            <template #header>
              <UBadge color="neutral" icon="i-lucide-badge-check" size="xl">SUCCESS RATE</UBadge>
            </template>
            <NumberFlow suffix="%" :value="jobApplicationsSuccessRate"/>
          </UCard>
          <UCard class="w-full md:w-[300px]" variant="outline">
            <template #header>
              <UBadge color="neutral" icon="i-lucide-mail-check" size="xl">RESPONSE RATE</UBadge>
            </template>
            <NumberFlow suffix="%" :value="jobApplicationsResponseRate"/>
          </UCard>
        </div>
      </template>
    </UAccordion>
  </UCard>
</template>

<style scoped>

</style>