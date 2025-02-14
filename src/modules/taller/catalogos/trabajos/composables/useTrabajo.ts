import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Trabajo } from '../interfaces/interfaces';
import type { Division } from '@/modules/taller/catalogos/divisiones/interfaces/interfaces';
import type { SatClaveProdServ } from '@/modules/sat/catalogos/claveprodserv/interfaces/interfaces';
import type { SatClaveUnidad } from '@/modules/sat/catalogos/claveunidad/interfaces/interfaces';
import type { SatObjetoImpuesto } from '@/modules/sat/catalogos/objetoimpuesto/interfaces/interfaces';
import { useToast } from 'primevue/usetoast';

const getregistro = async( id:number ):Promise<Trabajo> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Trabajos/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Trabajo = {
            id:                 0,
            descripcion:        '',
            division_id:        0,
            horasestandar:      0,
            ficha_tecnica:      '',
            codigo:             '',
            costo_reposicion:   0,
            margen_utilidad:    0,
            precio:             0,
            estatus:            'Activo',
            descvariable:       false,
            claveprodserv_id:   0,
            claveunidad_id:     0,
            objetoimpuesto_id:  0,
            impiva:             16,
            impiesps:           0,
            retencion_isr:      0,
            retencion_iva:      0,
            activo:             true,
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
                                    id:                 0,
                                    descripcion:        '',
                                    division_id:        0,
                                    horasestandar:      0,
                                    ficha_tecnica:      '',
                                    codigo:             '',
                                    costo_reposicion:   0,
                                    margen_utilidad:    0,
                                    precio:             0,
                                    estatus:            'Activo',
                                    descvariable:       false,
                                    claveprodserv_id:   0,
                                    claveunidad_id:     0,
                                    objetoimpuesto_id:  0,
                                    impiva:             16,
                                    impiesps:           0,
                                    retencion_isr:      0,
                                    retencion_iva:      0,
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
    const satprodservfiltrados  = ref<SatClaveProdServ[]>([]);
    const selectedprodserv      = ref<SatClaveProdServ>({
                                    id:                 0,
                                    c_claveprodserv:    '',
                                    descripcion:        '',
                                    ini_vigencia:       null,
                                    fin_vigencia:       null,
                                    activo:             true,
                                });
    const satclaveunidadfiltradas = ref<SatClaveUnidad[]>([]);
    const selectedclaveunidad   = ref<SatClaveUnidad>({
                                    id:             0,
                                    c_claveunidad:  '',
                                    nombre:         '',
                                    ini_vigencia:   null,
                                    fin_vigencia:   null,
                                    activo:         true
                                });
    const satobjetosimpuestos   = ref<SatObjetoImpuesto[]>([]);
    const selectobjetoimpuesto  = ref<SatObjetoImpuesto>({
                                    id:             0,
                                    c_objetoimp:    '',
                                    descripcion:    '',
                                    ini_vigencia:   null,
                                    fin_vigencia:   null,
                                    activo:         true,
                                });
    
    const { isPending, data, isError } = useQuery({
        queryKey:    ['trabajo', id],
        queryFn:    () => getregistro(id),
        retry: false,
    });

    onMounted(async () => {
        satobjetosimpuestos.value.splice(0);
        isPending.value = true;
        const response = await ApiService.get2(`SatObjetoImp/listado`,null);
        satobjetosimpuestos.value = <SatObjetoImpuesto[]>response.data;
        const tempobjimp:SatObjetoImpuesto[] = satobjetosimpuestos.value.filter(item => item.c_objetoimp=='02');
        if (tempobjimp) selectobjetoimpuesto.value = tempobjimp[0];
        isPending.value = false;
    })

    const buscarDivisiones = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Divisiones/SearchByField/descripcion/'+event.query,null)
            const marcas:Division[] = response.data;
            divisionesfiltradas.value = marcas;
        } 
    }

    const buscarClaveProdServ = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('SatClaveProdServ/SearchByText/'+event.query,null)
            const registros:SatClaveProdServ[] = response.data;
            satprodservfiltrados.value = registros;
        } 
    }

    const buscarClaveUnidad = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('SatClaveUnidad/SearchByText/'+event.query,null)
            const registros:SatClaveUnidad[] = response.data;
            satclaveunidadfiltradas.value = registros;
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
                                                        descripcion:        '',
                                                        division_id:        0,
                                                        horasestandar:      0,
                                                        ficha_tecnica:      '',
                                                        codigo:             '',
                                                        costo_reposicion:   0,
                                                        margen_utilidad:    0,
                                                        precio:             0,
                                                        estatus:            'Activo',
                                                        descvariable:       false,
                                                        claveprodserv_id:   0,
                                                        claveunidad_id:     0,
                                                        objetoimpuesto_id:  0,
                                                        impiva:             16,
                                                        impiesps:           0,
                                                        retencion_isr:      0,
                                                        retencion_iva:      0,
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
                selecteddivision.value  = <Division>response.data;
                const resclaveprodserv  = await ApiService.get2(`SatClaveProdServ/GetById/${registro.value.claveprodserv_id}`,null);
                selectedprodserv.value  = <SatClaveProdServ>resclaveprodserv.data;
                const resclaveunidad    = await ApiService.get2(`SatClaveUnidad/GetById/${registro.value.claveunidad_id}`,null);
                selectedclaveunidad.value  = <SatClaveUnidad>resclaveunidad.data;
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
        satprodservfiltrados,
        selectedprodserv,
        satobjetosimpuestos,
        selectobjetoimpuesto,
        satclaveunidadfiltradas,
        selectedclaveunidad,
        
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
        buscarClaveProdServ,
        buscarClaveUnidad,
    }
}

export default useTrabajo;