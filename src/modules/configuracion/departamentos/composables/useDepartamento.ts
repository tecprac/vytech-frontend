import { ref, watch, computed } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Departamento } from '../interfaces/departamento';
import { useToast } from 'primevue/usetoast';

const getregistro = async( id:number ):Promise<Departamento> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Departamentos/GetById/${id}`,null);
    
        return data;
    } else {
        const newRol:Departamento = {
            id: 0,
            nombre: '',
            activo: true,
        }
        return newRol;
    }
};

const newRegistro =async (registro:Departamento):Promise<Departamento> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Departamentos`,registro);
    return data;
};

const updateRegistro =async (registro:Departamento ):Promise<Departamento> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`Departamentos/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Departamento ):Promise<Departamento> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Departamentos/${registro.id}`);
    return data;
};


const useDepartamento = ( id: number) => {

    const departamento           = ref<Departamento>();
    const MensajeError  = ref<string>('');
    const toast         = useToast();

    const { isPending, data, isError } = useQuery({
        queryKey:    ['departamento', id],
        queryFn:    () => getregistro(id),
        retry: false,
    });

    const dataMutationNew    = useMutation( { mutationFn: newRegistro,
                                                onSuccess() {
                                                    toast.add({
                                                        severity:   'success',
                                                        summary:    'Éxito',
                                                        detail:     'Información guardada correctamente',
                                                        life:       3500
                                                    })
                                                    departamento.value!.nombre = '';
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
            departamento.value = {...data.value};
    },{immediate: true});

    return {
        isPending,
        departamento,
        dataMutationUpdate,
        dataMutationNew,
        dataMutationDelete,
        isError,
        MensajeError,
        
        newRegistro:             dataMutationNew.mutate,
        updateRegistro:          dataMutationUpdate.mutate,
        deleteRegistro:          dataMutationDelete.mutate,
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

export default useDepartamento;