import {useMutation, useQuery, useQueryCache} from "@pinia/colada";
import {
    createNote,
    deleteNoteById,
    getAllNotes,
    getNotesByJobApplicationId,
    updateNote
} from "@/api/services/NoteService.ts";
import {computed} from "vue";
import type {NoteRequest, NoteResponse} from "@/api/interfaces/note.interfaces.ts";

export function useNotes(jobApplicationId?: number) {
    const toast = useToast()
    const queryCache = useQueryCache()

    const notesQuery = useQuery({
        key: () => ['notes'],
        query: (): Promise<NoteResponse[]> => getAllNotes()
    })

    const jobApplicationNotesQuery = useQuery({
        key: () => ['job-application-notes', jobApplicationId ?? null],
        enabled: computed(() => !!jobApplicationId),
        query: (): Promise<NoteResponse[]> => getNotesByJobApplicationId(jobApplicationId as number)
    })

    const deleteJobApplicationNoteMutation = useMutation({
        mutation: (id: number) => deleteNoteById(id),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-notes']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted note successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const createJobApplicationNoteMutation = useMutation({
        mutation: (noteRequest: NoteRequest) => createNote(noteRequest),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-notes']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Created note successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    const updateJobApplicationNoteMutation = useMutation({
        mutation: (payload: NoteRequest) => updateNote(payload),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-notes']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Updated job application note successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        }
    })

    return {
        jobApplicationNotes: computed(() => jobApplicationNotesQuery.data.value ?? []),
        jobApplicationNotesQuery,

        createJobApplicationNote: createJobApplicationNoteMutation.mutate,
        createJobApplicationNoteMutation,

        updateJobApplicationNote: updateJobApplicationNoteMutation.mutate,
        updateJobApplicationNoteMutation,

        deleteJobApplicationNote: deleteJobApplicationNoteMutation.mutate,
        deleteJobApplicationNoteMutation,

        notes: computed(() => notesQuery.data.value ?? []),
        notesQuery
    }

}