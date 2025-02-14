import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Orden } from '../interfaces/interfaces';
import { useOrdenesStore } from '@/stores/taller/modulos/ordenes';

const getRegistros = async(page: number, buscar:string = ''):Promise<Orden[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`orden/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Orden[] = data.items
    const storeint = useOrdenesStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useOrdenes = () => {

    const store = useOrdenesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['ordenes?page=',currentPage,'?buscar=',currentBuscar],
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

export default useOrdenes;