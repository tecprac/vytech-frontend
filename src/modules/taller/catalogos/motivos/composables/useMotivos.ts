import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Motivo } from '../interfaces/interfaces';
import { useMotivoStore } from '@/stores/taller/catalogos/motivo';

const getRegistros = async(page: number, buscar:string = ''):Promise<Motivo[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Motivo/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Motivo[] = data.items
    const storeint = useMotivoStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useMotivos = () => {

    const store = useMotivoStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['motivos?page=',currentPage,'?buscar=',currentBuscar],
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

export default useMotivos;