import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Producto } from '../interfaces/interfaces';
import { useProductoStore } from '@/stores/almacen/catalogos/producto';

const getRegistros = async(page: number, buscar:string = ''):Promise<Producto[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`InvProducto/paginado?page=${page}&buscar=${buscar}`,null);
    const registrosdata: Producto[] = data.items
    const storeint = useProductoStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useProductos = () => {

    const store = useProductoStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['productos?page=',currentPage,'?buscar=',currentBuscar],
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

export default useProductos;