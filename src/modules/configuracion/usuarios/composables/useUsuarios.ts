import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Usuario } from "@/modules/configuracion/usuarios/interfaces/usuario";
import { useUsuariosStore } from '@/stores/configuracion/usuarios';


const getRegistros = async(page: number, buscar:string = ''):Promise<Usuario[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Usuarios/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Usuario[] = data.items
    const storeint = useUsuariosStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useUsuarios = () => {

    const store = useUsuariosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['usuarios?page=',currentPage,'?buscar=',currentBuscar],
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

export default useUsuarios;