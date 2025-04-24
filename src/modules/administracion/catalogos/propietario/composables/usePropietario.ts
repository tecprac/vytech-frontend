import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Propietario } from '../interfaces/interfaces';
import type { Pais } from '../../clientes/interfaces/pais';
import type { SatEstado } from '@/modules/sat/catalogos/estados/interfaces/interfaces';
import type { MetodoPago } from '../../clientes/interfaces/metodopago';
import type { FormaPago } from '../../clientes/interfaces/formapago';
import type { RegimenFiscal } from '../../clientes/interfaces/regimenfiscal';
import type { UsoCFDI } from '../../clientes/interfaces/usocfdi';
import { useToast } from 'primevue/usetoast';

const getregistro = async( id:number ):Promise<Propietario> => {
    console.log("Entrando a consulta");
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`AdmPropietario/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Propietario = {
            id:                 0,
            tipo_persona:       'Fisica',
            nombres:            '',
            apaterno:           '',
            amaterno:           '',
            razon_social:       '',
            rfc:                '',
            curp:               '',
            calle:              '',
            colonia:            '',
            cp:                 '',
            ciudad:             '',
            pais_id:            0,
            localidad:          '',
            estado_id:          0,
            estado:             '',
            telefono_fijo:      '',
            telefono_movil:     '',
            email:              '',
            email_adicional:    '',
            regimenfiscal_id:   0,
            usocfdi_id:         0,
            formapago_id:       0,
            metodopago_id:      0,
            observaciones:      '',
            latitud:            '',
            longitud:           '',
            file_certificado_csd: '',
            file_certificado_key: '',
            password_certificado: '',
            vigencia_certificado: new Date(),
            api_key:            '',
            api_key_pruebas:    '',
            file_imagen_logo:   '',
            activo:             true,
            sat_pais:           null,
            sat_estado:         null,
            sat_regimenfiscal:  null,
            sat_usocfdi:        null,
            sat_formapago:      null,
            sat_metodopago:     null,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Propietario):Promise<Propietario> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`AdmPropietario`,registro);
    return data;
};

const updateRegistro =async (registro:Propietario ):Promise<Propietario> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`AdmPropietario/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Propietario ):Promise<Propietario> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`AdmPropietario/${registro.id}`);
    return data;
};

