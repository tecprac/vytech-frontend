import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Bahia } from '../interfaces/interfaces';
import { useBahiasStore } from '@/stores/taller/catalogos/bahias';

const getRegistros = async(page: number, buscar:string = ''):Promise<Bahia[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Bahias/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Bahia[] = data.items
    const storeint = useBahiasStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useBahias = () => {

    const store = useBahiasStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['bahias?page=',currentPage,'?buscar=',currentBuscar],
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

export default useBahias;