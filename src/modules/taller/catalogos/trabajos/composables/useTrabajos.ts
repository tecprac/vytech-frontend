import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Trabajo } from '../interfaces/interfaces';
import { useTrabajosStore } from '@/stores/taller/catalogos/trabajos';

const getRegistros = async(page: number, buscar:string = ''):Promise<Trabajo[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Trabajos/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Trabajo[] = data.items
    const storeint = useTrabajosStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useTrabajos = () => {

    const store = useTrabajosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['trabajos?page=',currentPage,'?buscar=',currentBuscar],
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

export default useTrabajos;