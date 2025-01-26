import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Cliente } from '../interfaces/interfaces';
import { useClientesStore } from '@/stores/administracion/catalogos/clientes';

const getRegistros = async(page: number, buscar:string = ''):Promise<Cliente[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`AdmClientes/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Cliente[] = data.items
    const storeint = useClientesStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useClientes = () => {

    const store = useClientesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['clientes?page=',currentPage,'?buscar=',currentBuscar],
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

export default useClientes;