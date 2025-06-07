import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Documento } from '@/modules/administracion/modulos/notacredito/interfaces/interfaces';
import { useNotaCreditoStore } from '@/stores/administracion/modulos/notascredito';

const getRegistros = async(page: number, buscar:string = ''):Promise<Documento[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`AdmNotaCredito/paginado?page=${page}&buscar=${buscar}&tipo=NotaCredito`,null);
    const registrosdata: Documento[] = data.items
    const storeint = useNotaCreditoStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useNotasCredito = () => {

    const store = useNotaCreditoStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['notascredito?page=',currentPage,'?buscar=',currentBuscar],
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

export default useNotasCredito;