import {useMutation, useQuery, useQueryCache} from "@pinia/colada";
import {computed, type Ref, ref} from "vue";
import {
    createDocument,
    deleteDocumentById,
    downloadFile,
    getAllDocuments,
    getDocumentsByJobApplicationId,
    updateDocument
} from "@/api/services/DocumentService.ts";
import type {DocumentRequest, DocumentResponse} from "@/api/interfaces/document.interfaces.ts";

export function useDocuments(jobApplicationId?: number) {
    const toast = useToast()
    const queryCache = useQueryCache()
    const uploadProgress = ref(0)
    const downloadingFileName: Ref<string | null> = ref(null)

    const downloadJobApplicationDocument = async (fileName: string, fileKey:string) => {
        try {
            downloadingFileName.value = fileName

            const res = await downloadFile(fileName)

            let newFileName = fileKey

            const disposition = res.headers['content-disposition']
            if (disposition) {
                const match = disposition.match(/filename="(.+)"/)
                if (match?.[1]) {
                    newFileName = match[1]
                }
            }

            const url = window.URL.createObjectURL(res.data)

            const a = document.createElement('a')
            a.href = url
            a.download = newFileName
            document.body.appendChild(a)
            a.click()
            a.remove()

            window.URL.revokeObjectURL(url)
        } catch (e) {
            console.error('Failed to download document', e)
        } finally {
            downloadingFileName.value = null
        }
    }

    const documentsQuery = useQuery({
        key: () => ['documents'],
        query: ():Promise<DocumentResponse[]> => getAllDocuments()
    })


    const jobApplicationDocumentsQuery = useQuery({
        key: () => ['job-application-documents', jobApplicationId ?? null],
        query: ():Promise<DocumentResponse[]> => getDocumentsByJobApplicationId(jobApplicationId as number),
        enabled: computed(() => !!jobApplicationId),
    })

    const deleteJobApplicationDocumentMutation = useMutation({
        mutation: (id: number) => deleteDocumentById(id),
        onSuccess: async () => {
            await queryCache.invalidateQueries({key: ['job-application-documents']})
            toast.add({
                title: 'Yaaay!!',
                description: 'Deleted document successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        },
    })


    const createJobApplicationDocumentMutation = useMutation({
        //@ts-ignore
        mutation: async ({request, file, replaceDocument}) => {
            uploadProgress.value = 0

            if (replaceDocument) {
                return await updateDocument(request, file, (progress) => {
                    uploadProgress.value = progress
                })
            } else {
                return await createDocument(request, file, (progress) => {
                    uploadProgress.value = progress
                })
            }
        },
        onSuccess: async () => {
            uploadProgress.value = 0
            await queryCache.invalidateQueries({key: ['job-application-documents', jobApplicationId ?? null]})
            toast.add({
                title: 'Yaaay!!',
                description: 'Document added successfully.',
                icon: 'i-lucide-check',
                color: 'success'
            })
        },
        onError: () => {
            uploadProgress.value = 0
        },
    })

    return {
        jobApplicationDocuments: computed(() => jobApplicationDocumentsQuery.data.value ?? []),
        jobApplicationDocumentsQuery,

        createJobApplicationDocument: createJobApplicationDocumentMutation.mutate,
        createJobApplicationDocumentMutation,
        uploadProgress,

        deleteJobApplicationDocument: deleteJobApplicationDocumentMutation.mutate,
        deleteJobApplicationDocumentMutation,

        documents: computed(() => documentsQuery.data.value ?? []),
        documentsQuery,

        downloadJobApplicationDocument,
    }
}