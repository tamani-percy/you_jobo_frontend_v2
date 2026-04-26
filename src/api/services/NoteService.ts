import type {AxiosResponse} from "axios";
import axiosInstance from "@/api/axiosInstance/axiosInstance.ts";
import type {NoteRequest, NoteResponse} from "@/api/interfaces/note.interfaces.ts";

export const getAllNotes = async (): Promise<NoteResponse[]> => {
    const res: AxiosResponse<NoteResponse[]> = await axiosInstance.get(`notes/all`)
    return res.data
}

export const getNoteById = async (id: number): Promise<NoteResponse> => {
    const res: AxiosResponse<NoteResponse> = await axiosInstance.get(`notes/${id}`)
    return res.data
}

export const createNote = async (noteRequest: NoteRequest): Promise<NoteResponse> => {
    const res: AxiosResponse<NoteResponse> = await axiosInstance.post(`notes`, noteRequest)
    return res.data
}

export const updateNote = async (noteRequest: NoteRequest): Promise<NoteResponse> => {
    const res: AxiosResponse<NoteResponse> = await axiosInstance.patch(`notes`, noteRequest)
    return res.data
}

export const deleteNoteById = async (id: number): Promise<boolean> => {
    const res: AxiosResponse<boolean> = await axiosInstance.delete(`notes/${id}`)
    return res.data
}

export const getNotesByJobApplicationId = async (id: number): Promise<NoteResponse[]> => {
    const res: AxiosResponse<NoteResponse[]> = await axiosInstance.get(`notes/job-application/${id}`,)
    return res.data
}