import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Trabajo } from '../interfaces/interfaces';
import type { Division } from '@/modules/taller/catalogos/divisiones/interfaces/interfaces';
import { useToast } from 'primevue/usetoast';

const getregistro = async( id:number ):Promise<Trabajo> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Trabajos/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Trabajo = {
            id:             0,
            descripcion:    '',
            division_id:    0,
            horasestandar:  0,
            ficha_tecnica:  '',
            activo:         true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Trabajo):Promise<Trabajo> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Trabajos`,registro);
    return data;
};

const updateRegistro =async (registro:Trabajo ):Promise<Trabajo> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`Trabajos/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Trabajo ):Promise<Trabajo> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Trabajos/${registro.id}`);
    return data;
};


const useTrabajo = ( id: number) => {

    const registro              = ref<Trabajo>({
                                    id:             0,
                                    descripcion:    '',
                                    division_id:    0,
                                    horasestandar:  0,
                                    ficha_tecnica:  '',
                                    activo:         true,
                                });
    const MensajeError          = ref<string>('');
    const toast                 = useToast();
    const selecteddivision      = ref<Division>({
                                    id: 0,
                                    descripcion: '',
                                    activo: true
                                })
    const divisionesfiltradas   = ref<Division[]>([]);

    const { isPending, data, isError } = useQuery({
        queryKey:    ['trabajo', id],
        queryFn:    () => getregistro(id),
        retry: false,
    });

    onMounted(async () => {
        // isPending.value = true;
        // if (registro.value.id > 0) {
        //     const response = await ApiService.get2(`Divisiones/GetById/${id}`,null);
        //     selecteddivisiones.value = <Division>response.data;
        // }
        // isPending.value = false;
    })

    const buscarDivisiones = async(event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Divisiones/SearchByField/descripcion/'+event.query,null)
            const marcas:Division[] = response.data;
            divisionesfiltradas.value = marcas;
        } 
    }
    
    const dataMutationNew    = useMutation( { mutationFn: newRegistro,
                                                onSuccess() {
                                                    toast.add({
                                                        severity:   'success',
                                                        summary:    'Éxito',
                                                        detail:     'Información guardada correctamente',
                                                        life:       3500
                                                    })
                                                    registro.value = {
                                                        id:             0,
                                                        descripcion:    '',
                                                        division_id:    0,
                                                        horasestandar:  0,
                                                        ficha_tecnica:  '',
                                                        activo:         true,
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

    watch( data, async () => {
        if (data.value){
            registro.value = {...data.value};
            if (id > 0) {
                const response = await ApiService.get2(`Divisiones/GetById/${registro.value.division_id}`,null);
                selecteddivision.value = <Division>response.data;
            }
        }
            
    },{immediate: true});

    return {
        isPending,
        registro,
        dataMutationUpdate,
        dataMutationNew,
        dataMutationDelete,
        isError,
        MensajeError,
        selecteddivision,
        divisionesfiltradas,
        
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
        buscarDivisiones,
    }
}

export default useTrabajo;