import { ref, onMounted } from 'vue';
import type { Parametro, Grupo } from '../interfaces/interfaces';
import ApiService from '@/core/services/ApiService';
import { useToast } from 'primevue/usetoast';

const useParametro = () => {
    const toast         = useToast();
    const isPending     = ref<boolean>(false);
    const isUpdating    = ref<boolean>(false);
    const parametros    = ref<Parametro[]>([]);
    const grupos        = ref<Grupo[]>([]);
    const tabActiva     = ref<string>("0");
    const valorboleano  = ref<string[]>(['true','false']);
    const parametro     = ref<Parametro>({
                            id:             0,
                            grupo:          '',
                            ambito:         '',
                            tipodato:       '',
                            nombre:         '',
                            valor:          '',
                            descripcion:    '',
                        });

    onMounted( async () => {
        isPending.value = true;
        parametros.value.splice(0);
        grupos.value.slice(0);
        const response = await ApiService.get2('/Parametro/grupos',null);
        grupos.value = <Grupo[]>response.data;
        const responsepar = await ApiService.get2('/Parametro/listado',null);
        parametros.value = <Parametro[]>responsepar.data;
        isPending.value = false;
    });

    const onCellEditComplete = async  (event: any) => {
        const { data, newValue, field } = event;
        parametro.value = {
            id:             data.id,
            grupo:          data.grupo,
            ambito:         data.ambito,
            tipodato:       data.tipodato,
            nombre:         data.nombre,
            valor:          newValue,
            descripcion:    data.descripcion,
        }
        try {
            toast.add({
                severity:   'info',
                summary:    `Actualizando parametro...`,
                group:      'waiting',    
            })
            await ApiService.patch(`/Parametro/${data.id}`,parametro.value);
            parametros.value.splice(0);
            const responsepar = await ApiService.get2('/Parametro/listado',null);
            parametros.value = <Parametro[]>responsepar.data;
            toast.removeGroup('waiting');
            toast.add({
                severity:   'success',
                summary:    'Éxito',
                detail:     'El Parametro se actualizo correctamente.',
                life:       3000,
            });
        } catch (error: any) {
            toast.add({
                severity:   'error',
                summary:    'Error',
                detail:     'Se genero un error al intentar actualizar el parametro \n'+error,
                life:       3500,
            });
        }
    }

    return {
        isPending,
        isUpdating,
        grupos,
        tabActiva,
        parametros,
        valorboleano,

        onCellEditComplete
    }
}

export default useParametro;