import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Agente } from '../interfaces/interfaces';
import { useAgentesStore } from '@/stores/administracion/catalogos/agentes';

const getRegistros = async(page: number, buscar:string = ''):Promise<Agente[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`AdmAgente/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Agente[] = data.items
    const storeint = useAgentesStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useAgentes = () => {

    const store = useAgentesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['agentes?page=',currentPage,'?buscar=',currentBuscar],
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

export default useAgentes;