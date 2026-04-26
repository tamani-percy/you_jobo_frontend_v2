import {useQuery} from "@pinia/colada";
import {getAllCompanies} from "@/api/services/CompanyService.ts";
import {computed} from "vue";


export function useCompanies() {
    const companiesQuery = useQuery({
        key: ['companies'],
        query: getAllCompanies,
    })

    return {
        companies: computed(() => companiesQuery.data.value ?? []),
        companiesQuery
    }
}
