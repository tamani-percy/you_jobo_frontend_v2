<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import {computed, onMounted} from "vue";
import type {ApexOptions} from "apexcharts";
import {useTheme} from "@/composables/useTheme.ts";
import {useDashboardStats} from "@/composables/useDashboardStats.ts";

const { isDark } = useTheme();
const {
  onFetchDashboardStats,
  jobApplicationJobStatusCount,
  isDashboardStatsLoading
} = useDashboardStats();

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: {
      show: false,
    },
  },
  labels: Object.keys(jobApplicationJobStatusCount.value),
  legend: {
    position: "bottom",
  },
  colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
  dataLabels: {
    enabled: true,
  },
}));

const series = computed<number[]>(() =>
    Object.values(jobApplicationJobStatusCount.value)
);

onMounted(() => {
  onFetchDashboardStats();
});

</script>

<template>

 <UCard variant="subtle" class="mt-5">
   <template #header>
     <h1>Job Status Breakdown</h1>
   </template>
   <UProgress v-if="isDashboardStatsLoading"/>
   <VueApexCharts
       v-else
       height="280"
       type="pie"
       :options="chartOptions"
       :series="series"
   />
 </UCard>
</template>