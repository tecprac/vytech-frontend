import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { Documento, Documento_Detalle,Documento_CFDI,
    adm_documento_relacionado,AdmCtaBanco, Factura
 } from '../interfaces/interfaces';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import type { FolioDocumento } from '@/modules/configuracion/folioDocumento/interfaces/interfaces';
import type { Propietario } from '@/modules/administracion/catalogos/propietario/interfaces/interfaces';
import type { SatMoneda } from '@/modules/sat/catalogos/moneda/interfaces/interfaces';
import type { FormaPago } from '@/modules/administracion/catalogos/clientes/interfaces/formapago';
import type { UsoCFDI } from '@/modules/administracion/catalogos/clientes/interfaces/usocfdi';
import type { SatTipoRelacion } from '@/modules/sat/catalogos/tiporelacion/interfaces/interfaces';
import Swal from 'sweetalert2';
import { getAssetPath } from "@/core/helpers/assets";
import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import useUtilerias from '@/core/helpers/utilerias';

const getregistro = async( id:number ):Promise<Documento> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`AdmPago/${id}`,null);
        return data;
    } else {
        const newRegistro:Documento = {
            id: 				    0,
	        folio_documento_id:     0,
	        folio: 				    0,
	        serie: 				    ',',
	        ctabanco_id: 		    0,
	        formapago_id: 		    0,
	        moneda_id: 			    0,
	        tipocambio: 		    1.0000,
	        propietario_id: 	    0,
	        cliente_id: 		    0,
	        ctaordenante: 		    '',
	        id_bancoordenante: 	    0,
	        fecha_registro: 	    new Date(),
	        fecha_pago: 		    new Date(),
	        saldoafavor: 		    0,
	        doctosaldoafavor_id:    0,
	        importe: 			    0,
	        saldo: 				    0,
	        usuario_id: 		    0,
	        referencia: 		    '',
	        concepto: 			    '',
	        observaciones: 	    '',
	        estatus: 			    'SinAplicar',
	        errortimbrado: 		    '',
	        filepdf: 			    '',
	        usocfdi_id: 		    0,
            activo:                 true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Documento):Promise<Documento> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`AdmPago`,registro);
    return data;
};