const usePropietario = (id: number) => {
    const registro              = ref<Propietario>({
                                        id:                 0,
                                        tipo_persona:       'Fisica',
                                        nombres:            '',
                                        apaterno:           '',
                                        amaterno:           '',
                                        razon_social:       '',
                                        rfc:                '',
                                        curp:               '',
                                        calle:              '',
                                        colonia:            '',
                                        cp:                 '',
                                        ciudad:             '',
                                        pais_id:            0,
                                        localidad:          '',
                                        estado_id:          0,
                                        estado:             '',
                                        telefono_fijo:      '',
                                        telefono_movil:     '',
                                        email:              '',
                                        email_adicional:    '',
                                        regimenfiscal_id:   0,
                                        usocfdi_id:         0,
                                        formapago_id:       0,
                                        metodopago_id:      0,
                                        observaciones:      '',
                                        latitud:            '',
                                        longitud:           '',
                                        file_certificado_csd: '',
                                        file_certificado_key: '',
                                        password_certificado: '',
                                        vigencia_certificado: new Date(),
                                        api_key:            '',
                                        api_key_pruebas:    '',
                                        file_imagen_logo:   '',
                                        activo:             true,
                                        sat_pais:           null,
                                        sat_estado:         null,
                                        sat_regimenfiscal:  null,
                                        sat_usocfdi:        null,
                                        sat_formapago:      null,
                                        sat_metodopago:     null,
                                });
    const MensajeError          = ref<string>('');
    const toast                 = useToast();
    const selectedestado        = ref();
    const estadosfiltrados      = ref<SatEstado[]>([]);
    const tabActiva             = ref<string>('0');
    const tipospersona          = ref<string[]>(['Fisica','Moral']);
    const paises                = ref<Pais[]>([]);
    const selectpais            = ref<Pais>();
    const municipios            = ref<string[]>([]);
    const ciudades              = ref<string[]>([]);
    const colonias              = ref<string[]>([]);
    const regimenesfiscal       = ref<RegimenFiscal[]>([]);
    const regimenesfiscal_filtrado = ref<RegimenFiscal[]>([]);
    const formaspago            = ref<FormaPago[]>([]);
    const metodospago           = ref<MetodoPago[]>([]);
    const usoscfdi              = ref<UsoCFDI[]>([]);
    const usoscfdi_filtrado     = ref<UsoCFDI[]>([]);
    const selectregimenfiscal   = ref<RegimenFiscal>();
    const selectformapago       = ref<FormaPago>();
    const selectmetodopago      = ref<MetodoPago>();
    const selectusocfdi         = ref<UsoCFDI>();
    const serrores              = ref<string>('');

    const { isPending, data, isError } = useQuery({
            queryKey:    ['propietario', id],
            queryFn:    () => getregistro(id),
            refetchOnWindowFocus: (id == 0 ? false : true),
            retry:      false,
    });

    onMounted(async () => {
        isPending.value = true;
        estadosfiltrados.value.splice(0);
        regimenesfiscal.value.splice(0);
        formaspago.value.splice(0);
        metodospago.value.splice(0);
        usoscfdi.value.splice(0);
        const response = await ApiService.get2(`SatPaises/listado`,null);
        paises.value = <Pais[]>response.data;
        selectpais.value = paises.value.find(item => item.c_pais=='MEX');
        const resestados = await ApiService.get2(
            `SatEstados/SearchByField/c_pais/${selectpais.value?.c_pais}`,null)
        const estados:SatEstado[] = resestados.data;
        estadosfiltrados.value = estados;
        const respregimen = await ApiService.get2('SatRegimenFiscal/listado',null);
        regimenesfiscal.value = <RegimenFiscal[]>respregimen.data;
        const respformapago = await ApiService.get2('SatFormaPago/listado',null);
        formaspago.value = <FormaPago[]>respformapago.data;
        const respmetodopago = await ApiService.get2('SatMetodoPago/listado',null);
        metodospago.value = <MetodoPago[]>respmetodopago.data;
        const respusocfdi = await ApiService.get2('SatUsoCFDI/listado',null);
        usoscfdi.value = <UsoCFDI[]>respusocfdi.data;
        isPending.value = false;
        regimenesfiscal_filtrado.value = regimenesfiscal.value.filter(item => item.fisica == 'Sí');
        usoscfdi_filtrado.value = usoscfdi.value.filter(item => item.fisica == 'Sí');
    })

    const cambiaTipoPersona = async(tipopersona:string) => {
        regimenesfiscal_filtrado.value.splice(0);
        usoscfdi_filtrado.value.splice(0);
        if (tipopersona == 'Fisica') {
            registro.value.razon_social = '';
            registro.value.curp = '';
            regimenesfiscal_filtrado.value = regimenesfiscal.value.filter(item => item.fisica == 'Sí');
            usoscfdi_filtrado.value = usoscfdi.value.filter(item => item.fisica == 'Sí');
        } else {
            registro.value.nombres = '';
            registro.value.apaterno = '';
            registro.value.amaterno = '';
            registro.value.curp = '';
            regimenesfiscal_filtrado.value = regimenesfiscal.value.filter(item => item.moral == 'Sí');
            usoscfdi_filtrado.value = usoscfdi.value.filter(item => item.moral == 'Sí');
        }
        registro.value.rfc = "";
    }

    const cambiaPais = async () => {
        if ( 'MEX,USA,CAN'.indexOf(selectpais.value!.c_pais) >= 0 ) {
            estadosfiltrados.value.splice(0);
            const response = await ApiService.get2(
                `SatEstados/SearchByField/c_pais/${selectpais.value?.c_pais}`,null);
            const estados:SatEstado[] = response.data;
            estadosfiltrados.value = estados;
        } else {
            estadosfiltrados.value.splice(0);
            selectedestado.value = ref();
        }
    }

    const buscarEstados = async(event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(
                `SatEstados/getSearchByFieldWithFilter/descripcion/${event.query}/c_pais/${selectpais.value?.c_pais}`,null)
            const estados:SatEstado[] = response.data;
            estadosfiltrados.value = estados;
        } 
    }

    const buscarCP = async (codigo:string= '', evento?:Event) => {
        if (evento) {
            //@ts-ignore
            if (evento.keyCode != 13) return;
        }
        if (codigo.length == 5 && selectpais.value?.c_pais == 'MEX'){
            municipios.value.splice(0);
            ciudades.value.splice(0);
            colonias.value.splice(0);
            const response = await ApiService.get2(`SatCodigoPostal/SearchByField/c_codigopostal/${codigo}`,null);
            if (response) {
                selectedestado.value = estadosfiltrados.value.filter(item => item.c_estado == response.data[0].c_estado)[0];
            }
            const responsemun = await ApiService.get2(`SatMunicipio/SearchByField/c_estado/${selectedestado.value.c_estado}`,null);
            if (responsemun.data) {
                for (let i = 0; i < responsemun.data.length; i++) {
                    const item = responsemun.data[i];
                    municipios.value.push(item['descripcion']);
                }
            }
            const responseciudad = await ApiService.get2(`SatLocalidad/SearchByField/c_estado/${selectedestado.value.c_estado}`,null);
            if (responseciudad.data) {
                for (let i = 0; i < responseciudad.data.length; i++) {
                    const item = responseciudad.data[i];
                    ciudades.value.push(item['descripcion']);
                }
            }
            const responsecolonias = await ApiService.get2(`SatColonia/SearchByField/c_codigopostal/${codigo}`,null);
            if (responsecolonias.data) {
                for (let i = 0; i < responsecolonias.data.length; i++) {
                    const item = responsecolonias.data[i];
                    colonias.value.push(item['nombre_asentamiento']);
                }
            }
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
                                                        tipo_persona:       'Fisica',
                                                        nombres:            '',
                                                        apaterno:           '',
                                                        amaterno:           '',
                                                        razon_social:       '',
                                                        rfc:                '',
                                                        curp:               '',
                                                        calle:              '',
                                                        colonia:            '',
                                                        cp:                 '',
                                                        ciudad:             '',
                                                        pais_id:            0,
                                                        localidad:          '',
                                                        estado_id:          0,
                                                        estado:             '',
                                                        telefono_fijo:      '',
                                                        telefono_movil:     '',
                                                        email:              '',
                                                        email_adicional:    '',
                                                        regimenfiscal_id:   0,
                                                        usocfdi_id:         0,
                                                        formapago_id:       0,
                                                        metodopago_id:      0,
                                                        observaciones:      '',
                                                        latitud:            '',
                                                        longitud:           '',
                                                        file_certificado_csd: '',
                                                        file_certificado_key: '',
                                                        password_certificado: '',
                                                        vigencia_certificado: new Date(),
                                                        api_key:            '',
                                                        api_key_pruebas:    '',
                                                        file_imagen_logo:   '',
                                                        activo:             true,
                                                        sat_pais:           null,
                                                        sat_estado:         null,
                                                        sat_regimenfiscal:  null,
                                                        sat_usocfdi:        null,
                                                        sat_formapago:      null,
                                                        sat_metodopago:     null,
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
                const response = await ApiService.get2(`SatEstados/GetById/${registro.value.estado_id}`,null);
                selectedestado.value = <SatEstado>response.data;
                selectpais.value = paises.value.find(item => item.id == registro.value.pais_id);
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
        selectedestado,
        estadosfiltrados,
        tabActiva,
        tipospersona,
        paises,
        selectpais,
        municipios,
        ciudades,
        colonias,
        regimenesfiscal,
        formaspago,
        metodospago,
        usoscfdi,
        selectregimenfiscal,
        selectformapago,
        selectmetodopago,
        selectusocfdi,
        regimenesfiscal_filtrado,
        usoscfdi_filtrado,
        serrores,
        
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
        buscarEstados,
        buscarCP,
        cambiaTipoPersona,
        cambiaPais,
    }
}

export default usePropietario;