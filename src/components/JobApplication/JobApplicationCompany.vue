<script setup lang="ts">
import type {CompanyResponse} from "@/api/interfaces/company.interfaces.ts";

defineProps<{
  company: CompanyResponse
}>()

</script>

<template>
  <h1 class="font-bold text-xl inline-flex items-center">
    <UIcon name="i-lucide-building"/>&nbsp;COMPANY DETAILS&nbsp;
    <ULink target="_blank" variant="link" :href="company.website"><UIcon name="i-lucide-link" class="text-green-400 text-xl"/></ULink>
  </h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 my-5">
    <div>
      <p class="text-gray-400">INDUSTRY</p>
      <h2 class="text-lg font-medium">{{ company.industry }}</h2>
    </div>
    <div>
      <p class="text-gray-400">LOCATION</p>
      <h2 class="text-lg font-medium">{{ company.location }}</h2>
    </div>
  </div>
  <div>
    <p class="text-gray-400">DESCRIPTION</p>
    <h2 class="text-lg font-medium">{{ company.description }}</h2>
  </div>
</template>

<style scoped>

</style>