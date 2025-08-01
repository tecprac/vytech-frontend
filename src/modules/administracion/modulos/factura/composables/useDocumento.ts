import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { 
    Documento, Documento_Detalle, adm_cp_adicionales, ConsultaCFDIResponse,
    adm_cp_mercancia, adm_cp_transporte, MailOptions, SatMotivoCancela,
    adm_documento_relacionado, Documento_CFDI, MovtoCliente,
    Permisos } from '../interfaces/interfaces';
import type { AdmCtaBanco } from '../../pago/interfaces/interfaces';
import type { Documento as Pago } from '../../pago/interfaces/interfaces';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import type { FolioDocumento } from '@/modules/configuracion/folioDocumento/interfaces/interfaces';
import type { Propietario } from '@/modules/administracion/catalogos/propietario/interfaces/interfaces';
import type { Agente } from '@/modules/administracion/catalogos/agente/interfaces/interfaces';
import type { Producto } from '@/modules/almacen/catalogos/producto/interfaces/interfaces';
import type { Trabajo } from '@/modules/taller/catalogos/trabajos/interfaces/interfaces';
import type { SatMoneda } from '@/modules/sat/catalogos/moneda/interfaces/interfaces';
import type { Almacen } from '@/modules/almacen/catalogos/almacen/interfaces/interfaces';
import type { FormaPago } from '@/modules/administracion/catalogos/clientes/interfaces/formapago';
import type { MetodoPago } from '@/modules/administracion/catalogos/clientes/interfaces/metodopago';
import type { UsoCFDI } from '@/modules/administracion/catalogos/clientes/interfaces/usocfdi';
import type { SatTipoRelacion } from '@/modules/sat/catalogos/tiporelacion/interfaces/interfaces';
import type { Orden } from '@/modules/taller/modulos/orden/interfaces/interfaces';
import Swal from 'sweetalert2';
import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';
import useUtilerias from '@/core/helpers/utilerias';
import { useRouter } from 'vue-router';


const getregistro = async( id:number ):Promise<Documento> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`AdmFactura/${id}`,null);
        return data;
    } else {
        const newRegistro:Documento = {
            id:                 		0,
            tipo_documento:     		'Factura',
            folio_documento_id:         0,
            folio:              		0,
            serie:              		'',
            propietario_id:     		0,
            cliente_id:         		0,
            agente_id:          		0,
            orden_id:           		0,
            fecha:              		new Date(),
            dias_credito:       		0,
            fecha_vence:        		new Date(),
            observaciones:      		'',
            descuentos:         		0,
            tasa_impuesto:      		0,
            tasa_retencion:     		0,
            subtotal:           		0,
            impuestos:          		0,
            retenciones:        		0,
            total:              		0,
            saldo:              		0,
            estatus:            		'SinAplicar',
            lugarexpedicion:    		'',
            almacen_id:         		0,
            usocfdi_id:         		0,
            formapago_id:       		0,
            metodopago_id:      		0,
            usuario_id:         		0,
            usuario_cancela_id: 		0,
            moneda_id:          		0,
            tipocambio:         		1,
            fecha_cancela:       		new Date(),
            parcialidades:       		0,
            numparcialidad:     		0,
            errortimbrado:       		'',
            compcartaporte:     		0,
            motivocancelacion_id: 		0,
            foliosustitucion:     		'',
            codigocancela:       		'',
            carta_porte:                false,
            activo:             		true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Documento):Promise<Documento> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`AdmFactura`,registro);
    return data;
};

