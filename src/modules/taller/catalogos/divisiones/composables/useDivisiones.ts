import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Division } from '../interfaces/interfaces';
import { useDivisionesStore } from '@/stores/taller/catalogos/divisiones';

const getRegistros = async(page: number, buscar:string = ''):Promise<Division[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Divisiones/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Division[] = data.items
    const storeint = useDivisionesStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useMarcas = () => {

    const store = useDivisionesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['divisiones?page=',currentPage,'?buscar=',currentBuscar],
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

export default useMarcas;