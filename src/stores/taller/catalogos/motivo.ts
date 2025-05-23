import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Motivo } from '@/modules/taller/catalogos/motivos/interfaces/interfaces';

export const useMotivoStore = defineStore('motivos', () => {

    const currentPage   = ref<number>(1);
    const totalPages    = ref<number>(5);
    const registros     = ref<Motivo[]>([]);
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
        setRegistros( newRegistros: Motivo[]) {
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