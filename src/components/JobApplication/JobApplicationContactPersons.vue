<script setup lang="ts">
import SplitText from "@/component/SplitText/SplitText.vue";
import {useContactPersons} from "@/composables/useContactPersons.ts";
import CreateJobApplicationContactPersonModal
  from "@/components/JobApplication/modals/CreateJobApplicationContactPersonModal.vue";

const props = defineProps<{
  jobApplicationId: number
}>()

const {
  jobApplicationContactPersonsQuery,
  jobApplicationContactPersons,
  deleteJobApplicationContactPersonMutation,
  deleteJobApplicationContactPerson
} = useContactPersons(props.jobApplicationId)

console.log(jobApplicationContactPersons.value)
</script>

<template>
  <div class="flex justify-between mb-10">
    <div class="inline-flex items-center">
      <UIcon name="i-lucide-users" :size="20"/>&nbsp;
      <SplitText
          text="CONTACT PERSONS"
          class-name="text-xl font-semibold text-center"
          :delay="100"
          :duration="0.6"
          ease="power3.out"
          split-type="chars"
          :from="{ opacity: 0, y: 40 }"
          :to="{ opacity: 1, y: 0 }"
          :threshold="0.1"
          root-margin="-100px"
          text-align="center"
      />
    </div>
    <CreateJobApplicationContactPersonModal :jobApplicationId="jobApplicationId"/>
  </div>
  <h1 v-if="jobApplicationContactPersonsQuery.isLoading.value">Loading</h1>
  <div v-else>
    <div v-if="jobApplicationContactPersons.length > 0" class="w-full">
      <UPopover v-for="person in jobApplicationContactPersons" :key="person.id" mode="hover" class="">
        <UButton icon="i-lucide-circle-user" color="warning" variant="solid" size="xl" class=""/>&nbsp;

        <template #content>
          <div class="p-5 flex justify-center items-center flex-col">
            <h1 class="font-bold">{{ person.fullName }}</h1>
            <p>v{{ person.email }}</p>
            <p>{{ person.phone }}</p>
            <ULink :href="person.linkedinUrl" target="_blank" class="inline-flex items-center">
              LINKEDIN&nbsp;<UIcon name="i-lucide-link"/>
            </ULink>
            <USeparator class="my-4"/>
            <p>{{ person.notes }}</p>
            <USeparator class="my-4"/>
            <div class="mt-2">
              <UButton :loading="deleteJobApplicationContactPersonMutation.isLoading.value" icon="i-lucide-trash"
                       color="error" @click="deleteJobApplicationContactPerson(person.id)"/>
            </div>
          </div>
        </template>
      </UPopover>
    </div>
    <div v-else>
      <UEmpty
          icon="i-lucide-file"
          title="No contact persons found"
          description="It looks like you haven't added any contact persons. Create one to get started."
      />
    </div>
  </div>
</template>

<style scoped>

</style>