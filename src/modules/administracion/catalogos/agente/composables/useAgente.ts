import { ref, watch, computed } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Agente } from '../interfaces/interfaces';
import { useToast } from 'primevue/usetoast';

const getregistro = async( id:number ):Promise<Agente> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`admAgente/GetById/${id}`,null);
    
        return data;
    } else {
        const newRegistro:Agente = {
            id: 0,
            nombre: '',
            amaterno: '',
            apaterno: '',
            porc_cobro: 0,
            porc_venta: 0,
            activo: true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Agente):Promise<Agente> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`admAgente`,registro);
    return data;
};

const updateRegistro =async (registro:Agente ):Promise<Agente> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`admAgente/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Agente ):Promise<Agente> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`admAgente/${registro.id}`);
    return data;
};


const useAgente = ( id: number) => {

    const registro      = ref<Agente>();
    const MensajeError  = ref<string>('');
    const toast         = useToast();

    const { isPending, data, isError } = useQuery({
        queryKey:               ['agente', id],
        queryFn:                () => getregistro(id),
        refetchOnWindowFocus:   (id > 0 ? true: false),
        retry:                  false,
    });

    const dataMutationNew    = useMutation( { mutationFn: newRegistro,
                                                onSuccess() {
                                                    toast.add({
                                                        severity:   'success',
                                                        summary:    'Éxito',
                                                        detail:     'Información guardada correctamente',
                                                        life:       3500
                                                    })
                                                    registro.value = {
                                                        id: 0,
                                                        nombre: '',
                                                        amaterno: '',
                                                        apaterno: '',
                                                        porc_cobro: 0,
                                                        porc_venta: 0,
                                                        activo: true,
                                                    }
                                                },
                                                onError(error: any) {
                                                    MensajeError.value = error.response.data.message;
                                                    toast.add({
                                                        severity: 'error',
                                                        summary: 'Error al guardar',
                                                        detail: '['+MensajeError.value+']'+'\n\nIntentelo mas tarde o comuniquese con su area de soporte',
                                                        life: 3500
                                                    });
                                                }
                                        });
    const dataMutationUpdate = useMutation( { mutationFn: updateRegistro,
                                            onSuccess() {
                                                    toast.add({
                                                        severity:   'success',
                                                        summary:    'Éxito',
                                                        detail:     'Información actualizada correctamente',
                                                        life:       3500
                                                    })
                                                },
                                            onError(error: any) {
                                                MensajeError.value = error.response.data.message;
                                                toast.add({
                                                        severity: 'error',
                                                        summary: 'Error al actualizar',
                                                        detail: '['+MensajeError.value+']'+'\n\nIntentelo mas tarde o comuniquese con su area de soporte',
                                                        life: 3500
                                                    });
                                            }
                                        });
    const dataMutationDelete = useMutation( { mutationFn: deleteRegistro,
                                                onSuccess() {
                                                    toast.add({
                                                        severity:   'success',
                                                        summary:    'Éxito',
                                                        detail:     'Registro eliminado correctamente',
                                                        life:       3000
                                                    })
                                                },
                                                onError(error: any) {
                                                    MensajeError.value = error.response.data.message;
                                                    toast.add({
                                                        severity: 'error',
                                                        summary: 'Error al eliminar',
                                                        detail: '['+MensajeError.value+']'+'\n\nIntentelo mas tarde o comuniquese con su area de soporte',
                                                        life: 3500
                                                    });
                                                }
                                            });

    watch( data, () => {
        if (data.value)
            registro.value = {...data.value};
    },{immediate: true});

    return {
        isPending,
        registro,
        dataMutationUpdate,
        dataMutationNew,
        dataMutationDelete,
        isError,
        MensajeError,
        
        newRegistro:        dataMutationNew.mutate,
        updateRegistro:     dataMutationUpdate.mutate,
        deleteRegistro:     dataMutationDelete.mutate,
        isAdding:           computed( () => dataMutationNew.isPending.value),
        isAddingSuccess:    computed( () => dataMutationNew.isSuccess.value),
        isErrorAdding:      computed( () => dataMutationNew.isError.value),
        isUpdating:         computed( () => dataMutationUpdate.isPending.value),
        isUpdatingSuccess:  computed( () => dataMutationUpdate.isSuccess.value),
        isErrorUpdating:    computed( () => dataMutationUpdate.isError.value),
        isDeleting:         computed( () => dataMutationDelete.isPending.value),
        isDeletingSuccess:  computed( () => dataMutationDelete.isSuccess.value),
        isErrorDeleting:    computed( () => dataMutationDelete.isError.value),
    }
}

export default useAgente;