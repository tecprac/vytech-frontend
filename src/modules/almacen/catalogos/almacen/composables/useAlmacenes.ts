import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Almacen } from '../interfaces/interfaces';
import { useAlmacenStore } from '@/stores/almacen/catalogos/almacen';

const getRegistros = async(page: number, buscar:string = ''):Promise<Almacen[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`InvAlmacen/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Almacen[] = data.items
    const storeint = useAlmacenStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useAlmacenes = () => {

    const store = useAlmacenStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['almacenes?page=',currentPage,'?buscar=',currentBuscar],
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

export default useAlmacenes;