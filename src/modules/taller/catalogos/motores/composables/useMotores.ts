import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Motor } from '../interfaces/interfaces';
import { useMotoresStore } from '@/stores/taller/catalogos/motores';

const getRegistros = async(page: number, buscar:string = ''):Promise<Motor[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Motores/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Motor[] = data.items
    const storeint = useMotoresStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useMotores = () => {

    const store = useMotoresStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['motores?page=',currentPage,'?buscar=',currentBuscar],
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

export default useMotores;