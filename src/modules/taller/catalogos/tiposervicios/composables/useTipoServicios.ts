import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { TipoServicio } from '../interfaces/interfaces';
import { useTipoServicioStore } from '@/stores/taller/catalogos/tiposervicio';

const getRegistros = async(page: number, buscar:string = ''):Promise<TipoServicio[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`TipoServicios/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: TipoServicio[] = data.items
    const storeint = useTipoServicioStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useTipoServicios = () => {

    const store = useTipoServicioStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['tiposervicios?page=',currentPage,'?buscar=',currentBuscar],
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

export default useTipoServicios;