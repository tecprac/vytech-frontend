import { watch } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { Cotizacion } from '../interfaces/interfaces';
import { useCotizacionesStore } from '@/stores/taller/modulos/cotizaciones';

const getRegistros = async(page: number, buscar:string = ''):Promise<Cotizacion[]> => {
    ApiService.setHeader();
    const { data } = await ApiService.get2(`Cotizacion/paginado?page=${page}&buscar=${buscar}&tipo=Factura`,null);
    const registrosdata: Cotizacion[] = data.items
    const storeint = useCotizacionesStore();
    storeint.setPaginas(data.totalPages);
    return registrosdata;
}

const useCotizaciones = () => {

    const store = useCotizacionesStore();
    const { currentPage,registros,totalPages,currentBuscar } = storeToRefs(store);

    const { isPending, data, isError, isSuccess } = useQuery({
        queryKey:   ['cotizaciones?page=',currentPage,'?buscar=',currentBuscar],
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

export default useCotizaciones;