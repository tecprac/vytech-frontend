import { ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import ApiService from '@/core/services/ApiService';
import { useAuthStore } from '@/stores/auth';
import type { Version } from '../interfaces/interfaces';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const router        = useRouter();
const store         = useAuthStore();

// const time_verify   = parseInt(import.meta.env.VITE_APP_VERIFY_SESSION)
const time_verify   = store.validar_sesion;

const useParametros = () => {
    const versionActual = ref<Version>({
                                id_registro:            0,
                                plataforma:             'WEB',
                                version_actual:         '',
                                version_anterior:       '',
                                fecha_actualizacion:    '',
                                observaciones:          '',
                        });

    const appName = ref<string>(import.meta.env.VITE_APP_NAME); 

    const getVersionActual = async ():Promise<Version> => {
        ApiService.setHeader();
        try {
            const response = await ApiService.get2('Configuracion/versionactual/WEB',null);
            const registro:Version = response.data;
            return registro;    
        } catch (error: any) {
            if (error.response.status === 401) {
                if (error.response.data.message === 'Token Invalido') {
                    Swal.fire({
                        title:  appName.value,
                        icon:   "warning",
                        html:   "<b>La sesión ha finalizado.<b><br> Vuelva a ingresar por favor",
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Enterado',
                        confirmButtonColor: "#870000",
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            store.logout();
                            location.reload();
                            router.push({ name: "sign-in" });
                        }
                    })
                }
                if (error.response.data.message === 'El usuario ya no esta activo') {
                    Swal.fire({
                        title:  appName.value,
                        icon:   "error",
                        html:   "<b>Su usuario ha sido deshabilitado<b> ",
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Enterado',
                        confirmButtonColor: "#870000",
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            store.logout();
                            location.reload();
                            router.push({ name: "sign-in" });
                        }
                    })
                }
            }
            return versionActual.value = {
                id_registro:            0,
                plataforma:             'WEB',
                version_actual:         '',
                version_anterior:       '',
                fecha_actualizacion:    '',
                observaciones:          '',
            }
        }
        
    }
    
    const { isPending,isLoading,data,error,isError } = useQuery({
        queryKey:           ['versionactual'],
        queryFn:            async () => getVersionActual(),
        gcTime:             time_verify * 3600 * 1000,  // 60 = 1 Minuto
        refetchInterval:    time_verify * 3600 * 1000,  // 60 = 1 Minuto
        retry:              3
    });

    watch( data, async () => {
        if ( data.value) {
            versionActual.value = data.value;
        }
    });

    return {
        // Propiedades
        isPending,
        isLoading,
        versionActual,
        error,
        isError,
    }
}

export default useParametros;