import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Permiso } from "@/modules/configuracion/permisos/interfaces/permiso";
import { usePermisosStore } from '@/stores/configuracion/permisos';


const getRegistros = async(page: number, buscar:string = ''):Promise<Permiso[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Permisos/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Permiso[] = data.items
    const storeint = usePermisosStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const usePermisos = () => {

    const store = usePermisosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['permisos?page=',currentPage,'?buscar=',currentBuscar],
        queryFn:    async () => getRegistros(currentPage.value,currentBuscar.value),
        gcTime:     0,
        staleTime:  0,
        retry:      false,
    });

    watch(data,registros => {
        if(registros) {
            store.setRegistros(registros);
        }
    },{immediate: true});

    return {
        //Properties
        isPending,
        isError,
        isSuccess,
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

export default usePermisos;