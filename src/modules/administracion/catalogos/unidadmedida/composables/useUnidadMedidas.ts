import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { UnidadMedida } from '../interfaces/interfaces';
import { useMarcasStore } from '@/stores/taller/catalogos/marcas';

const getRegistros = async(page: number, buscar:string = ''):Promise<UnidadMedida[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`AdmUnidadMedida/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: UnidadMedida[] = data.items
    const storeint = useMarcasStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useUnidadMedidas = () => {

    const store = useMarcasStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['unidadesmedidas?page=',currentPage,'?buscar=',currentBuscar],
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

export default useUnidadMedidas;