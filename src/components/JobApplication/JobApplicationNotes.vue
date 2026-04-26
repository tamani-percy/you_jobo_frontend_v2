<script setup lang="ts">
import SplitText from "@/component/SplitText/SplitText.vue";
import {useNotes} from "@/composables/useNotes.ts";
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import EditJobApplicationNoteModal from "@/components/JobApplication/modals/EditJobApplicationNoteModal.vue";

const props = defineProps<{
  jobApplicationId: number
}>()

const {
  deleteJobApplicationNoteMutation,
  deleteJobApplicationNote,
  jobApplicationNotesQuery,
  jobApplicationNotes
} = useNotes(props.jobApplicationId)
</script>

<template>
  <UCard variant="outline" class="mt-2">
    <div class="flex justify-between mb-10">
      <div class="inline-flex items-center">
        <UIcon name="i-lucide-notebook-pen" :size="20"/>&nbsp;
        <SplitText
            text="NOTES"
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
      <CreateJobApplicationNoteModal :jobApplicationId="jobApplicationId"/>
    </div>
    <h1 v-if="jobApplicationNotesQuery.isLoading.value">Loading</h1>
    <div v-else>
      <div v-if="jobApplicationNotes.length > 0" class="w-full flex flex-col">
        <UCard v-for="note in jobApplicationNotes" :key="note.id" variant="soft">
          <template #header>
            <div class="flex justify-between">
              <UFieldGroup orientation="horizontal">
                <UTooltip arrow text="Created At" :delay-duration="0">
                  <UBadge icon="i-lucide-clock" variant="subtle" :label="formatLocalDateTime(note.createdAt)"/>
                </UTooltip>
                <UTooltip arrow text="Updated At" :delay-duration="0">
                  <UBadge icon="i-lucide-clock-plus" color="warning" variant="subtle"
                          :label="formatLocalDateTime(note.updatedAt)"/>
                </UTooltip>
              </UFieldGroup>
              <div>
                <EditJobApplicationNoteModal :note="note"/>
                <UButton :loading="deleteJobApplicationNoteMutation.isLoading.value" icon="i-lucide-trash" color="error"
                         @click="deleteJobApplicationNote(note.id)"/>
              </div>
            </div>

          </template>
          <p>{{ note.content }}</p>

        </UCard>
      </div>
      <div v-else>
        <UEmpty
            icon="i-lucide-notebook-pen"
            title="No notes found"
            description="It looks like you haven't added any notes. Create one to get started."
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped>

</style>