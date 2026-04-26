import type {CompanyResponse} from "@/api/interfaces/company.interfaces.ts";
import type {AxiosResponse} from "axios";
import axiosInstance from "@/api/axiosInstance/axiosInstance.ts";

export const getAllCompanies = async():Promise<CompanyResponse[]> => {
    const response:AxiosResponse<CompanyResponse[]> = await axiosInstance.get("companies/all")
    return response.data
}