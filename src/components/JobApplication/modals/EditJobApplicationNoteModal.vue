<script setup lang="ts">
import {reactive, ref} from "vue"
import * as z from "zod"
import type {FormSubmitEvent} from "@nuxt/ui";
import {useNotes} from "@/composables/useNotes.ts";
import type {NoteRequest, NoteResponse} from "@/api/interfaces/note.interfaces.ts";

const props = defineProps<{
  note: NoteResponse
}>()

const {updateJobApplicationNote, updateJobApplicationNoteMutation} = useNotes()

const open = ref(false)

const schema = z.object({
  notes: z.string().min(1, "Notes is required")
})

type Schema = z.output<typeof schema>


const state = reactive({
  notes: props.note.content
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const noteRequest: NoteRequest = {
    id: props.note.id,
    jobApplicationId: props.note.jobApplicationId,
    content: event.data.notes
  }
  updateJobApplicationNote(noteRequest)
  open.value = false
  state.notes = ""
}
</script>

<template>
  <UModal v-model:open="open" title="Add Note">
    <UButton icon="i-lucide-pencil" color="info" variant="outline"/> &nbsp;

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
              :loading="updateJobApplicationNoteMutation.isLoading.value"
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