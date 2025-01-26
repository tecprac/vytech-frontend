import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { FolioDocumento } from '../interfaces/interfaces';
import { useFolioDocumentoStore } from '@/stores/configuracion/foliodocumento';

const getRegistros = async(page: number, buscar:string = ''):Promise<FolioDocumento[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`FolioDocumento/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: FolioDocumento[] = data.items
    const storeint = useFolioDocumentoStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useFolioDocumentos = () => {

    const store = useFolioDocumentoStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['foliodocumentos?page=',currentPage,'?buscar=',currentBuscar],
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

export default useFolioDocumentos;