<script setup lang="ts">
import {reactive, ref} from "vue"
import * as z from "zod"
import type {FormSubmitEvent} from "@nuxt/ui";
import type {DocumentRequest} from "@/api/interfaces/document.interfaces.ts";
import {useNotes} from "@/composables/useNotes.ts";
import type {NoteRequest} from "@/api/interfaces/note.interfaces.ts";

const props = defineProps<{
  jobApplicationId: number
}>()

const {createJobApplicationNoteMutation, createJobApplicationNote} = useNotes(props.jobApplicationId)

const open = ref(false)

const schema = z.object({
  notes: z.string().min(1, "Notes is required")
})

type Schema = z.output<typeof schema>


const state = reactive({
  notes: ""
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const noteRequest: NoteRequest = {
    jobApplicationId: props.jobApplicationId,
    content: event.data.notes
  }
  createJobApplicationNote(noteRequest)
  open.value = false
  state.notes = ""
}
</script>

<template>
  <UModal v-model:open="open" title="Add Note">
    <UButton label="Add Note" color="secondary" variant="subtle"/>

    <template #body>
      <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
      >
        <UFormField label="Notes" name="notes" required>
          <UTextarea
              v-model="state.notes"
              class="w-full"
              placeholder="Enter notes"
              :rows="5"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
              label="Cancel"
              color="neutral"
              variant="soft"
              @click="open = false"
          />
          <UButton
              :loading="createJobApplicationNoteMutation.isLoading.value"
              type="submit"
              label="Save"
              color="primary"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped>
</style>