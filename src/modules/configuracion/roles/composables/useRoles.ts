import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Rol } from "@/modules/configuracion/roles/interfaces/rol";
import { useRolesStore } from '@/stores/configuracion/roles';


const getRoles = async(page: number, buscar:string = ''):Promise<Rol[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Roles/paginado?page=${page}&buscar=${buscar}`,null);
    const rolesdata: Rol[] = data.items
    const storeint = useRolesStore();
    storeint.setPaginas(data.totalPages);
    return rolesdata;
}

const useRoles = () => {

    const store = useRolesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['roles?page=',currentPage,'?buscar=',currentBuscar],
        queryFn:    async () => getRoles(currentPage.value,currentBuscar.value),
        gcTime:     0,
        staleTime:  0,
        retry:      false,
    });

    watch(data,roles => {
        if(roles) {
            store.setRoles(roles);
        }
    },{immediate: true});

    return {
        //Properties
        isPending,
        registros,
        currentPage,
        totalPages,
        currentBuscar,

        // Methods
        getPage( page: number) {
            store.setPage( page )
        },
        getBuscar( buscar: string ) {
            store.setBuscar( buscar)
        },

        // Getters
        
    }
}

export default useRoles;