import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Modulo } from "@/modules/configuracion/modulos/interfaces/modulo";
import { useModulosStore } from '@/stores/configuracion/modulos';


const getRegistros = async(page: number, buscar:string = ''):Promise<Modulo[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Modulos/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Modulo[] = data.items
    const storeint = useModulosStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useModulos = () => {

    const store = useModulosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['modulos?page=',currentPage,'?buscar=',currentBuscar],
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

export default useModulos;