const updateRegistro =async (registro:Documento ):Promise<Documento> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`AdmPago/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Documento ):Promise<Documento> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`AdmPago/${registro.id}`);
    return data;
};

const usePago = (id: number) => {
    const router                = useRouter();
    const store                 = useAuthStore();
    const confirm               = useConfirm();
    const toast                 = useToast();
    const MensajeError          = ref<string>('');
    const tabActiva             = ref<string>('0');
    const registro              = ref<Documento>({
                                    id: 				    0,
                                    folio_documento_id:     0,
                                    folio: 				    0,
                                    serie: 				    ',',
                                    ctabanco_id: 		    0,
                                    formapago_id: 		    0,
                                    moneda_id: 			    0,
                                    tipocambio: 		    1.0000,
                                    propietario_id: 	    0,
                                    cliente_id: 		    0,
                                    ctaordenante: 		    '',
                                    id_bancoordenante: 	    0,
                                    fecha_registro: 	    new Date(),
                                    fecha_pago: 		    new Date(),
                                    saldoafavor: 		    0,
                                    doctosaldoafavor_id:    0,
                                    importe: 			    0,
                                    saldo: 				    0,
                                    usuario_id: 		    0,
                                    referencia: 		    '',
                                    concepto: 			    '',
                                    observaciones: 	    '',
                                    estatus: 			    'SinAplicar',
                                    errortimbrado: 		    '',
                                    filepdf: 			    '',
                                    usocfdi_id: 		    0,
                                    activo:                 true,
                                });
    const foliosdoctos          = ref<FolioDocumento[]>([]);
    const selecfoliodocto       = ref<FolioDocumento>({
                                        id:             0,
                                        modulo_id:      0,
                                        folio_siguiente: 0,
                                        documento:      '',
                                        serie:          '',
                                        activo:         true
                                    });
    const propietarios          = ref<Propietario[]>([]);
    const selectpropietario     = ref<Propietario>({
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
    const cuentasbanco          = ref<AdmCtaBanco[]>([]);
    const selectcuentabanco     = ref<AdmCtaBanco>({
                                    id:             0,
                                    banco_id:       0,
                                    descripcion:    '',
                                    cuenta:         '',
                                    clabe:          '',
                                    propietario_id: 0,
                                    titular:        '',
                                    saldo:          0
                                });
    const monedas               = ref<SatMoneda[]>([]);
    const tiporelaciones        = ref<SatTipoRelacion[]>([]);
    const selectmoneda          = ref<SatMoneda>({
                                    id:         0,
                                    c_moneda:   '',
                                    descripcion: '',
                                    decimales:  0,
                                    activo:     true,
                                });
    const formaspago            = ref<FormaPago[]>([]);
    const usoscfdi              = ref<UsoCFDI[]>([]);
    const selectformapago       = ref<FormaPago>({
                                        id: 0,
                                        c_formapago: '',
                                        descripcion: '',
                                        bancarizado: '',
                                        numerooperacion: '',
                                        rfccuentaordenante: '',
                                        cuentaordenante: '',
                                        patronctaordenante: '',
                                        rfccuentabeneficiario: '',
                                        cuentabeneficiario: '',
                                        patronctabeneficiario: '',
                                        tipocadenapago: '',
                                        bancoemisor: '',
                                        ini_vigencia: null,
                                        fin_vigencia:  null,
                                        activo: true,
                                });
    const selectusocfdi         = ref<UsoCFDI>({
                                        id:             0,
                                        c_usocfdi:      '',
                                        descripcion:    '',
                                        fisica:         '',
                                        moral:          '',
                                        regimen_receptor: '',
                                        ini_vigencia:   null,
                                        fin_vigencia:   null,
                                        activo:        true,
                                });
    const selectcliente         = ref();
    const clientesfiltrados     = ref<Cliente[]>([]);
    const documento_detalles    = ref<Documento_Detalle[]>([]);
    const documento_detalle     = ref<Documento_Detalle>({
                                        id:             0,
                                        pago_id:        0,
                                        documento_id:   0,
                                        parcialidad:    0,
                                        importe:        0,
                                        saldoant:       0,
                                        saldoinsoluto:  0,
                                        notas:          ''
                                });
    const documento_relacionado = ref<adm_documento_relacionado>({
                                        id:             0,
                                        pago_id:        0,
                                        origen:         '',
                                        id_documentorel:0,
                                        uuid:           '',
                                        tiporelacion_id: 0,
                                        activo:         true,
                                    });
    const documentos_relacionados = ref<adm_documento_relacionado[]>([]);
    const tipo_detalle_operacion = ref<string>('Create') // Create,Update,Show
    const tipo_docto_relacionado = ref<string[]>(['Externo','Interno']);
    const dialogRelacionados    = ref<boolean>(false);
    const dialogRelacionados_det= ref<boolean>(false);
    const dialogDetalle         = ref<boolean>(false);
    const isUpdatingDetalle     = ref<boolean>(false);
    const bTimbrando            = ref<boolean>(false);
    const dialogCancelacion     = ref<boolean>(false);
    const dialogPDFVisor        = ref<boolean>(false);
    const dialogXMLVisor        = ref<boolean>(false);
    const documento_cfdi        = ref<Documento_CFDI>();
    const pdfDocumento          = ref();
    const filePDF               = ref(null);
    const pdfViewer             = ref();
    const selectfactura         = ref();
    const facturasfiltrados     = ref<Factura[]>([]);

    const { isPending, data, isError } = useQuery({
        queryKey:               ['pago', id],
        queryFn:                () => getregistro(id),
        refetchOnWindowFocus:   (id > 0 ? true : false),
        retry:                  false,
    });

    onMounted( async () => {
        isPending.value = true;
        foliosdoctos.value.splice(0);
        propietarios.value.splice(0);
        monedas.value.splice(0);
        formaspago.value.splice(0);
        usoscfdi.value.splice(0);
        tiporelaciones.value.splice(0);
        const response  = await ApiService.get2('Modulos/SearchByField/codigo/052',null);
        const modulo = response.data[0];
        const respfoliosdocto = await ApiService.get2(`FolioDocumento/SearchByModuloId/${modulo.id}`,null);
        foliosdoctos.value = <FolioDocumento[]>respfoliosdocto.data;
        if (foliosdoctos.value.length > 0 ) {
            selecfoliodocto.value = foliosdoctos.value[0];
            if (id == 0) registro.value.folio  = selecfoliodocto.value.folio_siguiente;
            registro.value.serie  = selecfoliodocto.value.serie;
        } else {
            Swal.fire({
                title:  'No existe Folio',
                html:   'No se encontraron Folios para este tipo de Documento.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const respropietario = await ApiService.get2('AdmPropietario/listado',null);
        propietarios.value = <Propietario[]>respropietario.data;
        if (propietarios.value.length > 0){
            if (id == 0) selectpropietario.value = propietarios.value[0];
        } else {
            Swal.fire({
                title:  'No existen Emisores',
                html:   'No se encontraron Emisores.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const respcuentasbanco = await ApiService.get2('AdmCtaBanco/listado',null);
        cuentasbanco.value = <AdmCtaBanco[]>respcuentasbanco.data;
        if (cuentasbanco.value.length > 0) {
            if (id == 0) selectcuentabanco.value = cuentasbanco.value[0];
        } else {
            Swal.fire({
                title:  'No existen Cuentas Bancarias',
                html:   'No se encontraron Cuentas Bancarias registradas.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const respmoneda = await ApiService.get2('SatMoneda/listado',null);
        monedas.value = <SatMoneda[]>respmoneda.data;
        if (monedas.value.length > 0){
            selectmoneda.value = monedas.value[0];
        } else {
            Swal.fire({
                title:  'No existen Monedas',
                html:   'No se encontraron Monedes dentro del Catalogo del SAT.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const resptiporelacion = await ApiService.get2('SatTipoRelacion/listado',null);
        tiporelaciones.value = <SatTipoRelacion[]>resptiporelacion.data;
        if (tiporelaciones.value.length == 0) {
            Swal.fire({
                title:  'No existen Tipos de Relaciones',
                html:   'No se encontraron los Tipo de Relaciones dentro del Catalogo del SAT.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const resformaspago = await ApiService.get2('SatFormaPago/listado',null);
        formaspago.value = <FormaPago[]>resformaspago.data;
        const resusoscfdi = await ApiService.get2('SatUsoCFDI/listado',null);
        usoscfdi.value = <UsoCFDI[]>resusoscfdi.data;
        selectusocfdi.value = usoscfdi.value.find(item => item.c_usocfdi == 'CP01')!;
        isPending.value = false;        
    });


    const cambiaDocumento = () => {
        registro.value.folio = selecfoliodocto.value.folio_siguiente;
        registro.value.serie = selecfoliodocto.value.serie;
    }

    const cambiaMoneda = () => {
        registro.value.moneda_id = selectmoneda.value.id;
    }

    const buscarClientes = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`AdmClientes/SearchByText/${event.query}`,null);
            const clientes:Cliente[] = response.data;
            clientesfiltrados.value = clientes;
        }
    }

    const buscarDocumentos = async (event: any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`AdmFactura/GetRegistrosByFolio/${event.query}`,null);
            facturasfiltrados.value = <Factura[]>response.data;
        }
    }

    const seleccionDetalle = async () => {
        documento_detalle.value.documento_id = selectfactura.value.id;
    }

    const seleccionCliente = () => {
        // registro.value.formapago_id = selectcliente.value.formapago_id;
        // registro.value.usocfdi_id = selectcliente.value.usocfdi_id;
        // selectformapago.value = formaspago.value.find(item => item.id == selectcliente.value.formapago_id)!;
        // selectusocfdi.value = usoscfdi.value.find(item => item.id == selectcliente.value.usocfdi_id)!;
    }

    const botonRegresar = async () => {
        if(registro.value.id > 0 && registro.value.estatus == 'SinAplicar') {
            if (documento_detalles.value.length == 0){
                confirm.require({
                    header: "Confirmación",
                    position: 'center',
                    message: "El Documento no tiene documentos, ¿Desea Borrarlo?",
                    rejectLabel: 'No',
                    rejectProps: {
                        label: 'No',
                        severity: 'secondary',
                        outlined: true
                    },
                    acceptProps: {
                        label: 'Si, Borrarlo',
                        severity: 'danger'
                    },
                    accept: async () => {
                        try {
                            await ApiService.delete(`AdmPago/${registro.value.id}`)
                            toast.add({ severity: 'info', summary: 'Eliminado', detail: 'Documento eliminado', life: 3000 });
                        } catch (error) {
                            toast.add({ severity: 'error', summary: 'Error', detail: 'Intentelo nuevamente mas tarde\n'+error, life: 3000 });
                        }
                        router.push({name: 'pago'});
                        return;
                    },
                    reject: () => {
                        toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                        router.push({name: 'pago'});
                        return;
                    }
                })
            } else {
                router.push({name: 'pago'});
                return;    
            }
        } else {
            router.push({name: 'pago'});
            return;
        }
    }

    const eliminaRelacionado = async(event: any, data: any) => {
        confirm.require({
            target: event.currentTarget,
            message: 'Esta seguro de eliminar el concepto ?',
            icon:   'pi pi-exclamation-triangle',
            rejectProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: { 
                label: 'Eliminar' ,
                severity: 'warn'
            },
            accept: async () => {
                try {
                    await ApiService.delete(`AdmPago/Relacionado/${data.id}`);
                    const response = await ApiService.get2(`AdmPago/RelacionadoByDocumento/${registro.value.id}`,null)
                    documentos_relacionados.value.splice(0);
                    documentos_relacionados.value = <adm_documento_relacionado[]>response.data;    
                    toast.add({
                        severity:   'success',
                        summary:    'El documento relacionado se elimino correctamente',
                        life:       3000
                    });
                } catch (error) {
                    toast.add({
                        severity:   'error',
                        summary:    'Error al Eliminar el documento relacionado',
                        detail:     'Se genero el error '+error,
                        life:       3500
                    });
                }
            },
        });
    }

    const desAplicar = async () => {
        try {
            bTimbrando.value = true;
            toast.add({
                severity:   'info',
                summary:    `DesAplicando documento...`,
                group:      'waiting',    
            });
            Swal.fire({
                title: 'DesAplicando..',
                html:   'DesAplicando documento...',
                showConfirmButton: false
            });
            Swal.showLoading();
            const body = {
                usuario_id: store.user.id,
                modulo_id:  51
            }
            const response = await ApiService.post(`AdmPago/desAplicar/${registro.value.id}`,body);
            toast.removeGroup('waiting');
            Swal.close();
            if (response.status == 200) {
                Swal.fire({
                    title: 'Documento Des-Aplicado Correctamente',
                    icon:   "success",
                    html:   'Des Aplicado',
                    showCancelButton: false,
                    showConfirmButton: true,
                    confirmButtonColor: "#E10000",
                    confirmButtonText:  "Aceptar"
                });
                const responseregistro = await ApiService.get2(`AdmPago/${id}`,null);
                registro.value = {...responseregistro.data};
            }
            bTimbrando.value = false;
        } catch (error: any) {
            Swal.close();
            toast.removeGroup('waiting');
            bTimbrando.value = false;
            toast.add({
                severity:   'error',
                summary:    'Error al Intentar des-aplicar el documento\n'+error,
                detail:     'Se genero el error '+error,
                life:       4000
            });
        }
    }

    const timbrarFactura = async () => {
        if (documento_detalles.value.length == 0){
            toast.add({
                severity:'error', 
                summary: 'Sin Conceptos',
                detail: 'Debe agregar uno o mas conceptos al documento', life: 3500,
            });
            return;
        }
        try {
            bTimbrando.value = true;
            toast.add({
                severity:   'info',
                summary:    `Timbrando documento...`,
                group:      'waiting',    
            });
            Swal.fire({
                title: 'Timbrando..',
                html:   'Enviando a timbrar documento...',
                showConfirmButton: false
            });
            Swal.showLoading();
            const body = {
                usuario_id: store.user.id,
                modulo_id:  56 // Pago a Clientes
            }
            const response = await ApiService.post(`AdmPago/Timbrar/${registro.value.id}`,body);
            toast.removeGroup('waiting');
            Swal.close();
            if (response.status == 201) {
                Swal.fire({
                    title: 'Error al Timbrar Documento',
                    icon:   'error',
                    html:   response.data.message+
                                '\n'+response.data.messageDetail,
                    showCancelButton: false,
                    showConfirmButton: true,
                    confirmButtonColor: "#E10000",
                    confirmButtonText:  "Aceptar"
                });
            } 
            if (response.status == 200) {
                Swal.fire({
                    title: 'Documento Timbrado Correctamente',
                    icon:   "success",
                    html:   'UUID: <b>'+response.data.data.uuid+'</b>'+
                                '\n Fecha Timbrado: <b>'+response.data.data.fechaTimbrado+'</b>',
                    showCancelButton: false,
                    showConfirmButton: true,
                    confirmButtonColor: "#E10000",
                    confirmButtonText:  "Aceptar"
                });
                const responseregistro = await ApiService.get2(`AdmPago/${id}`,null);
                registro.value = {...responseregistro.data};
                const responsecfdi  = await ApiService.get2(`AdmPago/GetCFDI/${registro.value.id}/P`,null);
                documento_cfdi.value = <Documento_CFDI>responsecfdi.data;
            }
            bTimbrando.value = false;
        } catch (error: any) {
            Swal.close();
            toast.removeGroup('waiting');
            bTimbrando.value = false;
            toast.add({
                severity:   'error',
                summary:    'Error al Intentar timbrar el documento\n'+error,
                detail:     'Se genero el error '+error,
                life:       4000
            });
        }
    }

    const cancelarFactura = async () => {
        confirm.require({
            header: "Confirmación",
            position: 'center',
            message: "¿ Desea Cancelar el Documento ?",
            rejectLabel: 'No',
            rejectProps: {
                label: 'No',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Si, Cancelar',
                severity: 'danger'
            },
            accept: async () => {
                if (registro.value.estatus == 'SinAplicar') {
                    try {
                        ApiService.setHeader();
                        const data = {
                            estatus:            'Cancelado',
                            usuario_cancela_id: store.user.id,
                            fecha_cancela:      new Date(),
                        }
                        const response = await ApiService.patch(`AdmPago/${registro.value.id}`,data);
                        registro.value = <Documento>response.data;
                        toast.add({ severity: 'success', summary: 'Documento Cancelado', detail: 'Documento cancelado correctamente', life: 3000 });
                    } catch (error) {
                        toast.add({ severity: 'error', summary: 'Error al Cancelar', detail: 'Se genero un error al intentar cancelar', life: 3000 });
                    }
                }
                if (registro.value.estatus == 'Timbrado') {
                    dialogCancelacion.value = true;
                    return;
                }
            },
            reject: () => {
                return;
            }
        });
    }

    const CalcularTototales = async () => {
        registro.value.saldo = registro.value.importe;
        for (let h = 0; h < documento_detalles.value.length; h++) {
            const item = documento_detalles.value[h];
            registro.value.saldo   -= +item.importe;
        }
        const data:object = {
            saldo: registro.value.saldo,
        }
        await ApiService.post(`AdmPago/updateTotales/${registro.value.id}`,data);
    }

    const openDialogDetalle = async (detalle_id:number, caso: string) => {
        tipo_detalle_operacion.value = caso;
        if(detalle_id > 0){
            const response = await ApiService.get2(`AdmPago/DetalleById/${detalle_id}`,null);
            documento_detalle.value = <Documento_Detalle>response.data;
            const respfactura = await ApiService.get2(`AdmFactura/${documento_detalle.value.documento_id}`,null);
            selectfactura.value = <Factura>respfactura.data;
        }
        dialogDetalle.value = true;
    }

    const openDialogRelacionados = async() => {
        if (documento_detalles.value.length == 0){
            toast.add({
                severity:'error', 
                summary: 'Sin Conceptos',
                detail: 'Debe agregar uno o mas conceptos al documento', life: 3500,
            });
            return;
        }
        dialogRelacionados.value = true;
    }

    const openDialogRelacionadosDet = async() => {
        dialogRelacionados_det.value = true;
    }

    const closeDialogRelacionadoDet = async (accion:string) => {
        if (accion == 'guardar') {
            if (documento_relacionado.value.origen.trim().length == 0) {
                toast.add({
                    severity:'error', summary: 'Origen',
                    detail: 'Debe seleccionar un origen', life: 3500,
                });
                return;
            }
            if (documento_relacionado.value.tiporelacion_id == 0) {
                toast.add({
                    severity:'error', summary: 'Tipo Relación',
                    detail: 'Debe seleccionar un Tipo de Relación', life: 3500,
                });
                return;
            }
            if (documento_relacionado.value.uuid.trim().length == 0) {
                toast.add({
                    severity:'error', summary: 'UUID',
                    detail: 'Debe capturar un UUID', life: 3500,
                });
                return;
            }
            try {
                isUpdatingDetalle.value = true;
                documento_relacionado.value.pago_id = registro.value.id;
                await ApiService.post('AdmPago/Relacionado',documento_relacionado.value);
                const response = await ApiService.get2(`AdmPago/RelacionadoByDocumento/${registro.value.id}`,null)
                documentos_relacionados.value.splice(0);
                documentos_relacionados.value = <adm_documento_relacionado[]>response.data;
                isUpdatingDetalle.value = false;
                toast.add({
                    severity: 'success',
                    summary:    'Éxito',
                    detail:     'El Registro de guardo correctamente.',
                    life: 3000,
                });
            } catch (error: any) {
                isUpdatingDetalle.value = false;
                toast.add({
                    severity: 'error',
                    summary:    'Error',
                    detail:     'Se genero un error al intentar guardar \n'+error,
                    life: 3500,
                });
            }

        }
        documento_relacionado.value = {
            id:             0,
            pago_id:        0,
            origen:         '',
            id_documentorel:0,
            uuid:           '',
            tiporelacion_id: 0,
            activo:         true,
        };
        dialogRelacionados_det.value = false;
    }

    const closeDialogDetalle = async ( accion: string) => {
        if (accion == 'guardar') {
            try {
                if ( selectfactura.value.id == 0 ) {
                    toast.add({
                        severity:'error', summary: 'Factura',
                        detail: 'Debe seleccionar una factura a pagar', life: 3500,
                    });
                    return;
                }
            } catch (error){
                toast.add({
                    severity: 'error', summary: 'Factura',
                    detail: 'Debe seleccionar una factura a pagar ', life: 3500,
                });
                return;
            }
            if (documento_detalle.value.importe <= 0) {
                toast.add({
                    severity: 'error', summary: 'Importe Pago',
                    detail: 'El importe del pago debe ser mayor a 0', life: 3500,
                });
                return;
            }
            if (documento_detalle.value.importe > +selectfactura.value.saldo) {
                toast.add({
                    severity: 'error', summary: 'Importe Pago',
                    detail: 'El importe del pago no puede ser mayor al Saldo del documento', life: 3500,
                });
                return;
            }
            if (documento_detalle.value.importe > (Math.round(registro.value.saldo * 100) / 100) ) {
                toast.add({
                    severity: 'error', summary: 'Importe Pago',
                    detail: 'El importe del pago no puede ser mayor al Importe del Pago', life: 3500,
                });
                return;
            }
            if ( documento_detalles.value.find(item => item.documento_id == selectfactura.value.id) ) {
                toast.add({
                    severity: 'error', summary: 'Documento Duplicado',
                    detail: 'El documento que desea pagar ya esta incluida en este pago', life: 3500,
                });
                return;
            }
            documento_detalle.value.documento_id = selectfactura.value.id;
            documento_detalle.value.pago_id = registro.value.id;
            try {
                isUpdatingDetalle.value = true;
                if ( tipo_detalle_operacion.value == 'Create' ){
                    documento_detalle.value.parcialidad = (+selectfactura.value.numparcialidad + 1);
                    documento_detalle.value.saldoant = selectfactura.value.saldo;
                    documento_detalle.value.saldoinsoluto = (+selectfactura.value.saldo - +documento_detalle.value.importe);
                    await ApiService.post('AdmPago/Detalle',documento_detalle.value);
                } else if (tipo_detalle_operacion.value == 'Update') {
                    await ApiService.patch(`AdmPago/Detalle/${documento_detalle.value.id}`,documento_detalle.value);
                }
                const response = await ApiService.get2(`AdmPago/DetalleByDocumento/${registro.value.id}`,null)
                documento_detalles.value.splice(0);
                documento_detalles.value = <Documento_Detalle[]>response.data;
                console.log(documento_detalles.value);
                await CalcularTototales();
                isUpdatingDetalle.value = false;
                toast.add({
                    severity: 'success',
                    summary:    'Éxito',
                    detail:     'El Registro de guardo correctamente.',
                    life: 3000,
                });
            } catch (error: any) {
                isUpdatingDetalle.value = false;
                toast.add({
                    severity: 'error',
                    summary:    'Error',
                    detail:     'Se genero un error al intentar guardar \n'+error,
                    life: 3500,
                });
            }
        }
        
        selectfactura.value = null;
        dialogDetalle.value = false;
        documento_detalle.value = {
                                id:             0,
                                pago_id:        0,
                                documento_id:   0,
                                parcialidad:    0,
                                importe:        0,
                                saldoant:       0,
                                saldoinsoluto:  0,
                                notas:          ''
                            };
        isUpdatingDetalle.value = false;
    }

    const eliminaDetalle = async (event: any, data: any) => {
        confirm.require({
            target: event.currentTarget,
            message: 'Esta seguro de eliminar el concepto ?',
            icon:   'pi pi-exclamation-triangle',
            rejectProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: { 
                label: 'Eliminar' ,
                severity: 'warn'
            },
            accept: async () => {
                try {
                    await ApiService.delete(`AdmPago/Detalle/${data.id}`);
                    const response = await ApiService.get2(`AdmPago/DetalleByDocumento/${registro.value.id}`,null)
                    documento_detalles.value.splice(0);
                    documento_detalles.value = <Documento_Detalle[]>response.data;
                    await CalcularTototales();
                    toast.add({
                        severity:   'success',
                        summary:    'El concepto se elimino correctamente',
                        life:       3000
                    });
                } catch (error) {
                    toast.add({
                        severity:   'error',
                        summary:    'Error al Eliminar el concepto',
                        detail:     'Se genero el error '+error,
                        life:       3500
                    });
                }
            },
        });
    }

    const cerrarVisualizarPDF = () => {
        if (pdfDocumento.value) {
            dialogPDFVisor.value = false;
            URL.revokeObjectURL(pdfDocumento.value);
            pdfDocumento.value = null;
        }
    }

    const cerrarVisualizarXML = () => {
        if (pdfDocumento.value) {
            dialogXMLVisor.value = false;
            URL.revokeObjectURL(pdfDocumento.value);
            pdfDocumento.value = null;
        }
    }

    const downloadXML = () => {
        if (!pdfDocumento.value) return;

        const blob = new Blob([pdfDocumento.value], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', documento_cfdi.value!.filexml);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    }

    const VisualizarXML = async (filename: string ) => {
        if (filename) {
            toast.add({
                severity:   'info',
                summary:    "Descargando archivo XML...",
                group:      'waiting',
            })
            filePDF.value = null;
            try {
                const response = await ApiService.get2('download/cfdi/'+filename,{
                    responseType: 'text', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/xml'
                    }
                });
                if (response.status == 200) {
                    filePDF.value = response.data;
                    pdfDocumento.value = filePDF.value;
                    toast.removeGroup('waiting');
                    dialogXMLVisor.value = true;
                } else {
                    toast.removeGroup('waiting');
                    toast.add({
                        severity:   "error",
                        summary:    "Visualizar PDF",
                        detail:     "No se logro descargar el archivo solicitado\n. Intentelo mas tarde.",
                        life:       3500,
                    })
                }    
            } catch (error) {
                toast.removeGroup('waiting');
                toast.add({
                    severity:   "error",
                    summary:    "Visualizar PDF",
                    detail:     "No se logro descargar el archivo solicitado.\n Intentelo mas tarde.",
                    life:       3500,
                })
            }
        }
    }

    const VisualizarPDF = async (filename: string) => {
        if (filename) {
            toast.add({
                severity:   'info',
                summary:    "Descargando archivo pdf...",
                group:      'waiting',
            })
            filePDF.value = null;
            try {
                const response = await ApiService.get2('download/cfdi/'+filename,{responseType: 'arraybuffer'});
                if (response.status == 200) {
                    filePDF.value = response.data;
                    // const blob = new Blob([response.data], { type: 'application/pdf' });
                    pdfDocumento.value = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                    toast.removeGroup('waiting');
                    dialogPDFVisor.value = true;
                } else {
                    toast.removeGroup('waiting');
                    toast.add({
                        severity:   "error",
                        summary:    "Visualizar PDF",
                        detail:     "No se logro descargar el archivo solicitado\n. Intentelo mas tarde.",
                        life:       3500,
                    })
                }    
            } catch (error) {
                toast.removeGroup('waiting');
                toast.add({
                    severity:   "error",
                    summary:    "Visualizar PDF",
                    detail:     "No se logro descargar el archivo solicitado.\n Intentelo mas tarde.",
                    life:       3500,
                })
            }
        }
    }

    const RegenerarPDF = async () => {
        try {
            ApiService.setHeader();
            await ApiService.get2(`AdmPago/RegenerarPDFCFDI/${registro.value.id}/P`,null);
            toast.add({
                severity:   "success",
                summary:    "Exitoso",
                detail:     "Se regenero el PDF Correctamente",
                life:       3500,
            });
        } catch (error) {
            toast.add({
                severity:   "error",
                summary:    "Visualizar PDF",
                detail:     "No se logro descargar el archivo solicitado.\n Intentelo mas tarde.",
                life:       3500,
            });
        }
    }

    const enviarCFDI = async () => {
        try {
            ApiService.setHeader();
            await ApiService.post(`AdmPago/EnviarCFDI/${registro.value.id}/I`,null);
            toast.add({
                severity:   "success",
                summary:    "Exitoso",
                detail:     "El CFDI Fue enviando por Email",
                life:       3500,
            });
        } catch (error) {
            toast.add({
                severity:   "error",
                summary:    "Enviar Email",
                detail:     "No se logro enviar el CFDO por correo electrónico.\n Intentelo mas tarde.",
                life:       3500,
            });
        }
    }

    const dataMutationNew = useMutation( { mutationFn: newRegistro,
                                                        onSuccess(data: Documento) {
                                                            toast.add({
                                                                severity:   'success',
                                                                summary:    'Éxito',
                                                                detail:     'Información guardada correctamente',
                                                                life:       3500
                                                            });
                                                            id = data.id;
                                                            registro.value = data;
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

    watch( data, async() => {
        if (data.value) {
            registro.value = {...data.value};
            if (id > 0) {
                isPending.value = true;
                const responserel = await ApiService.get2(`AdmPago/RelacionadoByDocumento/${registro.value.id}`,null)
                documentos_relacionados.value.splice(0);
                documentos_relacionados.value = <adm_documento_relacionado[]>responserel.data;                
                const response = await ApiService.get2(`AdmPago/DetalleByDocumento/${registro.value.id}`,null)
                documento_detalles.value.splice(0);
                documento_detalles.value = <Documento_Detalle[]>response.data;
                const respcliente       = await ApiService.get2(`AdmClientes/GetById/${registro.value.cliente_id}`,null);
                selectcliente.value     = <Cliente>respcliente.data;
                const respemisor        = await ApiService.get2(`AdmPropietario/GetById/${registro.value.propietario_id}`,null);
                selectpropietario.value = <Propietario>respemisor.data;
                const resoformapago     = await ApiService.get2(`SatFormaPago/GetById/${registro.value.formapago_id}`,null);
                selectformapago.value   = <FormaPago>resoformapago.data;
                const respcuentasbanco = await ApiService.get2(`AdmCtaBanco/GetById/${registro.value.ctabanco_id}`,null);
                selectcuentabanco.value = <AdmCtaBanco>respcuentasbanco.data;
                await CalcularTototales();
                if (registro.value.estatus == 'Aplicado' || registro.value.estatus == 'Timbrado' || registro.value.estatus == 'Cancelado' ){
                    const responsecfdi  = await ApiService.get2(`AdmPago/GetCFDI/${registro.value.id}/P`,null);
                    documento_cfdi.value = <Documento_CFDI>responsecfdi.data;
                }
                isPending.value = false;
            }
        }
    },{ immediate: true,deep: true });
    
    return {
        isPending,
        isError,
        tabActiva,
        registro,
        foliosdoctos,
        selecfoliodocto,
        selectcliente,
        propietarios,
        selectpropietario,
        clientesfiltrados,
        monedas,
        tiporelaciones,
        documento_relacionado,
        documentos_relacionados,
        tipo_docto_relacionado,
        selectmoneda,
        documento_detalles,
        dialogDetalle,
        formaspago,
        usoscfdi,
        selectformapago,
        selectusocfdi,
        isUpdatingDetalle,
        bTimbrando,
        dialogCancelacion,
        dialogPDFVisor,
        dialogXMLVisor,
        pdfDocumento,
        pdfViewer,
        cuentasbanco,
        selectcuentabanco,
        documento_cfdi,
        dialogRelacionados,
        dialogRelacionados_det,
        tipo_detalle_operacion,
        documento_detalle,
        selectfactura,
        facturasfiltrados,
        
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
        botonRegresar,
        openDialogRelacionados,
        timbrarFactura,
        cancelarFactura,
        cambiaDocumento,
        cambiaMoneda,
        buscarClientes,
        seleccionCliente,
        openDialogRelacionadosDet,
        closeDialogRelacionadoDet,
        eliminaRelacionado,
        cerrarVisualizarPDF,
        cerrarVisualizarXML,
        downloadXML,
        VisualizarXML,
        VisualizarPDF,
        RegenerarPDF,
        enviarCFDI,
        openDialogDetalle,
        closeDialogDetalle,
        eliminaDetalle,
        buscarDocumentos,
        seleccionDetalle,
        desAplicar,
    }

}

export default usePago;