import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Departamento } from "@/modules/configuracion/departamentos/interfaces/departamento";
import { useDepartamentosStore } from '@/stores/configuracion/departamentos';


const getRegistros = async(page: number, buscar:string = ''):Promise<Departamento[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Departamentos/paginado?page=${page}&buscar=${buscar}`,null);
    const rolesdata: Departamento[] = data.items
    const storeint = useDepartamentosStore();
    storeint.setPaginas(data.totalPages);
    return rolesdata;
}

const useDepartamentos = () => {

    const store = useDepartamentosStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['departamentos?page=',currentPage,'?buscar=',currentBuscar],
        queryFn:    async () => getRegistros(currentPage.value,currentBuscar.value),
        gcTime:     0,
        staleTime:  0,
        retry:      false,
    });

    watch(data,departamentos => {
        if(departamentos) {
            store.setRegistros(departamentos);
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

export default useDepartamentos;