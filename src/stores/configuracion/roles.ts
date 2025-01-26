import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Rol } from '@/modules/configuracion/roles/interfaces/rol';

export const useRolesStore = defineStore('roles', () => {

    const currentPage = ref<number>(1);
    const totalPages  = ref<number>(5);
    const registros     = ref<Rol[]>([]);
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
        setRoles( newRoles: Rol[]) {
            registros.value = newRoles;
        },
        setPage( page: number) {
            if ( currentPage.value === page) return;
            if ( page <= 0) return;

            currentPage.value = page;
        },
        setBuscar(buscar: string) {
            currentBuscar.value = buscar;
        },
        getRoles() {
            return registros;
        },
        setPaginas( paginas: number ) {
            totalPages.value = paginas;
        }

    }

});