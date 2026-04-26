<script setup lang="ts">
import {reactive, ref} from 'vue'
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {ContactPersonRoles} from "@/api/data/ContactPersonRoles.ts";
import type {ContactPersonRequest} from "@/api/interfaces/contact.person.interfaces.ts";
import {useContactPersons} from "@/composables/useContactPersons.ts";

const props = defineProps<{
  jobApplicationId: number
}>()


const {
  createJobApplicationContactPersonMutation,
  createJobApplicationContactPerson
} = useContactPersons(props.jobApplicationId)

const open = ref(false)
const form = ref()

const schema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),

  email: z
      .union([
        z.literal(''),
        z.email('Enter a valid email')
      ])
      .optional(),

  phone: z.string().optional(),

  linkedinUrl: z
      .union([
        z.literal(''),
        z.string().trim().url('Enter a valid LinkedIn URL')
      ])
      .optional(),

  notes: z.string().trim().min(1, 'Notes are required'),

  role: z.string().trim().min(1, 'Role is required')
})

type FormState = z.output<typeof schema>

const state = reactive<FormState>({
  fullName: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  notes: '',
  role: ''
})

async function onSubmit(event: FormSubmitEvent<FormState>) {
  const contactPersonRequest: ContactPersonRequest = {
    jobApplicationId: props.jobApplicationId,
    role: event.data.role,
    fullName: event.data.fullName,
    email: event.data?.email,
    phone: event.data?.phone,
    notes: event.data.notes,
    linkedinUrl: event.data?.linkedinUrl
  }
  createJobApplicationContactPerson(contactPersonRequest)
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="Add contact">
    <UButton label="Add Contact" color="secondary" variant="subtle"/>

    <template #body>
      <UForm
          ref="form"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
      >
        <UFormField label="Full name" name="fullName" required>
          <UInput
              v-model="state.fullName"
              class="w-full"
              placeholder="Enter full name"
          />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput
              v-model="state.email"
              class="w-full"
              placeholder="Enter email"
          />
        </UFormField>

        <UFormField label="Phone" name="phone">
          <UInput
              v-model="state.phone"
              class="w-full"
              placeholder="Enter phone number"
          />
        </UFormField>

        <UFormField label="LinkedIn URL" name="linkedinUrl">
          <UInput
              v-model="state.linkedinUrl"
              class="w-full"
              placeholder="https://linkedin.com/in/username"
          />
        </UFormField>

        <UFormField label="Notes" name="notes" required>
          <UTextarea
              v-model="state.notes"
              :rows="5"
              class="w-full"
              placeholder="Enter notes"
          />
        </UFormField>

        <UFormField label="Role" name="role" required>
          <USelect
              v-model="state.role"
              :items="ContactPersonRoles"
              class="w-full"
              placeholder="Select role"
          />
        </UFormField>

        <div class="flex justify-end">
          <UButton type="submit" :loading="createJobApplicationContactPersonMutation.isLoading.value">
            Save
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped>
</style>