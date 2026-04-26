import {useMutation, useQuery, useQueryCache} from "@pinia/colada";
import type {ContactPersonRequest, ContactPersonResponse} from "@/api/interfaces/contact.person.interfaces.ts";
import {
    createContactPerson,
    deleteContactPersonById, getAllContactPersons,
    getContactPersonsByJobApplicationId
} from "@/api/services/ContactPersonService.ts";
import {computed} from "vue";

export function useContactPersons(jobApplicationId?: number) {
    const toast = useToast()
    const queryCache = useQueryCache()

    const contactPersonsQuery = useQuery({
        key: () => ['contact-persons'],
        query: () :Promise<ContactPersonResponse[]> => getAllContactPersons()
    })

    const jobApplicationContactPersonsQuery = useQuery({
        key: () => ['job-application-contact-persons', jobApplicationId ?? null],
        query: ():Promise<ContactPersonResponse[]> => getContactPersonsByJobApplicationId(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const createJobApplicationContactPersonMutation = useMutation({
        mutation: (payload: ContactPersonRequest) => createContactPerson(payload),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-contact-persons']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Created contact person successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const deleteJobApplicationContactPersonMutation = useMutation({
        mutation: (id: number) => deleteContactPersonById(id),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-contact-persons']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted contact person successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    return {
        jobApplicationContactPersons: computed(() => jobApplicationContactPersonsQuery.data.value ?? []),
        jobApplicationContactPersonsQuery,

        createJobApplicationContactPerson: createJobApplicationContactPersonMutation.mutate,
        createJobApplicationContactPersonMutation,

        deleteJobApplicationContactPerson: deleteJobApplicationContactPersonMutation.mutate,
        deleteJobApplicationContactPersonMutation,

        contactPersons: computed(() => contactPersonsQuery.data.value ?? []),
        contactPersonsQuery
    }
}