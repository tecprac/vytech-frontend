import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { FolioDocumento } from '../interfaces/interfaces';
import type { Modulo } from '../../modulos/interfaces/modulo';
import { useToast } from 'primevue/usetoast';

const getregistro = async( id:number ):Promise<FolioDocumento> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`FolioDocumento/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:FolioDocumento = {
            id:                 0,
            modulo_id:          0,
            documento:          '',
            folio_siguiente:    1,
            serie:              '',
            activo:             true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:FolioDocumento):Promise<FolioDocumento> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`FolioDocumento`,registro);
    return data;
};

const updateRegistro =async (registro:FolioDocumento ):Promise<FolioDocumento> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`FolioDocumento/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:FolioDocumento ):Promise<FolioDocumento> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`FolioDocumento/${registro.id}`);
    return data;
};


const useFolioDocumento = ( id: number) => {

    const registro          = ref<FolioDocumento>({
                                id:                 0,
                                modulo_id:          0,
                                documento:          '',
                                folio_siguiente:    1,
                                serie:              '',
                                activo:             true,
                            });
    const MensajeError      = ref<string>('');
    const toast             = useToast();
    const selectedmodulo    = ref<Modulo>({
                                id:         0,
                                nombre:     '',
                                seccion:    '',
                                subseccion: '',
                                codigo:     '',
                                activo:     true
                            })
    
    const modulosfiltrados   = ref<Modulo[]>([]);

    const { isPending, data, isError } = useQuery({
        queryKey:    ['foliodocumento', id],
        queryFn:    () => getregistro(id),
        retry: false,
    });

    onMounted(async () => {
        
    })

    const buscarModulos = async(event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Modulos/SearchByField/nombre/'+event.query,null)
            const marcas:Modulo[] = response.data;
            modulosfiltrados.value = marcas;
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
                                                        id:                 0,
                                                        modulo_id:          0,
                                                        documento:          '',
                                                        folio_siguiente:    1,
                                                        serie:              '',
                                                        activo:             true,
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
                const response = await ApiService.get2(`Modulos/GetById/${registro.value.modulo_id}`,null);
                selectedmodulo.value = <Modulo>response.data;
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
        selectedmodulo,
        modulosfiltrados,
        
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
        buscarModulos,
    }
}

export default useFolioDocumento;