import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Documento } from '../interfaces/interfaces';
import { usePagosStore } from '@/stores/administracion/modulos/pagos';

const getRegistros = async(page: number, buscar:string = ''):Promise<Documento[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`AdmPago/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Documento[] = data.items
    const storeint = usePagosStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const usePagos = () => {

    const store = usePagosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['pagos?page=',currentPage,'?buscar=',currentBuscar],
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

export default usePagos;