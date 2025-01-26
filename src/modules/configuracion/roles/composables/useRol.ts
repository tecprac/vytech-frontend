import { ref, watch, computed } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Rol } from '../interfaces/rol';
import { useToast } from 'primevue/usetoast';

const getRol = async( id:number ):Promise<Rol> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Roles/GetById/${id}`,null);
    
        return data;
    } else {
        const newRol:Rol = {
            id: 0,
            nombre: '',
            activo: true,
        }
        return newRol;
    }
   
}

const newRol =async (rol:Rol):Promise<Rol> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Roles`,rol);

    return data;
}

const updateRol =async (rol:Rol ):Promise<Rol> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`Roles/${rol.id}`,rol);

    return data;
}

const deleteRol =async ( rol:Rol ):Promise<Rol> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Roles/${rol.id}`);
    
    return data;
}


const useRol = ( id: number) => {

    const rol           = ref<Rol>();
    const MensajeError  = ref<string>('');
    const toast         = useToast();

    const { isPending, data, isError } = useQuery({
        queryKey:    ['rol', id],
        queryFn:    () => getRol(id),
        retry: false,
    });

    const rolMutationNew    = useMutation( { mutationFn: newRol,
                                                onSuccess() {
                                                    toast.add({
                                                        severity:   'success',
                                                        summary:    'Éxito',
                                                        detail:     'Información guardada correctamente',
                                                        life:       3500
                                                    })
                                                    rol.value!.nombre = '';
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
    const rolMutationUpdate = useMutation( { mutationFn: updateRol,
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
                                                        summary: 'Error al guardar',
                                                        detail: '['+MensajeError.value+']'+'\n\nIntentelo mas tarde o comuniquese con su area de soporte',
                                                        life: 3500
                                                    });
                                            }
                                        });
    const rolMutationDelete = useMutation( { mutationFn: deleteRol,
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
                                                        summary: 'Error al guardar',
                                                        detail: '['+MensajeError.value+']'+'\n\nIntentelo mas tarde o comuniquese con su area de soporte',
                                                        life: 3500
                                                    });
                                                }
                                            });

    watch( data, () => {
        if (data.value)
            rol.value = {...data.value};
    },{immediate: true});

    return {
        isPending,
        rol,
        rolMutationUpdate,
        rolMutationNew,
        rolMutationDelete,
        isError,
        MensajeError,
        
        newRol:             rolMutationNew.mutate,
        updateRol:          rolMutationUpdate.mutate,
        deleteRol:          rolMutationDelete.mutate,
        isAdding:           computed( () => rolMutationNew.isPending.value),
        isAddingSuccess:    computed( () => rolMutationNew.isSuccess.value),
        isErrorAdding:      computed( () => rolMutationNew.isError.value),
        isUpdating:         computed( () => rolMutationUpdate.isPending.value),
        isUpdatingSuccess:  computed( () => rolMutationUpdate.isSuccess.value),
        isErrorUpdating:    computed( () => rolMutationUpdate.isError.value),
        isDeleting:         computed( () => rolMutationDelete.isPending.value),
        isDeletingSuccess:  computed( () => rolMutationDelete.isSuccess.value),
        isErrorDeleting:    computed( () => rolMutationDelete.isError.value),
    }
}

export default useRol;