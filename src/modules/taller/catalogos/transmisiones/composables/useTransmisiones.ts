import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Transmision } from '../interfaces/interfaces';
import { useTransmisionesStore } from '@/stores/taller/catalogos/transmisiones';

const getRegistros = async(page: number, buscar:string = ''):Promise<Transmision[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Transmisiones/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Transmision[] = data.items
    const storeint = useTransmisionesStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useModelos = () => {

    const store = useTransmisionesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['transmisiones?page=',currentPage,'?buscar=',currentBuscar],
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