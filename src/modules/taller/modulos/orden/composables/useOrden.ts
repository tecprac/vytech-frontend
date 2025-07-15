import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { Orden, Orden_Trabajo, Orden_Miscelaneo,  TrabajoBitacora,
    Producto, Requisicion, RequisicionDetalle, Permisos, Motivo, OrdenProducto,
    OrdenBitacora } from '../interfaces/interfaces';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import type { Tecnico } from '@/modules/taller/catalogos/tecnico/interfaces/interfaces';
import type { Unidad } from '@/modules/taller/catalogos/unidad/interfaces/interfaces';
import type { Bahia } from '@/modules/taller/catalogos/bahias/interfaces/interfaces';
import type { FolioDocumento } from '@/modules/configuracion/folioDocumento/interfaces/interfaces';
import type { TipoServicio } from '@/modules/taller/catalogos/tiposervicios/interfaces/interfaces';
import type { Trabajo } from '@/modules/taller/catalogos/trabajos/interfaces/interfaces';
import Swal from 'sweetalert2';
import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';
import useUtilerias from '@/core/helpers/utilerias';
import useOrdenFormatos from './useOrdenFormatos';


const getregistro = async( id:number ):Promise<Orden> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Orden/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Orden = {
            id:                     0,
            fecha_alta:             new Date(),
            folio:                  0,
            fecha_cierre:           null,
            fecha_cancela:          null,
            serie:                  '',
            folio_documento_id:     0,
            cliente_id:             0,
            tecnico_id:             0,
            usuario_inicia_id:      0,
            usuario_cierra_id:      null,
            usuario_cancela_id:     null,
            tipo_servicio_id:       0,
            mantenimiento_id:       null,
            unidad_id:              0,
            bahia_id:               0,
            kms:                    0,
            nivel_combustible:      0,
            otros_componentes:      '',
            fallas_reportadas:      '',
            falla_audio1:           '',
            falla_audio2:           '',
            costo_refacciones:      0,
            costo_miscelaneos:      0,
            costo_manoobra:         0,
            costo_otrostalleres:    0,
            estatus:                'Abierta',
            filepdf:                '',
            nota_proceso:           '',
            nota_cerrada:           '',
            nota_cancelada:         '',
            motivo_id:              null,
            activo:                 true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Orden):Promise<Orden> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Orden`,registro);
    return data;
};

const updateRegistro =async (registro:Orden ):Promise<Orden> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`Orden/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Orden ):Promise<Orden> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Orden/${registro.id}`);
    return data;
};

const useOrden = ( id: number ) => {
    const store             = useAuthStore();
    const confirm           = useConfirm();
    const registro          = ref<Orden>({
                                id:                     0,
                                fecha_alta:             new Date(),
                                folio:                  0,
                                fecha_cierre:           null,
                                fecha_cancela:          null,
                                serie:                  '',
                                folio_documento_id:     0,
                                cliente_id:             0,
                                tecnico_id:             0,
                                usuario_inicia_id:      0,
                                usuario_cierra_id:      null,
                                usuario_cancela_id:     null,
                                tipo_servicio_id:       0,
                                mantenimiento_id:       null,
                                unidad_id:              0,
                                bahia_id:               0,
                                kms:                    0,
                                nivel_combustible:      0,
                                otros_componentes:      '',
                                fallas_reportadas:      '',
                                falla_audio1:           '',
                                falla_audio2:           '',
                                costo_refacciones:      0,
                                costo_miscelaneos:      0,
                                costo_manoobra:         0,
                                costo_otrostalleres:    0,
                                estatus:                'Abierta',
                                filepdf:                '',
                                nota_proceso:           '',
                                nota_cerrada:           '',
                                nota_cancelada:         '',
                                motivo_id:              null,
                                activo:                 true,
                            });
    const foliosdoctos      = ref<FolioDocumento[]>([]);
    const selecfoliodocto   = ref<FolioDocumento>({
                                id:             0,
                                modulo_id:      0,
                                folio_siguiente: 0,
                                documento:      '',
                                serie:          '',
                                activo:         true
                            });
    const tiposservicios    = ref<TipoServicio[]>([]);
    const selectiposervicio = ref<TipoServicio>({
                                id: 0,
                                descripcion: '',
                                costo_inicial: 0,
                                tiene_mantenimiento: false,
                                activo: true
                            });
    const tecnicos          = ref<Tecnico[]>([]);
    const selectecnico      = ref<Tecnico>({
                                id:                 0,
                                nombres:            '',
                                apaterno:           '',
                                amaterno:           '',
                                fecha_nacimiento:   new Date(),
                                rfc:                '',
                                curp:               '',
                                calle:              '',
                                colonia:            '',
                                cp:                 '',
                                municipio:          '',
                                estado_id:          0,
                                especialidad:       '',
                                categoria:          '',
                                celular:            '',
                                nombrecontacto:     '',
                                telefonocontacto:   '',
                                parentesco:         '',
                                telefonocasa:       '',
                                costo_hora:         0,
                                comentarios:        '',
                                imagen:             '',
                                activo:             true,
                                email:              '',
                                pin:                '',
                                nss:                '',
                                file_pdf:           '',
                                file_pdf2:          '',
                            });
    const selectecnicotrabajo = ref();
    const selectcliente     = ref();
    const selectclientefact = ref();
    const clientesfiltrados = ref<Cliente[]>([]);
    const selecttrabajo     = ref();
    const trabajosfiltrados = ref<Trabajo[]>([]);
    const selectunidad      = ref();
    const unidadfiltradas   = ref<Unidad[]>([]);
    const bahias            = ref<Bahia[]>([]);
    const selectbahia       = ref<Bahia>({
                                id: 0,
                                descripcion: '',
                                enpatio_cliente: false,
                                activo: true
                            });
    const dialogPDFVisor    = ref<boolean>(false);
    const dialogTrabajo     = ref<boolean>(false);
    const dialogRefaccion   = ref<boolean>(false);
    const dialogRefaccionDet= ref<boolean>(false);
    const dialogMiscelaneo  = ref<boolean>(false);
    const dialogEstatus     = ref<boolean>(false);
    const dialogFacturar    = ref<boolean>(false);
    const pdfDocumento      = ref();
    const pdfViewer         = ref();
    const MensajeError      = ref<string>('');
    const botonespdf        = ref();
    const toast             = useToast();
    const generandopdf      = ref<boolean>(false);
    const tabActiva         = ref<string>('0');
    const trabajo_orden     = ref<Orden_Trabajo>({
                                id: 0,
                                orden_id:           0,
                                usuario_id:         0,
                                fecha:              new Date(),
                                trabajo_id:         0,
                                descripcion:        '',
                                tecnico_id:         0,
                                estatus:            'SinIniciar',
                                notas:              '',
                                horas_estandar:    0,
                                horas_acumuladas:   0,
                                horas_facturadas:   0,
                                importe:            0,
                                activo:             true,
                            });
    const trabajos_orden    = ref<Orden_Trabajo[]>([]);
    const trabajos_orden_fact = ref<Orden_Trabajo[]>([]);
    const miscelaneo_orden  = ref<Orden_Miscelaneo>({
                                id:             0,
                                orden_id:       0,
                                usuario_id:     0,
                                estatus:        'SinFacturar',
                                fecha:          new Date(),
                                descripcion:    '',
                                cantidad:       1,
                                costo:          0,
                                importe:        0,
                                notas:          '',
                                activo:         true,
                            });
    const miscelaenos_orden = ref<Orden_Miscelaneo[]>([]);
    const miscelaneos_orden_fact = ref<Orden_Miscelaneo[]>([]);
    const tipo_operacion_trabajo = ref<string>('Create') // Create,Update,Show
    const tipo_operacion_misc = ref<string>('Create') // Create,Update,Show
    const tipo_operacion_refaccion = ref<string>('Solicitar') // Solicitar, Consultar
    const selectproducto    = ref();
    const productosfiltrados= ref<Producto[]>([]);
    const refaccion_orden   = ref<RequisicionDetalle>({
                                id:                 0,
                                requisicion_id:     0,
                                producto_id:        0,
                                cantidad:           0,
                                costo:              0,
                                costo_total:        0,
                                cantidad_surtida:   0,
                                cantidad_pendiente: 0,
                                cantidad_cancelada: 0,
                                observaciones:      '',
                                descripcion:        '',
                                codigo:             '',
                                trabajo_id:         0,
                            });
    const refacciones_orden = ref<RequisicionDetalle[]>([]);
    const orden_refacciones = ref<OrdenProducto[]>([]);
    const orden_refacciones_fact = ref<OrdenProducto[]>([]);
    const isLoadingRequi    = ref<boolean>(false);
    const trabajosbitacora  = ref<TrabajoBitacora[]>([]);
    const tipo_estatus      = ref<string>('');
    const permisos          = ref<Permisos[]>([]);
    const sPermisos         = ref<string>('');
    const motivos           = ref<Motivo[]>([]);
    const selectmotivo      = ref<Motivo>({
                                id:             0,
                                descripcion:    ''
                            });
    const usuario_abre      = ref<string>('');
    const usuario_cierra    = ref<string>('');
    const usuario_cancela   = ref<string>('');
    const motivo_cancela    = ref<string>('');
    const agruparDiversos   = ref<boolean>(false);
    const costo_hora_trabajo= ref<number>(0);
    const ordenBitacora     = ref<OrdenBitacora[]>([]);

    const { formatCurrency, formatNumber2Dec } = useUtilerias();
    const { PDFBlanco, PDFDatos, PDFDatosInterno } = useOrdenFormatos();

    const { isPending, data, isError } = useQuery({
        queryKey:    ['orden', id],
        queryFn:    () => getregistro(id),
        refetchOnWindowFocus:   (id > 0 ? true : false),
        retry: false,
    });

    onMounted(async () => {
        permisos.value = store.permisos.filter((element: any) => element.codigo == '023'); // Taller->Modulos->Orden de Servicio
        permisos.value.forEach(element => {
            sPermisos.value += element.permiso+',';
        });
        botonespdf.value = [
                                {
                                    icon: "pi pi-file-pdf",
                                    label: 'Formato en Blanco',
                                    command: async () => { await generaPDF('Blanco') }
                                },
                                {
                                    icon: "pi pi-file-pdf",
                                    label: 'Formato con Datos',
                                    command: async () => { await generaPDF('Datos') }
                                },
                                {
                                    icon: "pi pi-file-pdf",
                                    label: 'Formato Interno',
                                    command: async () => { await generaPDF('Interno') }
                                }
                            ];
        foliosdoctos.value.splice(0);
        tiposservicios.value.splice(0);
        tecnicos.value.splice(0);
        bahias.value.splice(0);
        motivos.value.splice(0);
        ordenBitacora.value.splice(0);
        ApiService.setHeader();
        const response  = await ApiService.get2('Modulos/SearchByField/codigo/023',null);
        const modulo = response.data[0];
        const respparametro = await ApiService.get2(`Parametro/GetByGrupoNombre/TALLER/costo_manoobra`,null);
        costo_hora_trabajo.value = <number>respparametro.data.valor;
        const respfoliosdocto = await ApiService.get2(`FolioDocumento/SearchByModuloId/${modulo.id}`,null);
        foliosdoctos.value = <FolioDocumento[]>respfoliosdocto.data;
        const respTecnicos = await ApiService.get2('Tecnicos/listado',null);
        tecnicos.value = <Tecnico[]>respTecnicos.data;
        const respBahias = await ApiService.get2('Bahias/listado',null);
        bahias.value = <Bahia[]>respBahias.data;
        const respMotivos = await ApiService.get2('Motivo/listado',null);
        motivos.value = <Motivo[]>respMotivos.data;
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
        const resptiposervicio = await ApiService.get2(`TipoServicios/listado`,null);
        tiposservicios.value = <TipoServicio[]>resptiposervicio.data;
    });

    const cambiaDocumento = () => {
        registro.value.folio = selecfoliodocto.value.folio_siguiente;
        registro.value.serie = selecfoliodocto.value.serie;
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

    const buscarTrabajos = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`Trabajos/SearchByText/${event.query}`,null);
            const trabajos:Trabajo[] = response.data;
            trabajosfiltrados.value = trabajos;
        }
    }

    const buscarProductos = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`InvProducto/SearchByText/${event.query}`,null);
            const refacciones:Producto[] = response.data;
            productosfiltrados.value = refacciones;
        }
    }

    const cerrarVisualizarPDF = () => {
        if (pdfDocumento.value) {
            dialogPDFVisor.value = false;
            URL.revokeObjectURL(pdfDocumento.value);
            pdfDocumento.value = null;
        }
    }

    const openDialogTrabajo = async (trabajo_id:number,caso:string) => {
        selectecnicotrabajo.value = tecnicos.value.filter(item => item.id == selectecnico.value.id)[0];
        tipo_operacion_trabajo.value = caso;
        if (trabajo_id > 0 ) {
            const response = await ApiService.get2(`Orden/TrabajoById/${trabajo_id}`,null);
            trabajo_orden.value = <Orden_Trabajo>response.data;
            selectecnicotrabajo.value = tecnicos.value.filter(item => item.id == trabajo_orden.value.tecnico_id)[0];
            const resptrab = await ApiService.get2(`Trabajos/GetById/${trabajo_orden.value.trabajo_id}`,null);
            selecttrabajo.value = <Trabajo>resptrab.data;
            if (trabajo_orden.value.estatus != 'SinIniciar') {
                trabajosbitacora.value.splice(0);
                const respbitacora = await ApiService.get2(`Orden/Trabajo/Bitacora/${trabajo_orden.value.id}`,null);
                trabajosbitacora.value = respbitacora.data;
            }
        }
        dialogTrabajo.value = true;
    }

    const openDialogMiscelaneo = async (miscelaneo_id:number, caso:string) => {
        tipo_operacion_misc.value = caso;
        if (miscelaneo_id > 0) {
            const response = await ApiService.get2(`Orden/MiscelaneoById/${miscelaneo_id}`,null);
            miscelaneo_orden.value = <Orden_Miscelaneo>response.data;
            console.log(miscelaneo_orden.value);
        }
        dialogMiscelaneo.value = true;
    }

    const openDialogRefaccion = async(accion: string,trabajo_id:number) => {
        tipo_operacion_refaccion.value = accion;
        if (accion == 'Solicitar'){
            refaccion_orden.value.trabajo_id = trabajo_id;
        }
        if (accion == 'Consultar') {
            refacciones_orden.value.splice(0);
            const trabajotmp = <Orden_Trabajo>trabajos_orden.value.find(Item => Item.id == trabajo_id);
            if (trabajotmp) {
                if (trabajotmp.talle_requisicion_detalles) {
                    if (trabajotmp.talle_requisicion_detalles.length == 0) {
                        toast.add({
                            severity:'warn', summary:'No hay Refacciones',
                            detail: 'No hay refacciones asigandas al trabajo', life: 3500,
                        });
                        return;
                    }
                    trabajotmp.talle_requisicion_detalles.forEach((item:RequisicionDetalle) => {
                        refacciones_orden.value.push({
                            id: item.id,
                            requisicion_id: item.requisicion_id,
                            producto_id: item.producto_id,
                            cantidad: item.cantidad,
                            costo: item.costo,
                            costo_total: item.costo_total,
                            cantidad_surtida: item.cantidad_surtida,
                            cantidad_pendiente: item.cantidad_pendiente,
                            cantidad_cancelada: item.cantidad_cancelada,
                            observaciones: item.observaciones,
                            descripcion: (item.inv_producto!.descvariable ? '*': '')+item.descripcion,
                            codigo: item.inv_producto!.codigo,
                            trabajo_id: item.trabajo_id,
                            inv_producto: item.inv_producto,
                            talle_requisicion: item.talle_requisicion,
                        })
                    });
                }
            }
        }
        dialogRefaccion.value = true;
    }

    const openDialogRefaccionDet = async () => {
        dialogRefaccionDet.value = true;
    }

    const closeDialogRefaccion = async (accion: string) => {
        if (accion == 'guardar') {
            isLoadingRequi.value = true;
            const response  = await ApiService.get2('Modulos/SearchByField/codigo/045',null); //Modulo de Requisiciones
            const modulo = response.data[0];
            const respfoliosdocto = await ApiService.get2(`FolioDocumento/SearchByModuloId/${modulo.id}`,null);
            const foliosdoctostmp = <FolioDocumento[]>respfoliosdocto.data;
            if (foliosdoctostmp.length == 0){
                toast.add({
                    severity:'error', summary:'Folio Requisición',
                    detail: 'No se ha configurado un folio para las Requisiciones.', life: 3500,
                });
                isLoadingRequi.value = false;
                return;
            }
            const requisicion:Requisicion = {
                id:                 0,
                fecha_alta:         new Date(),
                folio_documento_id: foliosdoctostmp[0].id,
                folio:              foliosdoctostmp[0].folio_siguiente,
                serie:              foliosdoctostmp[0].serie,
                orden_id:           registro.value.id,
                usuario_id:         store.user.id,
                estatus:            'SinAutorizar',
                subtotal:           0,
                talle_requisicion_detalle: refacciones_orden.value,
            }
            try {
                await ApiService.post('Requisicion',requisicion);
                const resptra = await ApiService.get2(`Orden/TrabajoByOrden/${registro.value.id}`,null);
                trabajos_orden.value.splice(0);
                trabajos_orden.value = <Orden_Trabajo[]>resptra.data;
                orden_refacciones.value.splice(0);
                const resprefacciones = await ApiService.get2(`Requisicion/GetOrdenProductosByOrden/${registro.value.id}`,null);
                orden_refacciones.value = resprefacciones.data;
                toast.add({
                    severity: 'success',
                    summary:    'Éxito',
                    detail:     'El Registro de guardo correctamente.',
                    life: 3000,
                });
            } catch (error: any) {
                toast.add({
                    severity: 'error',
                    summary:    'Error',
                    detail:     'Se genero un error al intentar generar la requisición \n'+error,
                    life: 3500,
                });
            }
            isLoadingRequi.value = false;
        }
        refacciones_orden.value.splice(0);
        dialogRefaccion.value = false;
    }

    const closeDialogRefaccionDet = async (accion: string) => {
        if (accion == 'guardar') {
            console.log(selectproducto.value);
            try {
                if (selectproducto.value.id == 0) {
                    toast.add({
                        severity:'error', summary:'Refacción',
                        detail: 'Debe seleccionar una refacción.', life: 3500,
                    });
                    return;
                }
            } catch (error){
                toast.add({
                    severity: 'error', summary: 'Refacción',
                    detail: 'Debe seleccionar un refacción.', life: 3500,
                });
                return;
            }
            if (refaccion_orden.value.cantidad <= 0) {
                toast.add({
                    severity: 'error', summary: 'Cantidad',
                    detail: 'La cantidad a solicitar debe ser mayor a 0', life: 3500,
                });
                return;
            }
            refaccion_orden.value.id            = refacciones_orden.value.length;
            refaccion_orden.value.id            = Math.round((Math.random() * (300 - 1) + 1));
            refaccion_orden.value.descripcion   = selectproducto.value.descripcion;
            refaccion_orden.value.codigo        = selectproducto.value.codigo;
            refaccion_orden.value.producto_id   = selectproducto.value.id;
            refaccion_orden.value.descripcion   = selectproducto.value.descripcion;
            refaccion_orden.value.costo         = selectproducto.value.costo_reposicion;
            refaccion_orden.value.costo_total   = (refaccion_orden.value.cantidad * refaccion_orden.value.costo);
            refacciones_orden.value.push(refaccion_orden.value);
        }
        selectproducto.value = null;
        dialogRefaccionDet.value = false;
        refaccion_orden.value = {
            id:                 0,
            requisicion_id:     0,
            producto_id:        0,
            cantidad:           0,
            costo:              0,
            costo_total:        0,
            cantidad_surtida:   0,
            cantidad_pendiente: 0,
            cantidad_cancelada: 0,
            observaciones:      '',
            descripcion:        '',
            codigo:             '',
            trabajo_id:         refaccion_orden.value.trabajo_id,
        };
    }
 
    const closeDialogTrabajo = async (accion: string) => {
        if (accion == 'guardar') {
            try {
                if (selecttrabajo.value.id == 0) {
                    toast.add({
                        severity: 'error',
                        summary:    'Trabajo',
                        detail:     'Debe seleccionar un trabajo.',
                        life: 3500,
                    });
                    return;
                }    
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary:    'Trabajo',
                    detail:     'Debe seleccionar un trabajo.',
                    life: 3500,
                });
                return;
            }
            if (trabajo_orden.value.horas_estandar <= 0) {
                toast.add({
                    severity: 'error',
                    summary:    'Horas',
                    detail:     'Las horas deben ser mayor a 0.',
                    life: 3500,
                });
                return;
            }
            trabajo_orden.value.orden_id        = registro.value.id;
            trabajo_orden.value.usuario_id      = store.user.id;
            trabajo_orden.value.fecha           = new Date(),
            trabajo_orden.value.trabajo_id      = selecttrabajo.value.id;
            trabajo_orden.value.descripcion     = selecttrabajo.value.descripción;
            trabajo_orden.value.tecnico_id      = selectecnicotrabajo.value.id;
            trabajo_orden.value.importe         = (selecttrabajo.value.precio * trabajo_orden.value.horas_estandar);
            trabajo_orden.value.horas_facturadas = trabajo_orden.value.horas_estandar
            try {
                if (tipo_operacion_trabajo.value == 'Create') {
                    await ApiService.post('Orden/Trabajo',trabajo_orden.value);
                } else if (tipo_operacion_trabajo.value == 'Update') {
                    await ApiService.patch(`Orden/Trabajo/${trabajo_orden.value.id}`,trabajo_orden.value);
                }
                const response = await ApiService.get2(`Orden/TrabajoByOrden/${registro.value.id}`,null);
                trabajos_orden.value.splice(0);
                trabajos_orden.value = <Orden_Trabajo[]>response.data;
                toast.add({
                    severity: 'success',
                    summary:    'Éxito',
                    detail:     'El Registro de guardo correctamente.',
                    life: 3000,
                });
            } catch (error: any) {
                toast.add({
                    severity: 'error',
                    summary:    'Error',
                    detail:     'Se genero un error al intentar guardar \n'+error,
                    life: 3500,
                });
            }
        }
        dialogTrabajo.value = false;
        selecttrabajo.value = null;
        trabajo_orden.value = {
            id: 0,
            orden_id:           0,
            usuario_id:         0,
            fecha:              new Date(),
            trabajo_id:         0,
            descripcion:        '',
            tecnico_id:         0,
            estatus:            'SinIniciar',
            notas:              '',
            horas_estandar:    0,
            horas_acumuladas:   0,
            horas_facturadas:   0,
            importe:            0,
            activo:             true,
        }
    }

    const closeDialogMiscelaneo = async (accion: string) => {
        if (accion == 'guardar') {
            if (miscelaneo_orden.value.descripcion.length <= 3) {
                toast.add({
                    severity:   'error',
                    summary:    'Miscelaneo: Descripción',
                    detail:     'La descripción del debe contener mas de 3 caracteres.',
                    life: 3500,
                });
                return;
            }    
            if (miscelaneo_orden.value.cantidad <= 0) {
                toast.add({
                    severity: 'error',
                    summary:    'Miscelaneo: Cantidad',
                    detail:     'La cantidad debe ser mayor a 0.',
                    life: 3500,
                });
                return;
            }
            miscelaneo_orden.value.orden_id    = registro.value.id;
            miscelaneo_orden.value.usuario_id  = store.user.id;
            miscelaneo_orden.value.fecha       = new Date(),
            miscelaneo_orden.value.importe  = miscelaneo_orden.value.cantidad * miscelaneo_orden.value.costo;
            try {
                if (tipo_operacion_misc.value == 'Create') {
                    await ApiService.post('Orden/Miscelaneo',miscelaneo_orden.value);
                } else if (tipo_operacion_misc.value == 'Update') {
                    await ApiService.patch(`Orden/Miscelaneo/${miscelaneo_orden.value.id}`,miscelaneo_orden.value);
                }
                const response = await ApiService.get2(`Orden/MiscelaneoByOrden/${registro.value.id}`,null);
                miscelaenos_orden.value.splice(0);
                miscelaenos_orden.value = <Orden_Miscelaneo[]>response.data;
                toast.add({
                    severity: 'success',
                    summary:    'Éxito',
                    detail:     'El Registro de guardo correctamente.',
                    life: 3000,
                });
            } catch (error: any) {
                toast.add({
                    severity: 'error',
                    summary:    'Error',
                    detail:     'Se genero un error al intentar guardar \n'+error,
                    life: 3500,
                });
            }
        }
        dialogMiscelaneo.value = false;
        miscelaneo_orden.value = {
            id:             0,
            orden_id:       0,
            usuario_id:     0,
            estatus:        'SinFacturar',
            fecha:          new Date(),
            descripcion:    '',
            cantidad:       1,
            costo:          0,
            importe:        0,
            notas:          '',
            activo:         true,
        }
    }

    const eliminaTrabajo = async (event, data: any) => {
        confirm.require({
            target: event.currentTarget,
            message: 'Esta seguro de eliminar el trabajo?',
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
                    await ApiService.delete(`/Orden/Trabajo/${data.id}`);
                    const response = await ApiService.get2(`Orden/TrabajoByOrden/${registro.value.id}`,null);
                    trabajos_orden.value.splice(0);
                    trabajos_orden.value = <Orden_Trabajo[]>response.data;
                    toast.add({
                        severity:   'success',
                        summary:    'El trabajo se elimino correctamente',
                        life:       3000
                    });
                } catch (error) {
                    toast.add({
                        severity:   'error',
                        summary:    'Error al Eliminar el trabajo',
                        detail:     'Se genero el error '+error,
                        life:       3500
                    });
                }
            },
        });
    }

    const eliminaMiscelaneo = async (event, data: any) => {
        confirm.require({
            target: event.currentTarget,
            message: 'Esta seguro de eliminar el miscelaneo?',
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
                    await ApiService.delete(`/Orden/Miscelaneo/${data.id}`);
                    const response = await ApiService.get2(`Orden/MiscelaneoByOrden/${registro.value.id}`,null);
                    miscelaenos_orden.value.splice(0);
                    miscelaenos_orden.value = <Orden_Miscelaneo[]>response.data;
                    toast.add({
                        severity:   'success',
                        summary:    'El miscelaneo se elimino correctamente',
                        life:       3000
                    });
                } catch (error) {
                    toast.add({
                        severity:   'error',
                        summary:    'Error al Eliminar el Miscelaneo',
                        detail:     'Se genero el error '+error,
                        life:       3500
                    });
                }
            },
        });
    }

    const eliminaRefaccion = async (event, data: any) => {
        confirm.require({
            target: event.currentTarget,
            message: 'Esta seguro de eliminar la refacción?',
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
                if (tipo_operacion_refaccion.value == 'Solicitar') {
                    refacciones_orden.value = refacciones_orden.value.filter(item => item.id !== data.id);
                } else  {
                    try {
                        console.log(data);
                        await ApiService.delete(`Requisicion/Detalle/${data.id}`);  
                        const resptra = await ApiService.get2(`Orden/TrabajoByOrden/${registro.value.id}`,null);
                        trabajos_orden.value.splice(0);
                        trabajos_orden.value = <Orden_Trabajo[]>resptra.data;
                        const trabajotmp = <Orden_Trabajo>trabajos_orden.value.find(Item => Item.id == data.trabajo_id);
                        if ( trabajotmp) {
                            refacciones_orden.value.splice(0);
                            trabajotmp.talle_requisicion_detalles!.forEach((item:RequisicionDetalle) => {
                                refacciones_orden.value.push({
                                    id: item.id,
                                    requisicion_id: item.requisicion_id,
                                    producto_id: item.producto_id,
                                    cantidad: item.cantidad,
                                    costo: item.costo,
                                    costo_total: item.costo_total,
                                    cantidad_surtida: item.cantidad_surtida,
                                    cantidad_pendiente: item.cantidad_pendiente,
                                    cantidad_cancelada: item.cantidad_cancelada,
                                    observaciones: item.observaciones,
                                    descripcion: (item.inv_producto!.descvariable ? '*': '')+item.descripcion,
                                    codigo: item.inv_producto!.codigo,
                                    trabajo_id: item.trabajo_id,
                                    inv_producto: item.inv_producto,
                                    talle_requisicion: item.talle_requisicion,
                                })
                            });  
                        }
                        toast.add({
                            severity:   'success',
                            summary:    'El miscelaneo se elimino correctamente',
                            life:       3000
                        });
                    } catch (error) {
                        toast.add({
                            severity:   'error',
                            summary:    'Error al Eliminar el Miscelaneo',
                            detail:     'Se genero el error '+error,
                            life:       3500
                        });
                    }
                }
            },
        });
    }

    const openDialogEstatus = async (estatus: string) => {
        tipo_estatus.value = estatus;
        dialogEstatus.value = true;
    }

    const closeDialogEstatus = async(caso: string) =>{
        if (caso == 'cerrar') {
            dialogEstatus.value = false;    
            return;
        }
        if (tipo_estatus.value == 'Cancelada' || tipo_estatus.value == 'Garantia'){
            if (selectmotivo.value.id == 0) {
                toast.add({
                    severity:   'error',
                    summary:    'Motivo',
                    detail:     'Debe seleccionar un Motivo',
                    life:       3500,
                });
                return;
            }
        }
        Swal.fire({
            title: 'Actualizando estatus de la orden...',
            showConfirmButton: false
        });
        Swal.showLoading();
        try {
            const body = {
                estatus:    tipo_estatus.value,
                usuario_id: store.user.id,
                motivo_id:  (tipo_estatus.value == 'Cancelada' || tipo_estatus.value == 'Garantia') ? selectmotivo.value.id : 0,
                notas:      (tipo_estatus.value == 'Cancelada' || tipo_estatus.value == 'Garantia') ? registro.value.nota_cancelada : registro.value.nota_cerrada,
            }
            await ApiService.put(`Orden/cambiaEstatus/${registro.value.id}`,body);
            const response = await ApiService.get2(`Orden/GetById/${registro.value.id}`,null);
            data.value = response.data;
            registro.value = response.data;
            Swal.close();
            toast.add({
                severity:   'success',
                summary:    'Orden actualizada correctamente',
                life:       3500,
            });
        } catch (error) {
            Swal.close();
            toast.add({
                severity:   'error',
                summary:    'Error al Actualizar',
                detail:     'Se genero un error al intentar actualizar. \n'+error,
                life:       3500,
            });
        }
        dialogEstatus.value = false;
    }

    const openDialogFacturar = async () => {
        dialogFacturar.value = true;
    }

    const abrirOrden = async () => {
        try {
            confirm.require({
                message:'Esta seguro de abrir la orden ?',
                header: 'Abrir Orden',
                icon:   'pi pi-info-circle',
                rejectLabel: 'Cancelar',
                rejectProps: {
                    label: 'Cancelar',
                    severity: 'secondary',
                    outlined: true
                },
                acceptProps: {
                    label: 'Si, Abrir',
                    severity: 'primary'
                },
                accept: async () => {
                    try {
                        Swal.fire({
                            title:  'Actualizando orden...',
                            showConfirmButton: false,
                        })
                        Swal.showLoading();
                        const body = {
                            estatus:    'EnProceso',
                            usuario_id: store.user.id,
                            motivo_id:  0,
                            notas:      ''
                        }
                        await ApiService.put(`Orden/cambiaEstatus/${registro.value.id}`,body);
                        const response = await ApiService.get2(`Orden/GetById/${registro.value.id}`,null);
                        data.value = response.data;
                        registro.value = response.data;
                        Swal.close();
                        Swal.fire({
                            icon:   'success',
                            title:  'Orden Abierta',
                            html:   `La orden se abrio correctamente.`,
                            showConfirmButton: true,
                        });
                    } catch (error) {
                        Swal.close();
                        toast.add({
                            severity: 'error',
                            summary:    'Error al facturar',
                            detail:     'Se genero un error al intentar facturar la orden\n'+error,
                            life:       4000
                        });
                    }
                }
            });
        } catch (error) {
            Swal.close();
            toast.add({
                severity: 'error',
                summary:    'Error al Abrir Orden',
                detail:     'Se genero un error al intentar abrir la orden\n'+error,
                life:       4000
            });
            dialogFacturar.value = false;
        }
    }

    const closeDialogFacturar = async (caso: string) => {
        console.log(trabajos_orden_fact.value);
        if (caso == 'cerrar'){
            dialogFacturar.value = false;
            return;
        }
        if (trabajos_orden_fact.value.length == 0 
                && orden_refacciones_fact.value.length == 0 
                && miscelaneos_orden_fact.value.length == 0){
            toast.add({
                severity: 'error',
                summary: 'No hay conceptos para facturar',
                detail: 'Debe seleccionar uno o mas conceptos para facturar',
                life: 3500
            });
            return;
        }
        if ( orden_refacciones_fact.value.length > 0 && 
            orden_refacciones_fact.value.reduce((acumulador, item) => { return +acumulador + +item.importe;},0) == 0 ) {
            toast.add({
                severity: 'error',
                summary: 'Sumatoria de refacciones en 0',
                detail: 'El importe a facturar en refacciones es 0',
                life: 3500
            });
            return;
        }
        try {
            confirm.require({
                message:'Esta seguro de continuar?',
                header: 'Faturar orden',
                icon:   'pi pi-info-circle',
                rejectLabel: 'Cancelar',
                rejectProps: {
                    label: 'Cancelar',
                    severity: 'secondary',
                    outlined: true
                },
                acceptProps: {
                    label: 'Si, Facturar',
                    severity: 'primary'
                },
                accept: async () => {
                    try {
                        Swal.fire({
                            title:  'Generando Factura...',
                            html:   'Creando documento y conceptos...',
                            showConfirmButton: false,
                        })
                        Swal.showLoading();
                        const responsefol  = await ApiService.get2('Modulos/SearchByField/codigo/047',null);
                        const modulo = responsefol.data[0];
                        const respfoliosdocto = await ApiService.get2(`FolioDocumento/SearchByModuloId/${modulo.id}`,null);
                        const folios:FolioDocumento[] = <FolioDocumento[]>respfoliosdocto.data;
                        let conceptostotales:number = 0;
                        let conceptosfacturados:number = 0;
                        conceptostotales = trabajos_orden.value.length + orden_refacciones.value.length + miscelaenos_orden.value.length;
                        conceptosfacturados = trabajos_orden_fact.value.length + orden_refacciones_fact.value.length + miscelaneos_orden_fact.value.length;
                        const body = {
                            usuario_id:         store.user.id,
                            cliente_id:         selectclientefact.value ? selectclientefact.value.id : registro.value.cliente_id,
                            folio_documento_id: folios[0].id,
                            agrupado:           agruparDiversos.value,           
                            trabajos:           trabajos_orden_fact.value,
                            productos:          orden_refacciones_fact.value,
                            diversos:           miscelaneos_orden_fact.value,
                            estatus:            conceptostotales == conceptosfacturados ? 'Facturada' : 'ParcialFacturada'
                        };
                        const respfactura = await ApiService.post(`Orden/Facturar/${registro.value.id}`,body);
                        const response = await ApiService.get2(`Orden/GetById/${registro.value.id}`,null);
                        data.value = response.data;
                        registro.value = response.data;
                        Swal.close();
                        Swal.fire({
                            icon:   'success',
                            title:  'Factura Generada correctamente',
                            html:   `Folio: ${respfactura.data.folio} Serie: ${respfactura.data.serie} <br> Puede consultarla en el modulo de facturas.`,
                            showConfirmButton: true,
                        });
                        dialogFacturar.value = false;
                    } catch (error) {
                        Swal.close();
                        toast.add({
                            severity: 'error',
                            summary:    'Error al facturar',
                            detail:     'Se genero un error al intentar facturar la orden\n'+error,
                            life:       4000
                        });
                        dialogFacturar.value = false;            
                    }
                }
            });
        } catch (error) {
            Swal.close();
            toast.add({
                severity: 'error',
                summary:    'Error al facturar',
                detail:     'Se genero un error al intentar facturar la orden\n'+error,
                life:       4000
            });
            dialogFacturar.value = false;
        }
    }

    const onCellEditTrabajos = (event: any) => {
        switch(event.field) {
            case 'horas_facturadas':
                if (parseFloat(event.newValue) > 0.00) {
                    event.data[event.field] = event.newValue;
                    event.data['importe'] = +(+event.newValue * costo_hora_trabajo.value).toFixed(2);
                } else {
                    toast.add({
                        severity: 'warn',
                        summary: 'Horas Facturadas',
                        detail: 'Las horas facturadas deben ser mayor a 0',
                        life: 3500,
                    })
                    event.preventDefault();
                }
                break;
        }
    }

    const onCellEditComplete = (event: any) => {
        switch (event.field){
            case 'costo':
                if (parseFloat(event.newValue) >= 0.00) {
                    event.data[event.field] = event.newValue;
                    event.data['precio'] =  +event.newValue * (1 + (+event.data['margen_utilidad'] /100));
                    event.data['importe'] = (+event.data['precio'] * +event.data['cantidad']);
                } else {
                    toast.add({
                        severity: 'warn',
                        detail: 'Costo no valido',
                        summary: 'El costo debe ser mayor a 0',
                        life: 3500,
                    })
                    event.preventDefault();
                }
                break;
            case 'precio':
                if (parseFloat(event.newValue) < +event.data['costo']){
                    toast.add({
                        severity: 'warn',
                        detail: 'Precio menor al Costo',
                        summary: 'Favor de verificar el precio esta por debajo del costo',
                        life: 3500,
                    });
                }
                if (parseFloat(event.newValue) > 0.00) {
                    event.data[event.field] = event.newValue;
                    event.data['importe'] = (+event.newValue * +event.data['cantidad']);
                } else {
                    toast.add({
                        severity: 'warn',
                        detail: 'Costo no valido',
                        summary: 'El costo debe ser mayor a 0',
                        life: 3500,
                    });
                    event.preventDefault();
                }
                break;
        }
    }

    const dataMutationNew    = useMutation( { mutationFn: newRegistro,
                                                    onSuccess(data: Orden) {
                                                        toast.add({
                                                            severity:   'success',
                                                            summary:    'Éxito',
                                                            detail:     'Información guardada correctamente',
                                                            life:       3500
                                                        });
                                                        id = data.id;
                                                        registro.value = data;
                                                        registro.value.nivel_combustible = parseInt(data.nivel_combustible.toString());
                                                        // registro.value = {
                                                        //     id:                     0,
                                                        //     fecha_alta:             new Date(),
                                                        //     folio:                  0,
                                                        //     fecha_cierre:           null,
                                                        //     serie:                  '',
                                                        //     folio_documento_id:     0,
                                                        //     cliente_id:             0,
                                                        //     tecnico_id:             0,
                                                        //     usuario_inicia_id:      0,
                                                        //     usuario_cierra_id:      null,
                                                        //     tipo_servicio_id:       0,
                                                        //     mantenimiento_id:       null,
                                                        //     unidad_id:              0,
                                                        //     bahia_id:               0,
                                                        //     kms:                    0,
                                                        //     nivel_combustible:      0,
                                                        //     otros_componentes:      '',
                                                        //     fallas_reportadas:      '',
                                                        //     falla_audio1:           '',
                                                        //     falla_audio2:           '',
                                                        //     costo_refacciones:      0,
                                                        //     costo_miscelaneos:      0,
                                                        //     costo_manoobra:         0,
                                                        //     costo_otrostalleres:    0,
                                                        //     estatus:                'Abierta',
                                                        //     filepdf:                '',
                                                        //     nota_proceso:           '',
                                                        //     nota_cerrada:           '',
                                                        //     nota_cancelada:         '',
                                                        //     activo:                 true,
                                                        // }
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
            if ( id > 0) {
                registro.value.nivel_combustible = parseInt(data.value.nivel_combustible.toString());
                isPending.value = true;
                const respmisc = await ApiService.get2(`Orden/MiscelaneoByOrden/${registro.value.id}`,null);
                miscelaenos_orden.value.splice(0);
                miscelaenos_orden.value = <Orden_Miscelaneo[]>respmisc.data;
                const respbitacora = await ApiService.get2(`Orden/BitacoraByOrden/${registro.value.id}`,null);
                ordenBitacora.value.splice(0);
                ordenBitacora.value = <OrdenBitacora[]>respbitacora.data;
                const resptra = await ApiService.get2(`Orden/TrabajoByOrden/${registro.value.id}`,null);
                trabajos_orden.value.splice(0);
                trabajos_orden.value = <Orden_Trabajo[]>resptra.data;
                const respbahia = await ApiService.get2(`Bahias/GetById/${registro.value.bahia_id}`,null);
                selectbahia.value = <Bahia>respbahia.data;
                const resptecnico = await ApiService.get2(`Tecnicos/GetById/${registro.value.tecnico_id}`,null);
                selectecnico.value = <Tecnico>resptecnico.data;
                const resptiposervicio = await ApiService.get2(`TipoServicios/GetById/${registro.value.tipo_servicio_id}`,null);
                selectiposervicio.value = <TipoServicio>resptiposervicio.data;
                const respcliente = await ApiService.get2(`AdmClientes/GetById/${registro.value.cliente_id}`,null);
                selectcliente.value     = <Cliente>respcliente.data;
                selectclientefact.value = <Cliente>respcliente.data;
                const respunidad = await ApiService.get2(`Unidades/GetById/${registro.value.unidad_id}`,null);
                selectunidad.value = <Unidad>respunidad.data;
                orden_refacciones.value.splice(0);
                const resprefacciones = await ApiService.get2(`Requisicion/GetOrdenProductosByOrden/${registro.value.id}`,null);
                orden_refacciones.value = resprefacciones.data;
                if (registro.value.usuario_inicia_id > 0){
                    const respuser_abre = await ApiService.get2(`Usuarios/GetById/${registro.value.usuario_inicia_id}`,null);
                    usuario_abre.value = respuser_abre.data.usuario+' | '+respuser_abre.data.nombre;
                }
                if (registro.value.usuario_cierra_id){
                    const respuser_cierra = await ApiService.get2(`Usuarios/GetById/${registro.value.usuario_cierra_id}`,null);
                    usuario_cierra.value = respuser_cierra.data.usuario+' | '+respuser_cierra.data.nombre;
                }
                if (registro.value.usuario_cancela_id){
                    const respuser_cancela = await ApiService.get2(`Usuarios/GetById/${registro.value.usuario_cancela_id}`,null);
                    usuario_cancela.value = respuser_cancela.data.usuario+' | '+respuser_cancela.data.nombre;
                }
                if (registro.value.motivo_id) {
                    const respmotivo = await ApiService.get2(`Motivo/GetById/${registro.value.motivo_id}`,null);
                    motivo_cancela.value = respmotivo.data.descripcion;
                }
                isPending.value = false;
            }
        }
    },{immediate: true, deep: true});

    const generaPDF = async (tipo:string) => {
        toast.add({
            severity:   'info',
            summary:    `Generando documento ...`,
            group:      'uploadfile',
        })
        generandopdf.value = true;
        const response  = await ApiService.get2(`Orden/GetByIdFormato/${registro.value.id}`,null);
        const responseref = await ApiService.get2(`Orden/GetByIdFormatoRefacciones/${registro.value.id}`,null);
        pdfDocumento.value = tipo == 'Blanco' ? 
                                    PDFBlanco(registro.value) : 
                                    tipo == 'Datos' ? 
                                        PDFDatos(response.data) : PDFDatosInterno(response.data,responseref.data);
        toast.removeGroup('uploadfile');
        dialogPDFVisor.value = true;
        generandopdf.value = false;
    }

    return {
        isPending,
        registro,
        dataMutationUpdate,
        dataMutationNew,
        dataMutationDelete,
        isError,
        MensajeError,
        foliosdoctos,
        selecfoliodocto,
        tiposservicios,
        selectiposervicio,
        selectcliente,
        clientesfiltrados,
        tecnicos,
        selectecnico,
        selectunidad,
        unidadfiltradas,
        bahias,
        selectbahia,
        dialogPDFVisor,
        pdfDocumento,
        pdfViewer,
        botonespdf,
        generandopdf,
        tabActiva,
        trabajo_orden,
        trabajos_orden,
        dialogTrabajo,
        dialogRefaccion,
        dialogRefaccionDet,
        dialogMiscelaneo,
        dialogFacturar,
        selectecnicotrabajo,
        selecttrabajo,
        trabajosfiltrados,
        miscelaenos_orden,
        miscelaneo_orden,
        tipo_operacion_trabajo,
        tipo_operacion_misc,
        tipo_operacion_refaccion,
        selectproducto,
        productosfiltrados,
        refaccion_orden,
        refacciones_orden,
        isLoadingRequi,
        trabajosbitacora,
        dialogEstatus,
        tipo_estatus,
        sPermisos,
        motivos,
        selectmotivo,
        trabajos_orden_fact,
        miscelaneos_orden_fact,
        orden_refacciones,
        orden_refacciones_fact,
        usuario_abre,
        usuario_cierra,
        usuario_cancela,
        motivo_cancela,
        agruparDiversos,
        selectclientefact,
        costo_hora_trabajo,
        ordenBitacora,

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
        totalRef_facturar:  computed( () => orden_refacciones_fact.value.reduce((acumulador, item) => { return +acumulador + +item.importe;},0)),
        totaltra_facturar:  computed( () => trabajos_orden_fact.value.reduce((acumulador, item) => { return +acumulador + +item.importe;},0)),
        totalmis_facturar:  computed( () => miscelaneos_orden_fact.value.reduce((acumulador, item) => { return +acumulador + +item.importe;},0)),
        cambiaDocumento,
        buscarClientes,
        buscarUnidad,
        buscarTrabajos,
        buscarProductos,
        generaPDF,
        cerrarVisualizarPDF,
        closeDialogTrabajo,
        openDialogTrabajo,
        eliminaTrabajo,
        closeDialogMiscelaneo,
        openDialogMiscelaneo,
        eliminaMiscelaneo,
        openDialogRefaccion,
        closeDialogRefaccion,
        openDialogRefaccionDet,
        closeDialogRefaccionDet,
        eliminaRefaccion,
        formatCurrency,
        formatNumber2Dec,
        openDialogEstatus,
        openDialogFacturar,
        closeDialogEstatus,
        closeDialogFacturar,
        onCellEditComplete,
        abrirOrden,
        onCellEditTrabajos
    }

}

export default useOrden;