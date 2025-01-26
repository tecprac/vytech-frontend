import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Modelo } from '../interfaces/modelo';
import { useModelosStore } from '@/stores/taller/catalogos/modelos';

const getRegistros = async(page: number, buscar:string = ''):Promise<Modelo[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Modelos/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Modelo[] = data.items
    const storeint = useModelosStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useModelos = () => {

    const store = useModelosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['modelos?page=',currentPage,'?buscar=',currentBuscar],
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

export default useModelos;