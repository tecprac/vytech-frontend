import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Unidad } from '../interfaces/interfaces';
import { useUnidadesStore } from '@/stores/taller/catalogos/unidades';

const getRegistros = async(page: number, buscar:string = ''):Promise<Unidad[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Unidades/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Unidad[] = data.items
    const storeint = useUnidadesStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useUnidades = () => {

    const store = useUnidadesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['unidades?page=',currentPage,'?buscar=',currentBuscar],
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

export default useUnidades;