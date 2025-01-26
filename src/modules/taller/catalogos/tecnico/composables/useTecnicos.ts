import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Tecnico } from '../interfaces/interfaces';
import { useTecnicosStore } from '@/stores/taller/catalogos/tecnicos';

const getRegistros = async(page: number, buscar:string = ''):Promise<Tecnico[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Tecnicos/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Tecnico[] = data.items
    const storeint = useTecnicosStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useTecnicos = () => {

    const store = useTecnicosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['tecnicos?page=',currentPage,'?buscar=',currentBuscar],
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

export default useTecnicos;