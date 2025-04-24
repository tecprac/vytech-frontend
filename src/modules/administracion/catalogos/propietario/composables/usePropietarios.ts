import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Propietario } from '../interfaces/interfaces';
import { usePropietariosStore } from '@/stores/administracion/catalogos/propietarios';

const getRegistros = async(page: number, buscar:string = ''):Promise<Propietario[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`AdmPropietario/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Propietario[] = data.items
    const storeint = usePropietariosStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const usePropietarios = () => {

    const store = usePropietariosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['propietarios?page=',currentPage,'?buscar=',currentBuscar],
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

export default usePropietarios;