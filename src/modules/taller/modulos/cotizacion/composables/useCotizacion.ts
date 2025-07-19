import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { Cotizacion, Cotizacion_Detalle, MailOptions, Permisos } from '../interfaces/interfaces';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import type { FolioDocumento } from '@/modules/configuracion/folioDocumento/interfaces/interfaces';
import type { Propietario } from '@/modules/administracion/catalogos/propietario/interfaces/interfaces';
import type { Agente } from '@/modules/administracion/catalogos/agente/interfaces/interfaces';
import type { Producto } from '@/modules/almacen/catalogos/producto/interfaces/interfaces';
import type { Trabajo } from '@/modules/taller/catalogos/trabajos/interfaces/interfaces';
import type { SatMoneda } from '@/modules/sat/catalogos/moneda/interfaces/interfaces';
import type { Unidad } from '@/modules/taller/catalogos/unidad/interfaces/interfaces';
import Swal from 'sweetalert2';
import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';
import useUtilerias from '@/core/helpers/utilerias';
import { useRouter } from 'vue-router';
import { parse } from 'date-fns';
import useCotizacionFormatos from './useCotizacionFormatos';

const getregistro = async( id:number ):Promise<Cotizacion> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Cotizacion/${id}`,null);
        return data;
    } else {
        const newRegistro:Cotizacion = {
            id:                 0,
            fecha:              new Date(),
            estatus:            'SinAutorizar',
            folio_documento_id: 0,
            folio:              0,
            serie:              '',
            cliente_id:         0,
            propietario_id:     0,
            agente_id:          0,
            nombre_cliente:     '',
            atencion:           '',
            fecha_vence:        new Date(),
            unidad_registrada:  false,
            unidad_id:          0,
            datos_unidad:       '',
            email_envio:        '',
            observaciones:      '',
            descuentos:         0,
            tasa_impuesto:      0,
            tasa_retencion:     0,
            subtotal:           0,
            impuestos:          0,
            retenciones:        0,
            total:              0,
            usuario_id:         0,
            moneda_id:          0,
            tipocambio:         1,
            filepdf:            '',
            activo:             true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Cotizacion):Promise<Cotizacion> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Cotizacion`,registro);
    return data;
};

const updateRegistro =async (registro:Cotizacion ):Promise<Cotizacion> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`Cotizacion/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Cotizacion ):Promise<Cotizacion> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Cotizacion/${registro.id}`);
    return data;
};

