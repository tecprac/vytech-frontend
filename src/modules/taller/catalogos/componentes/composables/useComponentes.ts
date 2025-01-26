import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Componente } from '../interfaces/interfaces';
import { useComponentesStore } from '@/stores/taller/catalogos/componentes';

const getRegistros = async(page: number, buscar:string = ''):Promise<Componente[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Componentes/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Componente[] = data.items
    const storeint = useComponentesStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useComponentes = () => {

    const store = useComponentesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['componentes?page=',currentPage,'?buscar=',currentBuscar],
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

export default useComponentes;