import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { RelacionModuloPermiso } from '@/modules/configuracion/usuariospermisos/interfaces/relacionmodulopermiso';

export const useRelacionesModulosPermisosStore = defineStore('relacionesmodulospermisos',() => {
    
    const relacionesmodulospermisos = ref<RelacionModuloPermiso[]>([]);

    return{
        relacionesmodulospermisos,

        setRelaciones(newRelaciones: RelacionModuloPermiso[]) {
            relacionesmodulospermisos.value = newRelaciones;
        },
        getRelaciones() {
            return relacionesmodulospermisos;
        }
    }
});