const useCotizacion = (id: number) => {
    const router                = useRouter();
    const store                 = useAuthStore();
    const confirm               = useConfirm();
    const toast                 = useToast();
    const botonespdf            = ref();
    const MensajeError          = ref<string>('');
    const tabActiva             = ref<string>('0');    
    const generandopdf          = ref<boolean>(false);
    const registro              = ref<Cotizacion>({
                                    id:                 0,
                                    fecha:              new Date(),
                                    estatus:            'SinAutorizar',
                                    folio_documento_id: 0,
                                    folio:              0,
                                    serie:              '',
                                    cliente_id:         0,
                                    propietario_id:     0,
                                    agente_id:          0,
                                    nombre_cliente:     '',
                                    atencion:           '',
                                    fecha_vence:        new Date(),
                                    unidad_registrada:  false,
                                    unidad_id:          0,
                                    datos_unidad:       '',
                                    email_envio:        '',
                                    observaciones:      '',
                                    descuentos:         0,
                                    tasa_impuesto:      0,
                                    tasa_retencion:     0,
                                    subtotal:           0,
                                    impuestos:          0,
                                    retenciones:        0,
                                    total:              0,
                                    usuario_id:         0,
                                    moneda_id:          0,
                                    tipocambio:         1,
                                    filepdf:            '',
                                    activo:             true,
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
    const selectmoneda          = ref<SatMoneda>({
                                    id:         0,
                                    c_moneda:   '',
                                    descripcion: '',
                                    decimales:  0,
                                    activo:     true,
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
    const documento_detalles    = ref<Cotizacion_Detalle[]>([]);
    const documento_detalle     = ref<Cotizacion_Detalle>({
                                    id:                     0,
                                    cotizacion_id:          0,
                                    tipo_partida:           '',
                                    trabajo_id:             0,
                                    producto_id:            0,
                                    descripcion:            '',
                                    cantidad:               0,
                                    precio_unitario:        0,
                                    precio:                 0,
                                    precio_final:           0,
                                    importe:                0,
                                    porcdescuento:          0,
                                    descuento:              0,
                                    importe_final:          0,
                                    impuesto:               0,
                                    porcentaje_impuesto:    0,
                                    retencion:              0,
                                    porcentaje_retencion:   0,
                                    estatus:                'SinAutorizar',
                                    observaciones:          '',
                                    usuario_autoriza_id:    0,
                                    fecha_autoriza:         new Date(),
                                    notas_autoriza:         '',
                                    orden_id:               0,
                                    activo:                 true,
                                });
    const tipo_detalle          = ref<string>('Servicio') // Servicio,Producto
    const tipo_detalle_operacion= ref<string>('Create') // Create,Update,Show
    const imp_descuento         = ref<number>(0);
    const isUpdatingDetalle     = ref<boolean>(false);
    const dialogDetalle         = ref<boolean>(false);
    const dialogCancelacion     = ref<boolean>(false);
    const dialogMovimientos     = ref<boolean>(false);
    const dialogPDFVisor        = ref<boolean>(false);
    const dialogEnviarMail      = ref<boolean>(false);
    const selectunidad          = ref();
    const unidadfiltradas       = ref<Unidad[]>([]);
    const pdfDocumento          = ref();
    const filePDF               = ref(null);
    const pdfViewer             = ref();
    const fecha                 = ref<Date>(new Date());
    const fecha_vence           = ref<Date>(new Date());
    const mailOptions           = ref<MailOptions>({
                                    to:         '',
                                    from:       '',
                                    bcc:        '',
                                    subject:    '',
                                    htmlBody:   '',
                                });
    const permisos              = ref<Permisos[]>([]);
    const sPermisos             = ref<string>('');

    const { formatCurrency, formatNumber2Dec, 
        convertTMZdate, convertTMZdatetime, 
        formatDate, formatDateTime } = useUtilerias();
    const { PDFNormal } = useCotizacionFormatos();
    
    const { isPending, data, isError } = useQuery({
            queryKey:               ['cotizacion', id],
            queryFn:                () => getregistro(id),
            refetchOnWindowFocus:   (id > 0 ? true : false),
            retry:                  false,
    });

    onMounted( async () => {
        isPending.value = true;
        permisos.value = store.permisos.filter((element: any) => element.codigo == '022'); // Taller->Modulos->Cotizaciones
        permisos.value.forEach(element => {
            sPermisos.value += element.permiso+',';
        });
        botonespdf.value = [
                                {
                                    icon: "pi pi-file-pdf",
                                    label: 'Formato Normal',
                                    command: async () => { await generaPDF('Normal') }
                                },
                                {
                                    icon: "pi pi-file-pdf",
                                    label: 'Formato con Observaciones',
                                    command: async () => { await generaPDF('Observaciones') }
                                },
                            ];
        foliosdoctos.value.splice(0);
        propietarios.value.splice(0);
        agentes.value.splice(0);
        monedas.value.splice(0);
        const response  = await ApiService.get2('Modulos/SearchByField/codigo/022',null);
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

    const buscarUnidad = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`Unidades/SearchByText/${event.query}`,null);
            const unidades:Unidad[] = response.data;
            unidadfiltradas.value = unidades;
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
        console.log(selectcliente.value);
        registro.value.nombre_cliente = selectcliente.value.tipo_persona == 'Moral' 
                                            ? selectcliente.value.razon_social
                                            : selectcliente.value.nombres + ' ' +selectcliente.value.apaterno + ' '+ selectcliente.value.amaterno;
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
        } else if (tipo_detalle.value == 'Producto') {
            documento_detalle.value.trabajo_id = selectproducto.value.id;
            documento_detalle.value.cantidad = 1;
            documento_detalle.value.precio = selectproducto.value.precio;
            documento_detalle.value.descripcion = selectproducto.value.descripcion;
            documento_detalle.value.porcentaje_impuesto = selectproducto.value.impiva;
            documento_detalle.value.porcentaje_retencion = selectproducto.value.retencion_iva;
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
        for (let h = 0; h < documento_detalles.value.length; h++) {
            const item = documento_detalles.value[h];
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
        await ApiService.post(`Cotizacion/updateTotales/${registro.value.id}`,data);
    }

    const openDialogDetalle = async (detalle_id:number, tipo: string, caso: string) => {
        tipo_detalle.value = tipo;
        tipo_detalle_operacion.value = caso;
        if(detalle_id > 0){
            const response = await ApiService.get2(`Cotizacion/DetalleById/${detalle_id}`,null);
            documento_detalle.value = <Cotizacion_Detalle>response.data.registro;
            if (tipo == 'Producto') {
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
            documento_detalle.value.cotizacion_id = registro.value.id;
            documento_detalle.value.producto_id = tipo_detalle.value == 'Producto' ? selectproducto.value.id : 0;
            documento_detalle.value.trabajo_id = tipo_detalle.value == 'Servicio' ? selecttrabajo.value.id : 0;
            try {
                isUpdatingDetalle.value = true;
                CalculaImportes();
                if ( tipo_detalle_operacion.value == 'Create' ){
                    await ApiService.post('Cotizacion/Detalle',documento_detalle.value);
                } else if (tipo_detalle_operacion.value == 'Update') {
                    await ApiService.patch(`Cotizacion/Detalle/${documento_detalle.value.id}`,documento_detalle.value);
                }
                const response = await ApiService.get2(`Cotizacion/DetalleByDocumento/${registro.value.id}`,null)
                documento_detalles.value.splice(0);
                documento_detalles.value = <Cotizacion_Detalle[]>response.data;
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
                                cotizacion_id: 			0,
                                tipo_partida:           '',
                                producto_id: 			0,
                                trabajo_id:             0,
                                cantidad: 				0,
                                descripcion:            '',
                                precio_unitario:        0,
                                precio:                 0,
                                precio_final:           0,
                                importe:                0,
                                porcdescuento:          0,
                                descuento:              0,
                                importe_final:          0,
                                impuesto:               0,
                                porcentaje_impuesto:    0,
                                retencion:              0,
                                porcentaje_retencion:   0,
                                observaciones: 			'',
                                estatus:                'SinAutorizar',
                                activo: 				true,
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
                    await ApiService.delete(`Cotizacion/Detalle/${data[0].id}`);
                    const response = await ApiService.get2(`Cotizacion/DetalleByDocumento/${registro.value.id}`,null)
                    documento_detalles.value.splice(0);
                    documento_detalles.value = <Cotizacion_Detalle[]>response.data;
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
            if (documento_detalles.value.length == 0){
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
                            await ApiService.delete(`Cotizacion/${registro.value.id}`)
                            toast.add({ severity: 'info', summary: 'Eliminado', detail: 'Documento eliminado', life: 3000 });
                        } catch (error) {
                            toast.add({ severity: 'error', summary: 'Error', detail: 'Intentelo nuevamente mas tarde\n'+error, life: 3000 });
                        }
                        router.push({name: 'cotizacion'});
                        return;
                    },
                    reject: () => {
                        toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                        router.push({name: 'cotizacion'});
                        return;
                    }
                })
            } else {
                router.push({name: 'cotizacion'});
                return;    
            }
        } else {
            router.push({name: 'cotizacion'});
            return;
        }
    }

    const cerrarVisualizarPDF = () => {
        if (pdfDocumento.value) {
            dialogPDFVisor.value = false;
            URL.revokeObjectURL(pdfDocumento.value);
            pdfDocumento.value = null;
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
                const response = await ApiService.get2('download/cotizacion/'+filename,{responseType: 'arraybuffer'});
                if (response.status == 200) {
                    filePDF.value = response.data;
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
            await ApiService.get2(`Cotizacion/RegenerarPDFCFDI/${registro.value.id}/I`,null);
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
                    await ApiService.post(`Cotizacion/EnviarCFDI/${registro.value.id}/I`,mailOptions.value);
                    toast.add({
                        severity:   "success",
                        summary:    "Exitoso",
                        detail:     "La cotización fue envianda por Email",
                        life:       3500,
                    });
                    toast.removeGroup('waiting');
                } catch (error) {
                    toast.removeGroup('waiting');
                    toast.add({
                        severity:   "error",
                        summary:    "Enviar Email",
                        detail:     "No se logro enviar la cotización por correo electrónico.\n"+error,
                        life:       3500,
                    });
                }
            },
        });
    }    

    const dataMutationNew = useMutation( { mutationFn: newRegistro,
                                                            onSuccess(data: Cotizacion) {
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

    watch( data, async () => {
        if ( data.value ) {
            registro.value = {...data.value};
            if (id > 0) {
                isPending.value = true;
                fecha.value = registro.value.fecha;
                fecha_vence.value = registro.value.fecha_vence;
                const aFecha:string[] = String(fecha_vence.value).split('-');
                fecha_vence.value = new Date(parseInt(aFecha[0]),parseInt(aFecha[1])-1,parseInt(aFecha[2]));
                const paramemailfrom = await ApiService.get2(`Parametro/GetByGrupoNombre/TIMBRADO/correo_envia`,null);
                mailOptions.value.from = paramemailfrom.data.valor;
                const paramemailbbc = await ApiService.get2(`Parametro/GetByGrupoNombre/TIMBRADO/correo_confirmacion`,null);
                mailOptions.value.bcc = paramemailbbc.data.valor;
                const response = await ApiService.get2(`Cotizacion/DetalleByDocumento/${registro.value.id}`,null)
                documento_detalles.value.splice(0);
                documento_detalles.value = <Cotizacion_Detalle[]>response.data;
                const respcliente       = await ApiService.get2(`AdmClientes/GetById/${registro.value.cliente_id}`,null);
                selectcliente.value     = <Cliente>respcliente.data;
                mailOptions.value.to    = selectcliente.value.email_adicional
                const respemisor        = await ApiService.get2(`AdmPropietario/GetById/${registro.value.propietario_id}`,null);
                selectpropietario.value = <Propietario>respemisor.data;
                const respagente        = await ApiService.get2(`AdmAgente/GetById/${registro.value.agente_id}`,null);
                selectagente.value      = <Agente>respagente.data;
                if (registro.value.unidad_id! > 0){
                    const respunidad = await ApiService.get2(`Unidades/GetById/${registro.value.unidad_id}`,null);
                    selectunidad.value = <Unidad>respunidad.data;
                }
                if (registro.value.estatus != 'Cancelada' ) await CalcularTototales();
                isPending.value = false;                
            }
        }
    },{ immediate: true,deep: true });

    const generaPDF = async (tipo:string) => {
        toast.add({
            severity:   'info',
            summary:    `Generando documento ...`,
            group:      'waiting',
        });
        try {
            generandopdf.value = true;
            const response = await ApiService.get2(`Cotizacion/GetByIdFormato/${registro.value.id}`,null);
            const resunidad = registro.value.unidad_id == 0 ? null : await ApiService.get2(`Unidades/GetById/${registro.value.unidad_id}`,null);
            pdfDocumento.value = tipo == 'Normal' ? PDFNormal(response.data,resunidad,false)
                                                    : PDFNormal(response.data,resunidad,true);
            toast.removeGroup('waiting');
            dialogPDFVisor.value = true;
            generandopdf.value = false;    
        } catch (error) {
            toast.removeGroup('waiting');
            toast.add({
                severity:   'error',
                summary:    `Se genero un error al consultar los datos`,
                detail:     error,
                life:       3500,
            });            
        }
        
    }

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
        clientesfiltrados,
        selecttrabajo,
        trabajosfiltrados,
        monedas,
        selectmoneda,
        documento_detalles,
        documento_detalle,
        selectproducto,
        productosfiltrados,
        dialogDetalle,
        tipo_detalle,
        tipo_detalle_operacion,
        imp_descuento,
        isUpdatingDetalle,
        dialogCancelacion,
        dialogPDFVisor,
        dialogEnviarMail,
        pdfDocumento,
        pdfViewer,
        dialogMovimientos,
        mailOptions,
        botonespdf,
        selectunidad,
        unidadfiltradas,
        fecha,
        fecha_vence,

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
        buscarUnidad,
        buscarProductos,
        buscarTrabajos,
        generaPDF,
        seleccionCliente,
        seleccionDetalle,
        openDialogDetalle,
        closeDialogDetalle,
        CalculaImportes,
        eliminaDetalle,
        botonRegresar,
        VisualizarPDF,
        cerrarVisualizarPDF,
        RegenerarPDF,
        enviarCFDI,
        openDialogEmail,
    }

}

export default useCotizacion;