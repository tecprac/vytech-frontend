import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { UnidadMedida } from '@/modules/administracion/catalogos/unidadmedida/interfaces/interfaces';

export const useClientesStore = defineStore('unidadmedidas', () => {

    const currentPage   = ref<number>(1);
    const totalPages    = ref<number>(5);
    const registros     = ref<UnidadMedida[]>([]);
    const currentBuscar = ref<string>('');

    return{
        // State
        currentPage,
        totalPages,
        registros,
        currentBuscar,

        // Getters
        // squareCount: computed( () => count.value * count.value),

        // Actions
        setRegistros( newRegistros: UnidadMedida[]) {
            registros.value = newRegistros;
        },
        setPage( page: number) {
            if ( currentPage.value === page) return;
            if ( page <= 0) return;

            currentPage.value = page;
        },
        setBuscar(buscar: string) {
            currentBuscar.value = buscar;
        },
        getRegistros() {
            return registros;
        },
        setPaginas( paginas: number ) {
            totalPages.value = paginas;
        }

    }

});