const updateRegistro =async (registro:Documento ):Promise<Documento> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`AdmFactura/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Documento ):Promise<Documento> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`AdmFactura/${registro.id}`);
    return data;
};

const useDocumento = (id: number ) => {
    const router                = useRouter();
    const store                 = useAuthStore();
    const confirm               = useConfirm();
    const toast                 = useToast();
    const MensajeError          = ref<string>('');
    const tabActiva             = ref<string>('0');
    const registro              = ref<Documento>({
                                    id:                 		0,
                                    tipo_documento:     		'Factura',
                                    folio_documento_id:         0,
                                    folio:              		0,
                                    serie:              		'',
                                    propietario_id:     		0,
                                    cliente_id:         		0,
                                    agente_id:          		0,
                                    orden_id:           		0,
                                    fecha:              		new Date(),
                                    dias_credito:       		0,
                                    fecha_vence:        		new Date(),
                                    observaciones:      		'',
                                    descuentos:         		0,
                                    tasa_impuesto:      		0,
                                    tasa_retencion:     		0,
                                    subtotal:           		0,
                                    impuestos:          		0,
                                    retenciones:        		0,
                                    total:              		0,
                                    saldo:              		0,
                                    estatus:            		'SinAplicar',
                                    lugarexpedicion:    		'',
                                    almacen_id:         		0,
                                    usocfdi_id:         		0,
                                    formapago_id:       		0,
                                    metodopago_id:      		0,
                                    usuario_id:         		store.user.id,
                                    usuario_cancela_id: 		0,
                                    moneda_id:          		0,
                                    tipocambio:         		1,
                                    fecha_cancela:       		new Date(),
                                    parcialidades:       		0,
                                    numparcialidad:     		0,
                                    errortimbrado:       		'',
                                    compcartaporte:     		0,
                                    motivocancelacion_id: 		0,
                                    foliosustitucion:     		'',
                                    codigocancela:       		'',
                                    carta_porte:                false,
                                    activo:             		true,
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
    const agentes               = ref<Agente[]>([]);
    const selectagente          = ref<Agente>({
                                        id: 		0,
                                        nombre: 	'',
                                        apaterno: 	'',
                                        amaterno: 	'',
                                        porc_venta: 0,
                                        porc_cobro:	0,
                                        activo:		true,
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
    const almacenes             = ref<Almacen[]>([]);
    const selectalmacen         = ref<Almacen>({
                                    id:             0,
                                    nombre:         '',
                                    esconsignacion: false,
                                    direccion:      '',
                                    ciudad:         '',
                                    estado:         '',
                                    activo:         true,
                                });
    const selectalmacen_det     = ref<Almacen>({
                                    id:             0,
                                    nombre:         '',
                                    esconsignacion: false,
                                    direccion:      '',
                                    ciudad:         '',
                                    estado:         '',
                                    activo:         true,
                                });                                     
    const formaspago            = ref<FormaPago[]>([]);
    const metodospago           = ref<MetodoPago[]>([]);
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
    const selectmetodopago      = ref<MetodoPago>({
                                        id: 0,
                                        c_metodopago: '',
                                        descripcion: '',
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
    const selectusocfdi_pago    = ref<UsoCFDI>({
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
    const selectproducto        = ref();
    const productosfiltrados    = ref<Producto[]>([]);
    const selecttrabajo         = ref<Trabajo>({
                                        id:                 0,
                                        descripcion:        '',
                                        division_id:        0,
                                        horasestandar:      0,
                                        ficha_tecnica:      '',
                                        codigo:             '',
                                        costo_reposicion:   0,
                                        margen_utilidad:    0,
                                        precio:             0,
                                        estatus:            '',
                                        descvariable:       false,
                                        claveprodserv_id:   0,
                                        claveunidad_id:     0,
                                        objetoimpuesto_id:  0,
                                        impiva:             0,
                                        impiesps:           0,
                                        retencion_isr:      0,
                                        retencion_iva:      0,
                                        talle_division:     undefined,
                                        sat_claveprodserv:  undefined,
                                        sat_claveunidad:    undefined,
                                        sat_objetoimpuesto: undefined,
                                        activo:             true,
                                    });
    const trabajosfiltrados     = ref<Trabajo[]>([]);
    const documento_detalles    = ref<Documento_Detalle[]>([]);
    const documento_detalle     = ref<Documento_Detalle>({
                                    id: 					0,
                                    documento_id: 			0,
                                    tipo_partida:           '',
                                    producto_id: 			0,
                                    trabajo_id:             0,
                                    almacen_id: 			0,
                                    orden_trabajo_id: 		0,
                                    requision_detalle_id: 	0,
                                    cantidad: 				0,
                                    descripcion:            '',
                                    devueltas: 				0,
                                    costo: 					0,
                                    costotal: 				0,
                                    precio_unitario: 		0,
                                    precio: 				0,
                                    precio_final: 			0,
                                    importe: 				0,
                                    porcdescuento: 			0,
                                    descuento: 				0,
                                    importe_final: 			0,
                                    impuesto: 				0,
                                    porcentaje_impuesto: 	0,
                                    retencion: 				0,
                                    porcentaje_retencion: 	0,
                                    observaciones: 			'',
                                    activo: 				true,
                                });
    const documento_detalles2   = ref<any[][]>([]);
    const dialogDetalle         = ref<boolean>(false);
    const tipo_detalle          = ref<string>('Servicio') // Servicio,Producto
    const tipo_detalle_operacion= ref<string>('Create') // Create,Update,Show
    const imp_descuento         = ref<number>(0);
    const isUpdatingDetalle     = ref<boolean>(false);
    const dialogRelacionados    = ref<boolean>(false);
    const dialogRelacionados_det= ref<boolean>(false);
    const documento_relacionado = ref<adm_documento_relacionado>({
                                        id:             0,
                                        documento_id:   0,
                                        origen:         '',
                                        id_documentorel:0,
                                        uuid:           '',
                                        tiporelacion_id: 0,
                                        activo:         true,
                                    });
    const documentos_relacionados = ref<adm_documento_relacionado[]>([]);
    const tipo_docto_relacionado = ref<string[]>(['Externo','Interno']);
    const bTimbrando            = ref<boolean>(false);
    const dialogCancelacion     = ref<boolean>(false);
    const dialogMovimientos     = ref<boolean>(false);
    const dialogPDFVisor        = ref<boolean>(false);
    const dialogXMLVisor        = ref<boolean>(false);
    const dialogEnviarMail      = ref<boolean>(false);
    const dialogConsultaSAT     = ref<boolean>(false);
    const documento_cfdi        = ref<Documento_CFDI>();
    const pdfDocumento          = ref();
    const filePDF               = ref(null);
    const pdfViewer             = ref();
    const movtos_cliente        = ref<MovtoCliente[]>([]);
    const orden                 = ref<Orden>();
    const mailOptions           = ref<MailOptions>({
                                    to:         '',
                                    from:       '',
                                    bcc:        '',
                                    subject:    '',
                                    htmlBody:   '',
                                });
    const consultaSAT           = ref<ConsultaCFDIResponse>({
                                    'a:CodigoEstatus':      '',
                                    'a:EsCancelable':       '',
                                    'a:Estado':             '',
                                    'a:EstatusCancelacion': '',
                                    'a:ValidacionEFOS':     '',
                                });
    const satmotivoscancela     = ref<SatMotivoCancela[]>([]);
    const selectmovitocancela   = ref<SatMotivoCancela>({
                                    id:             0,
                                    c_motivo:       '',
                                    descripcion:    '',
                                });
    const foliosustitucion      = ref<string>('');
    const dialogPago            = ref<boolean>(false);
    const pago                  = ref<Pago>({
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
                                    observaciones: 	        '',
                                    estatus: 			    'Aplicado',
                                    errortimbrado: 		    '',
                                    filepdf: 			    '',
                                    usocfdi_id: 		    0,
                                    activo:                 true,
                                });
    const formaspago_pago       = ref<FormaPago[]>([]);
    const selectformapago_pago  = ref<FormaPago>({
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
    const selectmoneda_pago     = ref<SatMoneda>({
                                    id:         0,
                                    c_moneda:   '',
                                    descripcion: '',
                                    decimales:  0,
                                    activo:     true,
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
    const foliosdoctos_pago     = ref<FolioDocumento[]>([]);
    const selecfoliodocto_pago  = ref<FolioDocumento>({
                                        id:             0,
                                        modulo_id:      0,
                                        folio_siguiente: 0,
                                        documento:      '',
                                        serie:          '',
                                        activo:         true
                                    });
    const permisos              = ref<Permisos[]>([]);
    const sPermisos             = ref<string>('');
    
    const { formatCurrency, formatNumber2Dec } = useUtilerias();

    const { isPending, data, isError } = useQuery({
            queryKey:               ['factura', id],
            queryFn:                () => getregistro(id),
            refetchOnWindowFocus:   (id > 0 ? true : false),
            retry:                  false,
    });

    onMounted(async () => {
        isPending.value = true;
        permisos.value = store.permisos.filter((element: any) => element.codigo == '047'); // Administración->Modulos->Factura a Clientes
        permisos.value.forEach(element => {
            sPermisos.value += element.permiso+',';
        });        
        foliosdoctos.value.splice(0);
        propietarios.value.splice(0);
        agentes.value.splice(0);
        monedas.value.splice(0);
        almacenes.value.splice(0);
        formaspago.value.splice(0);
        metodospago.value.splice(0);
        usoscfdi.value.splice(0);
        tiporelaciones.value.splice(0);
        satmotivoscancela.value.splice(0);
        const response  = await ApiService.get2('Modulos/SearchByField/codigo/047',null);
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
        const respmotivocancela = await ApiService.get2('SatMotivoCancela/listado',null);
        satmotivoscancela.value = <SatMotivoCancela[]>respmotivocancela.data;
        const respagente = await ApiService.get2('AdmAgente/listado',null);
        agentes.value = <Agente[]>respagente.data;
        if (agentes.value.length > 0){
            if(id == 0) selectagente.value = agentes.value[0];
        } else {
            Swal.fire({
                title:  'No existen Agentes/Vendedores',
                html:   'No se encontraron Agentes/Vendedores.<br>Consulte a su Administrador',
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
        const resalmacen = await ApiService.get2('InvAlmacen/listado',null);
        almacenes.value = <Almacen[]>resalmacen.data;
        if (almacenes.value.length > 0){
            if (id == 0) selectalmacen.value = almacenes.value[0];
            selectalmacen_det.value = selectalmacen.value;
        } else {
            Swal.fire({
                title:  'No existen Almacenes',
                html:   'No se encontraron Almacenes dentro del Catalogo de Almacenes.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const resformaspago = await ApiService.get2('SatFormaPago/listado',null);
        formaspago.value = <FormaPago[]>resformaspago.data;
        const resmetodopago = await ApiService.get2('SatMetodoPago/listado',null);
        metodospago.value = <MetodoPago[]>resmetodopago.data;
        const resusoscfdi = await ApiService.get2('SatUsoCFDI/listado',null);
        usoscfdi.value = <UsoCFDI[]>resusoscfdi.data;
        isPending.value = false;
    });

    const cambiaDocumento = () => {
        registro.value.folio = selecfoliodocto.value.folio_siguiente;
        registro.value.serie = selecfoliodocto.value.serie;
    }

    const cambiaMoneda = () => {
        registro.value.moneda_id = selectmoneda.value.id;
    }

    const cambiaMoneda_pago = () => {
        pago.value.moneda_id = selectmoneda_pago.value.id;
    }

    const buscarClientes = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`AdmClientes/SearchByText/${event.query}`,null);
            const clientes:Cliente[] = response.data;
            clientesfiltrados.value = clientes;
        }
    }

    const buscarProductos = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`InvProducto/SearchByText/${event.query}`,null);
            const refacciones:Producto[] = response.data;
            productosfiltrados.value = refacciones;
        }
    }

    const buscarTrabajos = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`Trabajos/SearchByText/${event.query}`,null);
            const trabajos:Trabajo[] = response.data;
            trabajosfiltrados.value = trabajos;
        }
    }

    const seleccionCliente = () => {
        registro.value.formapago_id = selectcliente.value.formapago_id;
        registro.value.metodopago_id = selectcliente.value.metodopago_id;
        registro.value.usocfdi_id = selectcliente.value.usocfdi_id;
        selectformapago.value = formaspago.value.find(item => item.id == selectcliente.value.formapago_id)!;
        selectmetodopago.value = metodospago.value.find(item => item.id == selectcliente.value.metodopago_id)!;
        selectusocfdi.value = usoscfdi.value.find(item => item.id == selectcliente.value.usocfdi_id)!;
    }

    const seleccionDetalle = async () => {
        documento_detalle.value.tipo_partida = tipo_detalle.value;
        imp_descuento.value = 0;
        if (tipo_detalle.value == 'Servicio') {
            documento_detalle.value.trabajo_id = selecttrabajo.value.id;
            documento_detalle.value.cantidad = selecttrabajo.value.horasestandar;
            documento_detalle.value.precio = selecttrabajo.value.precio;
            documento_detalle.value.descripcion = selecttrabajo.value.descripcion;
            documento_detalle.value.porcentaje_impuesto = selecttrabajo.value.impiva;
            documento_detalle.value.porcentaje_retencion = selecttrabajo.value.retencion_iva;
            documento_detalle.value.costo = selecttrabajo.value.costo_reposicion;
        } else if (tipo_detalle.value == 'Producto') {
            documento_detalle.value.trabajo_id = selectproducto.value.id;
            documento_detalle.value.cantidad = 1;
            documento_detalle.value.precio = selectproducto.value.precio;
            documento_detalle.value.descripcion = selectproducto.value.descripcion;
            documento_detalle.value.porcentaje_impuesto = selectproducto.value.impiva;
            documento_detalle.value.porcentaje_retencion = selectproducto.value.retencion_iva;
            documento_detalle.value.costo = selectproducto.value.costo_reposicion;
        }
    }

    const CalculaImportes = () => {
        documento_detalle.value.precio_unitario = documento_detalle.value.precio;
        documento_detalle.value.importe = documento_detalle.value.cantidad * documento_detalle.value.precio;
        documento_detalle.value.impuesto = documento_detalle.value.importe * (documento_detalle.value.porcentaje_impuesto / 100);
        documento_detalle.value.retencion = documento_detalle.value.importe * (documento_detalle.value.porcentaje_retencion / 100);
        if (documento_detalle.value.porcdescuento > 0.0) {
            imp_descuento.value = documento_detalle.value.importe * ( documento_detalle.value.porcdescuento / 100 );
            documento_detalle.value.descuento = documento_detalle.value.importe * ( documento_detalle.value.porcdescuento / 100 );
            documento_detalle.value.impuesto = (documento_detalle.value.importe - documento_detalle.value.descuento) * (documento_detalle.value.porcentaje_impuesto / 100);
            documento_detalle.value.retencion = (documento_detalle.value.importe - documento_detalle.value.descuento) * (documento_detalle.value.porcentaje_retencion / 100);
        }
        if (documento_detalle.value.porcdescuento == 0 && imp_descuento.value > 0) {
            documento_detalle.value.porcdescuento = ( imp_descuento.value  / documento_detalle.value.importe ) * 100;
            documento_detalle.value.descuento = imp_descuento.value;
            documento_detalle.value.impuesto = (documento_detalle.value.importe - documento_detalle.value.descuento) * (documento_detalle.value.porcentaje_impuesto / 100);
            documento_detalle.value.retencion = (documento_detalle.value.importe - documento_detalle.value.descuento) * (documento_detalle.value.porcentaje_retencion / 100);
        }
        documento_detalle.value.importe_final = documento_detalle.value.importe - documento_detalle.value.descuento;
    }

    const CalcularTototales = async () => {
        registro.value.descuentos = 0;
        registro.value.subtotal = 0;
        registro.value.impuestos = 0;
        registro.value.retenciones = 0;
        registro.value.total = 0;
        for (let h = 0; h < documento_detalles2.value.length; h++) {
            const item = documento_detalles2.value[h];
            registro.value.descuentos   += +item[0].descuento;
            registro.value.subtotal     += +item[0].importe_final;
            registro.value.impuestos    += +item[0].impuesto;
            registro.value.retenciones  += +item[0].retencion;
        }
        registro.value.total = (+registro.value.subtotal + +registro.value.impuestos) - +registro.value.retenciones;
        const data:object = {
            descuentos: registro.value.descuentos,
            subtotal: registro.value.subtotal,
            impuestos: registro.value.impuestos,
            retenciones: registro.value.retenciones,
        }
        await ApiService.post(`AdmFactura/updateTotales/${registro.value.id}`,data);
    }

    const openDialogMovimientos = async () => {
        movtos_cliente.value.splice(0);
        if (registro.value.id > 0) {
            const response = await ApiService.get2(`AdmFactura/MovtosCliente/${registro.value.id}`,null);
            movtos_cliente.value = response.data;
        }
        dialogMovimientos.value = true;
    }

    const openDialogDetalle = async (detalle_id:number, tipo: string, caso: string) => {
        tipo_detalle.value = tipo;
        tipo_detalle_operacion.value = caso;
        if(detalle_id > 0){
            const response = await ApiService.get2(`AdmFactura/DetalleById/${detalle_id}`,null);
            documento_detalle.value = <Documento_Detalle>response.data.registro;
            if (tipo == 'Producto') {
                selectalmacen_det.value = almacenes.value.filter(item => item.id == documento_detalle.value.almacen_id)[0];
                const respproducto = await ApiService.get2(`InvProducto/GetById/${documento_detalle.value.producto_id}`,null);
                selectproducto.value = <Producto>respproducto.data;
            }
            if (tipo == 'Servicio') {
                const resptrab = await ApiService.get2(`Trabajos/GetById/${documento_detalle.value.trabajo_id}`,null);
                selecttrabajo.value = <Trabajo>resptrab.data;
            }
        }
        dialogDetalle.value = true;
    }

    const openDialogRelacionados = async() => {
        if (documento_detalles2.value.length == 0){
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
                documento_relacionado.value.documento_id = registro.value.id;
                await ApiService.post('AdmFactura/Relacionado',documento_relacionado.value);
                const response = await ApiService.get2(`AdmFactura/RelacionadoByDocumento/${registro.value.id}`,null)
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
            documento_id:   0,
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
                if ( tipo_detalle.value == 'Producto' ? selectproducto.value.id == 0 : selecttrabajo.value.id == 0 ) {
                    toast.add({
                        severity:'error', summary: tipo_detalle.value,
                        detail: 'Debe seleccionar un '+tipo_detalle.value, life: 3500,
                    });
                    return;
                }
            } catch (error){
                toast.add({
                    severity: 'error', summary: tipo_detalle.value,
                    detail: 'Debe seleccionar un '+tipo_detalle.value, life: 3500,
                });
                return;
            }
            if (documento_detalle.value.cantidad <= 0) {
                toast.add({
                    severity: 'error', summary: 'Cantidad',
                    detail: 'La Cantidad debe ser mayor a 0', life: 3500,
                });
                return;
            }
            if (documento_detalle.value.precio <= 0) {
                toast.add({
                    severity: 'error', summary: 'Precio',
                    detail: 'El Precio debe ser mayor a 0', life: 3500,
                });
                return;
            }
            documento_detalle.value.documento_id = registro.value.id;
            documento_detalle.value.producto_id = tipo_detalle.value == 'Producto' ? selectproducto.value.id : 0;
            documento_detalle.value.trabajo_id = tipo_detalle.value == 'Servicio' ? selecttrabajo.value.id : 0;
            documento_detalle.value.almacen_id = tipo_detalle.value == 'Producto' ? selectalmacen_det.value.id : 0;
            try {
                isUpdatingDetalle.value = true;
                CalculaImportes();
                if ( tipo_detalle_operacion.value == 'Create' ){
                    await ApiService.post('AdmFactura/Detalle',documento_detalle.value);
                } else if (tipo_detalle_operacion.value == 'Update') {
                    await ApiService.patch(`AdmFactura/Detalle/${documento_detalle.value.id}`,documento_detalle.value);
                }
                const response = await ApiService.get2(`AdmFactura/DetalleByDocumento/${registro.value.id}`,null)
                documento_detalles.value.splice(0);
                documento_detalles2.value.splice(0);
                documento_detalles.value = <Documento_Detalle[]>response.data;
                documento_detalles2.value = response.data;
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
        imp_descuento.value = 0;
        selectproducto.value = null;
        selecttrabajo.value = <Trabajo>({
                                        id:                 0,
                                        descripcion:        '',
                                        division_id:        0,
                                        horasestandar:      0,
                                        ficha_tecnica:      '',
                                        codigo:             '',
                                        costo_reposicion:   0,
                                        margen_utilidad:    0,
                                        precio:             0,
                                        estatus:            '',
                                        descvariable:       false,
                                        claveprodserv_id:   0,
                                        claveunidad_id:     0,
                                        objetoimpuesto_id:  0,
                                        impiva:             0,
                                        impiesps:           0,
                                        retencion_isr:      0,
                                        retencion_iva:      0,
                                        talle_division:     undefined,
                                        sat_claveprodserv:  undefined,
                                        sat_claveunidad:    undefined,
                                        sat_objetoimpuesto: undefined,
                                        activo:             true,
                                });
        dialogDetalle.value = false;
        documento_detalle.value = {
                                id: 					0,
                                documento_id: 			0,
                                tipo_partida:           '',
                                producto_id: 			0,
                                trabajo_id:             0,
                                almacen_id: 			0,
                                orden_trabajo_id: 		0,
                                requision_detalle_id: 	0,
                                cantidad: 				0,
                                descripcion:            '',
                                devueltas: 				0,
                                costo: 					0,
                                costotal: 				0,
                                precio_unitario: 		0,
                                precio: 				0,
                                precio_final: 			0,
                                importe: 				0,
                                porcdescuento: 			0,
                                descuento: 				0,
                                importe_final: 			0,
                                impuesto: 				0,
                                porcentaje_impuesto: 	0,
                                retencion: 				0,
                                porcentaje_retencion: 	0,
                                observaciones: 			'',
                                activo: 				true,
                            };
        isUpdatingDetalle.value = false;
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
                    await ApiService.delete(`AdmFactura/Relacionado/${data.id}`);
                    const response = await ApiService.get2(`AdmFactura/RelacionadoByDocumento/${registro.value.id}`,null)
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
                    await ApiService.delete(`AdmFactura/Detalle/${data[0].id}`);
                    const response = await ApiService.get2(`AdmFactura/DetalleByDocumento/${registro.value.id}`,null)
                    documento_detalles.value.splice(0);
                    documento_detalles2.value.splice(0);
                    documento_detalles.value = <Documento_Detalle[]>response.data;
                    documento_detalles2.value = response.data;
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

    const botonRegresar = async () => {
        if(registro.value.id > 0 && registro.value.estatus == 'SinAplicar') {
            if (documento_detalles2.value.length == 0){
                confirm.require({
                    header: "Confirmación",
                    position: 'center',
                    message: "El Documento no tiene conceptos, ¿Desea Borrarlo?",
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
                            await ApiService.delete(`AdmFactura/${registro.value.id}`)
                            toast.add({ severity: 'info', summary: 'Eliminado', detail: 'Documento eliminado', life: 3000 });
                        } catch (error) {
                            toast.add({ severity: 'error', summary: 'Error', detail: 'Intentelo nuevamente mas tarde\n'+error, life: 3000 });
                        }
                        router.push({name: 'factura'});
                        return;
                    },
                    reject: () => {
                        toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                        router.push({name: 'factura'});
                        return;
                    }
                })
            } else {
                router.push({name: 'factura'});
                return;    
            }
        } else {
            router.push({name: 'factura'});
            return;
        }
    }

    const timbrarFactura = async () => {
        if (documento_detalles2.value.length == 0){
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
                modulo_id:  51
            }
            const response = await ApiService.post(`AdmFactura/Timbrar/${registro.value.id}`,body);
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
                const responseregistro = await ApiService.get2(`AdmFactura/${id}`,null);
                registro.value = {...responseregistro.data};
                const responsecfdi  = await ApiService.get2(`AdmFactura/GetCFDI/${registro.value.id}/I`,null);
                documento_cfdi.value = <Documento_CFDI>responsecfdi.data;
            }
            bTimbrando.value = false;
        } catch (error: any) {
            toast.removeGroup('waiting');
            bTimbrando.value = false;
            toast.add({
                severity:   'error',
                summary:    'Error al Intentar timbrar el documento\n'+error,
                detail:     'Se genero el error '+error,
                life:       3500
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
                        const response = await ApiService.patch(`AdmFactura/${registro.value.id}`,data);
                        registro.value = <Documento>response.data;
                        toast.add({ severity: 'success', summary: 'Documento Cancelado', detail: 'Documento cancelado correctamente', life: 3000 });
                    } catch (error) {
                        toast.add({ severity: 'error', summary: 'Error al Cancelar', detail: 'Se genero un error al intentar cancelar', life: 3000 });
                    }
                }
                if (registro.value.estatus == 'Timbrado') {
                    try {
                        Swal.fire({
                            title: 'Consultando estatus del documento en el SAT...',
                            showConfirmButton: false
                        });
                        Swal.showLoading();
                        ApiService.setHeader();
                        const response = await ApiService.post(`AdmFactura/ConsultarEstatusSAT/${registro.value.id}/I`,null);
                        consultaSAT.value = <ConsultaCFDIResponse>response.data;
                        Swal.close();
                        if (consultaSAT.value['a:Estado'] == 'Cancelado') {
                            Swal.fire({
                                icon: 'info',
                                title: 'Respuesta SAT\nDocumento Cancelado',
                                html:   consultaSAT.value['a:EstatusCancelacion'] ? consultaSAT.value['a:EstatusCancelacion'] : '',
                                confirmButtonText: 'Cerrar',
                                showConfirmButton: true
                            });
                            return;
                        } else if ( consultaSAT.value['a:Estado'] == 'No Encontrado') {
                            Swal.fire({
                                icon: 'error',
                                title: 'Respuesta SAT\nDocumento no encontrado',
                                confirmButtonText: 'Cerrar',
                                showConfirmButton: true
                            });
                            return;
                        } else if (consultaSAT.value['a:Estado'] == 'Vigente' && consultaSAT.value['a:EsCancelable'] == 'No cancelable') {
                            Swal.fire({
                                icon: 'info',
                                title: 'Respuesta SAT\nDocumento Vigente',
                                html:   '<b>'+consultaSAT.value['a:EsCancelable']+'</b>',
                                confirmButtonText: 'Cerrar',
                                showConfirmButton: true
                            });
                            return;
                        } else if (consultaSAT.value['a:Estado'] == 'Vigente' && (consultaSAT.value['a:EsCancelable'] == 'Cancelable con aceptación' || consultaSAT.value['a:EsCancelable'] == 'Cancelable sin aceptación') ) {
                            if (consultaSAT.value['a:EstatusCancelacion'] == 'En proceso'){
                                Swal.fire({
                                    icon: 'info',
                                    title: 'Respuesta SAT\nDocumento Vigente',
                                    html:   'El Documento se encuentra en <b>Proceso de Cancelación</b>',
                                    confirmButtonText: 'Cerrar',
                                    showConfirmButton: true
                                });
                                return;
                            } else if (consultaSAT.value['a:EstatusCancelacion'] == 'Plazo vencido' || consultaSAT.value['a:EstatusCancelacion'] == 'Solicitud rechazada') {
                                Swal.fire({
                                    icon:   'warning',
                                    title:  'Respuesta SAT\nDocumento Vigente',
                                    html:   `El estatus de la Cancelación fue: <b>${consultaSAT.value['a:EstatusCancelacion']}</b>`,
                                    confirmButtonText: 'Cerrar',
                                    showConfirmButton: true
                                });
                                return;
                            } else {
                                Swal.fire({
                                    title: 'Consultando relaciones con otros documentos en el SAT...',
                                    showConfirmButton: false
                                });
                                Swal.showLoading();
                                const response = await ApiService.post(`AdmFactura/ConsultarRelacionesSAT/${registro.value.id}/I`,null);
                                Swal.close();
                                const respuesta = JSON.parse(response.data);
                                if (respuesta.codStatus == '2000'){
                                    Swal.fire({
                                        icon:   'warning',
                                        title:  'Respuesta SAT\nConsulta Relacionados',
                                        html:   respuesta.message+'\nNo es posible cancelar el documento',
                                        confirmButtonText: 'Cerrar',
                                        showConfirmButton: true,
                                    });
                                    return;
                                }
                                dialogCancelacion.value = true;
                            }
                        }
                    
                    } catch (error) {
                        Swal.close();
                        toast.add({
                            severity:   'error',
                            summary:    'Se genero un error',
                            detail:     'Se genero el error al intentar consultar \n'+error,
                            life:       4000,
                        });
                    }
                }
            },
            reject: () => {
                return;
            }
        });
    }

    const cancelacionSAT = async () => {
        if (selectmovitocancela.value.id == 0) {
            toast.add({
                severity:   'error',
                summary:    'Motivo Cancelación',
                detail:     'Debe selecionar un motivo para la cancelación',
                life:       4000,
            });
            return;
        }
        if (selectmovitocancela.value.c_motivo == '01' && foliosustitucion.value.trim().length == 0){
            toast.add({
                severity:   'error',
                summary:    'Folio Sustitución',
                detail:     'Cuando el motivo es 01 debe capturar un folio de sustituación',
                life:       4000,
            });
            return;
        }
        dialogCancelacion.value = false;
        Swal.fire({
            title:  'Enviando solicitud de cancelación al SAT',
            showConfirmButton: false
        });
        Swal.showLoading();
        try {
            const body = {
                c_motivo:           selectmovitocancela.value.c_motivo,
                descripcion:        selectmovitocancela.value.descripcion,
                foliosustitucion:   foliosustitucion.value,
                estadocfdi:         consultaSAT.value['a:Estado'],
                estatuscancelacion: consultaSAT.value['a:EstatusCancelacion'],
            }
            const response = await ApiService.post(`AdmFactura/CancelacionSAT/${registro.value.id}/I`,body);
            console.log(response.data);
            Swal.close();
        } catch (error) {
            Swal.close();
            toast.add({
                severity:   "error",
                summary:    "Envio de cancelación al SAT",
                detail:     "Se genero un error en la solicitud. \n"+error,
                life:       3500,
            });
        }
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

    const VistaPreviaPDF = async () => {
        filePDF.value = null;
        try {
            toast.add({
                severity:   'info',
                summary:    "Descargando archivo pdf...",
                group:      'waiting',
            });
            const body = {
                usuario_id: store.user.id,
                modulo_id:  51
            }
            const responsefile = await ApiService.post(`AdmFactura/VistaPrevia/${registro.value.id}`,body);
            const filename = responsefile.data.filename;
            const response = await ApiService.get2('download/temp/'+filename,{responseType: 'arraybuffer'});
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
            });
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
            await ApiService.get2(`AdmFactura/RegenerarPDFCFDI/${registro.value.id}/I`,null);
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

    const openDialogEmail = async () => {
        dialogEnviarMail.value = true;
    }

    const consultarEstatusSAT = async () => {
        consultaSAT.value = {
            "a:CodigoEstatus":      '',
            "a:EsCancelable":       '',
            'a:Estado':             '',
            "a:EstatusCancelacion": '',
            "a:ValidacionEFOS":     '',
        };
        toast.add({
            group: 'waiting',
            severity: 'info',
            summary:    'Consultando estatuso del CFDI en el SAT...'
        });
        try {
            ApiService.setHeader();
            const response = await ApiService.post(`AdmFactura/ConsultarEstatusSAT/${registro.value.id}/I`,null);
            consultaSAT.value = <ConsultaCFDIResponse>response.data;
            toast.removeGroup('waiting');
            dialogConsultaSAT.value = true;
            toast.add({
                severity:   "success",
                summary:    "Exitoso",
                detail:     "La consulta al SAT fue exitosa",
                life:       3500,
            });
            
        } catch (error) {
            toast.removeGroup('waiting');
            toast.add({
                severity:   "error",
                summary:    "Consulta SAT",
                detail:     "Se genero un error al consultar el estatus del documento en el SAT.\n"+error,
                life:       3500,
            });
        }
    }

    const enviarCFDI = async () => {
        if (mailOptions.value.from.trim().length == 0) {
            toast.add({
                severity:   "error",
                summary:    "Cuenta origen",
                detail:     "La cuenta origen no puede estar vacía.\n Verifique con su administrador",
                life:       3500,
            });
            return;
        }
        if (mailOptions.value.to.trim().length == 0) {
            toast.add({
                severity:   "error",
                summary:    "Destinatario(s)",
                detail:     "El destinatario no puede estar vació",
                life:       3500,
            });
            return;
        }
        if (mailOptions.value.subject.trim().length == 0) {
            toast.add({
                severity:   "error",
                summary:    "Asunto",
                detail:     "El asunto del correo no puede estar vacío",
                life:       3500,
            });
            return;
        }
        confirm.require({
            message: 'Esta seguro de enviar el correo ?',
            icon:   'pi pi-exclamation-triangle',
            rejectProps: {
                label: 'No',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: { 
                label: 'Si, Enviar' ,
                severity: 'warn'
            },
            accept: async () => {
                dialogEnviarMail.value = false;
                toast.add({
                    group: 'waiting',
                    severity: 'info',
                    summary:    'Enviando correo...'
                });
                try {
                    ApiService.setHeader();
                    await ApiService.post(`AdmFactura/EnviarCFDI/${registro.value.id}/I`,mailOptions.value);
                    toast.add({
                        severity:   "success",
                        summary:    "Exitoso",
                        detail:     "El CFDI Fue enviando por Email",
                        life:       3500,
                    });
                    toast.removeGroup('waiting');
                } catch (error) {
                    toast.removeGroup('waiting');
                    toast.add({
                        severity:   "error",
                        summary:    "Enviar Email",
                        detail:     "No se logro enviar el CFDO por correo electrónico.\n"+error,
                        life:       3500,
                    });
                }
            },
        });
        
    }

    const openDialogPago = async () => {
        toast.add({
            severity:   'info',
            summary:    `Consultando información de pagos...`,
            group:      'waiting',    
        });
        pago.value = {
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
                        observaciones: 	        '',
                        estatus: 			    'Aplicado',
                        errortimbrado: 		    '',
                        filepdf: 			    '',
                        usocfdi_id: 		    0,
                        activo:                 true,
        };
        formaspago_pago.value.splice(0);
        foliosdoctos_pago.value.splice(0);
        cuentasbanco.value.splice(0);
        const response  = await ApiService.get2('Modulos/SearchByField/codigo/052',null);
        const modulo = response.data[0];
        const respfoliosdocto = await ApiService.get2(`FolioDocumento/SearchByModuloId/${modulo.id}`,null);
        foliosdoctos_pago.value = <FolioDocumento[]>respfoliosdocto.data;
        if (foliosdoctos_pago.value.length > 0 ) {
            selecfoliodocto_pago.value = foliosdoctos_pago.value[0];
            pago.value.folio  = selecfoliodocto.value.folio_siguiente;
            pago.value.serie  = selecfoliodocto.value.serie;
        } else {
            Swal.fire({
                title:  'No existe Folio',
                html:   'No se encontraron Folios para este tipo de Documento.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const resformaspago = await ApiService.get2('SatFormaPago/listado',null);
        formaspago_pago.value = <FormaPago[]>resformaspago.data;
        selectformapago_pago.value = formaspago_pago.value[0];
        const respcuentasbanco = await ApiService.get2('AdmCtaBanco/listado',null);
        cuentasbanco.value = <AdmCtaBanco[]>respcuentasbanco.data;
        selectusocfdi_pago.value = usoscfdi.value.find(item => item.c_usocfdi == 'CP01')!;
        if (cuentasbanco.value.length > 0) {
            selectcuentabanco.value = cuentasbanco.value[0];
        } else {
            Swal.fire({
                title:  'No existen Cuentas Bancarias',
                html:   'No se encontraron Cuentas Bancarias registradas.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        selectmoneda_pago.value = monedas.value[0];
        toast.removeGroup('waiting');
        dialogPago.value = true;
    }

    const closeDialogPago = async (tipo:string) => {
        if(tipo == 'cerrar') {
            dialogPago.value = false;
        } else {
            if (pago.value.fecha_pago > new Date()) {
                toast.add({
                    severity:   'error', life:       3500,
                    summary:    'La fecha de pago no puede ser futura',
                });
                return;
            }
            if (selectformapago_pago.value.id == 0) {
                toast.add({
                    severity:   'error', life:       3500,
                    summary:    'Debe seleccionar una forma de pago',
                });
                return;
            }
            if (pago.value.importe > registro.value.saldo) {
                toast.add({
                    severity:   'error',life:       3500,
                    summary:    'El Importe del pago es mayor al saldo',
                });
                return;
            }
            if (pago.value.importe == 0) {
                toast.add({
                    severity:   'error',life:       3500,
                    summary:    'El Importe del pago debe ser mayor a 0',
                });
                return;
            }
            pago.value.folio_documento_id   = selecfoliodocto_pago.value.id;
            pago.value.cliente_id           = registro.value.cliente_id;
            pago.value.usuario_id           = store.user.id;
            pago.value.formapago_id         = selectformapago_pago.value.id;
            pago.value.usocfdi_id           = selectusocfdi_pago.value.id;
            pago.value.moneda_id            = selectmoneda_pago.value.id;
            pago.value.propietario_id       = registro.value.propietario_id;
            pago.value.ctabanco_id          = selectcuentabanco.value.id;
            pago.value.saldo                = pago.value.importe - registro.value.saldo;
            pago.value.fecha_registro       = new Date();
            try {
                Swal.fire({
                    title:  'Creando pago...',
                    html:   'Aplicando saldo al documento y cliente...',
                    showConfirmButton: false,
                })
                Swal.showLoading();                
                const body = {
                    registro_pago:  pago.value,
                    detalle_pago:   registro.value,
                    modulo_id:      52
                }
                const resppago = await ApiService.post(`AdmPago/PagarFactura`,body);
                Swal.close();
                Swal.fire({
                    icon:   'success',
                    title:  'Pago generado correctamente',
                    html:   `Datos del pago Folio: ${resppago.data.folio} ${resppago.data.serie}`
                });
                const resdocto = await ApiService.get2(`AdmFactura/${id}`,null);
                registro.value = resdocto.data;
            } catch (error) {
                toast.add({
                    severity:   'error',
                    summary:    'Error',
                    detail:     'Se genero un error al generar el pago \n'+error,
                    life: 3500,
                });
            }
            dialogPago.value = false;
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
        if ( data.value ) {
            registro.value = {...data.value};
            if (id > 0) {
                isPending.value = true;
                const paramemailfrom = await ApiService.get2(`Parametro/GetByGrupoNombre/TIMBRADO/correo_envia`,null);
                mailOptions.value.from = paramemailfrom.data.valor;
                const paramemailbbc = await ApiService.get2(`Parametro/GetByGrupoNombre/TIMBRADO/correo_confirmacion`,null);
                mailOptions.value.bcc = paramemailbbc.data.valor;
                const responserel = await ApiService.get2(`AdmFactura/RelacionadoByDocumento/${registro.value.id}`,null)
                documentos_relacionados.value.splice(0);
                documentos_relacionados.value = <adm_documento_relacionado[]>responserel.data;
                const response = await ApiService.get2(`AdmFactura/DetalleByDocumento/${registro.value.id}`,null)
                documento_detalles.value.splice(0);
                documento_detalles2.value.splice(0);
                documento_detalles.value = <Documento_Detalle[]>response.data;
                documento_detalles2.value = response.data;
                const respcliente       = await ApiService.get2(`AdmClientes/GetById/${registro.value.cliente_id}`,null);
                selectcliente.value     = <Cliente>respcliente.data;
                mailOptions.value.to    = selectcliente.value.email_adicional
                const respemisor        = await ApiService.get2(`AdmPropietario/GetById/${registro.value.propietario_id}`,null);
                selectpropietario.value = <Propietario>respemisor.data;
                const respalmacen       = await ApiService.get2(`InvAlmacen/GetById/${registro.value.almacen_id}`,null);
                selectalmacen.value     = <Almacen>respalmacen.data;
                const respagente        = await ApiService.get2(`AdmAgente/GetById/${registro.value.agente_id}`,null);
                selectagente.value      = <Agente>respagente.data;
                const resoformapago     = await ApiService.get2(`SatFormaPago/GetById/${registro.value.formapago_id}`,null);
                selectformapago.value   = <FormaPago>resoformapago.data;
                const respmetodopago    = await ApiService.get2(`SatMetodoPago/GetById/${registro.value.metodopago_id}`,null);
                selectmetodopago.value  = <MetodoPago>respmetodopago.data;
                const respusocfd        = await ApiService.get2(`SatUsoCfdi/GetById/${registro.value.usocfdi_id}`,null);
                selectusocfdi.value     = <UsoCFDI>respusocfd.data;
                if (registro.value.estatus != 'Cancelada' && registro.value.estatus != 'Timbrado') await CalcularTototales();
                if (registro.value.estatus == 'Aplicado' || registro.value.estatus == 'Timbrado' || registro.value.estatus == 'Cancelado' ){
                    const responsecfdi  = await ApiService.get2(`AdmFactura/GetCFDI/${registro.value.id}/I`,null);
                    documento_cfdi.value = <Documento_CFDI>responsecfdi.data;
                    if (documento_cfdi.value) {
                        mailOptions.value.subject = `Comprobante Fiscal: ${registro.value.folio} ${registro.value.serie} UUID: ${documento_cfdi.value.uuid}`
                        mailOptions.value.htmlBody = `
                                                    <b>Estimado cliente</b>,
                                                    <br/>
                                                    <br/>
                                                    Te enviamos por este medio la factura electrónica, comprobante fiscal digital y al mismo tiempo nos reiteramos a tus órdenes para cualquier aclaración al respecto.
                                                    <br/>
                                                    Si no puede descargar los archivos anexados en este correo, por favor, escríbenos un email a <a href="mailto:lulu@vytechservices.com.mx">lulu@vytechservices.com.mx</a>
                                                    <br/>
                                                    <br/>
                                                    <br/>
                                                    AVISO DE CONFIDENCIALIDAD: Este correo electrónico, incluyendo en su caso, los archivos adjuntos al mismo, pueden contener información de carácter confidencial y/o privilegiada, y se envían a la atención única y exclusivamente de la persona y/o entidad a quien va dirigido. La copia, revisión, uso, revelación y/o distribución de dicha información confidencial sin la autorización por escrito del remitente está prohibida. Si usted no es el destinatario a quien se dirige el presente correo, favor de contactar al remitente respondiendo al presente correo y eliminar el correo original incluyendo sus archivos, así como cualesquiera copia del mismo. Mediante la recepción del presente correo usted reconoce y acepta que en caso de incumplimiento de su parte y/o de sus representantes a los términos antes mencionados, VYTechServices tendrá derecho a los daños y perjuicios que esto le cause.

                                                `
                    }
                }
                if (registro.value.orden_id > 0){
                    const resporden = await ApiService.get2(`Orden/GetById/${registro.value.orden_id}`,null);
                    orden.value = resporden.data;
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
        agentes,
        selectagente,
        almacenes,
        selectalmacen,
        clientesfiltrados,
        selecttrabajo,
        trabajosfiltrados,
        monedas,
        selectmoneda,
        documento_detalles,
        documento_detalles2,
        documento_detalle,
        selectproducto,
        productosfiltrados,
        dialogDetalle,
        tipo_detalle,
        tipo_detalle_operacion,
        formaspago,
        metodospago,
        usoscfdi,
        selectformapago,
        selectmetodopago,
        selectusocfdi,
        imp_descuento,
        selectalmacen_det,
        isUpdatingDetalle,
        dialogRelacionados,
        dialogRelacionados_det,
        documento_relacionado,
        documentos_relacionados,
        tipo_docto_relacionado,
        tiporelaciones,
        bTimbrando,
        dialogCancelacion,
        documento_cfdi,
        dialogPDFVisor,
        dialogXMLVisor,
        dialogEnviarMail,
        dialogConsultaSAT,
        pdfDocumento,
        pdfViewer,
        dialogMovimientos,
        movtos_cliente,
        orden,
        mailOptions,
        consultaSAT,
        satmotivoscancela,
        selectmovitocancela,
        foliosustitucion,
        dialogPago,
        pago,
        formaspago_pago,
        selectformapago_pago,
        selectmoneda_pago,
        cuentasbanco,
        selectcuentabanco,
        sPermisos,

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
        cambiaDocumento,
        cambiaMoneda,
        buscarClientes,
        buscarProductos,
        buscarTrabajos,
        seleccionCliente,
        seleccionDetalle,
        openDialogDetalle,
        closeDialogDetalle,
        CalculaImportes,
        eliminaDetalle,
        openDialogRelacionados,
        openDialogRelacionadosDet,
        closeDialogRelacionadoDet,
        eliminaRelacionado,
        botonRegresar,
        timbrarFactura,
        cancelarFactura,
        VisualizarPDF,
        VisualizarXML,
        cerrarVisualizarPDF,
        cerrarVisualizarXML,
        downloadXML,
        RegenerarPDF,
        enviarCFDI,
        openDialogMovimientos,
        openDialogEmail,
        consultarEstatusSAT,
        cancelacionSAT,
        VistaPreviaPDF,
        openDialogPago,
        closeDialogPago,
        cambiaMoneda_pago,
    }
}

export default useDocumento;