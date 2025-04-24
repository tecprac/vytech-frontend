import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Documento } from '../interfaces/interfaces';
import { useFacturasStore } from '@/stores/administracion/modulos/facturas';


const getRegistros = async(page: number, buscar:string = ''):Promise<Documento[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`AdmFactura/paginado?page=${page}&buscar=${buscar}&tipo='Factura'`,null);
    const registrosdata: Documento[] = data.items
    const storeint = useFacturasStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useFacturas = () => {

    const store = useFacturasStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['facturas?page=',currentPage,'?buscar=',currentBuscar],
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

export default useFacturas;