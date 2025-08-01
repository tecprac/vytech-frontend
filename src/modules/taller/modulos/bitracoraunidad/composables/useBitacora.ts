import { ref, watch, computed, onMounted } from 'vue';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { Orden, Orden_Trabajo, Orden_Miscelaneo, OrdenProducto,
    OrdenBitacora, Documento, TrabajoBitacora, RequisicionDetalle } from '../../orden/interfaces/interfaces';
import type { BitTrabajo, BitRefaccion } from '../interfaces/interfaces';
import type { Unidad } from '@/modules/taller/catalogos/unidad/interfaces/interfaces';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import type { Tecnico } from '@/modules/taller/catalogos/tecnico/interfaces/interfaces';
import type { Trabajo } from '@/modules/taller/catalogos/trabajos/interfaces/interfaces';
import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';
import { FilterMatchMode } from '@primevue/core/api';

const useBitacora = () => {
    const toast             = useToast();
    const store             = useAuthStore();
    const confirm           = useConfirm();
    const isPending         = ref<boolean>(false);
    const isLoading         = ref<boolean>(false);
    const selectunidad      = ref();
    const unidadfiltradas   = ref<Unidad[]>([]);
    const ordenes           = ref<Orden[]>([]);
    const selectorden       = ref<Orden>();
    const tabActiva         = ref<string>('0');
    const tabActivaDet      = ref<string>('0');
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
    const trabajos_orden    = ref<Orden_Trabajo[]>([]);
    const miscelaenos_orden = ref<Orden_Miscelaneo[]>([]);
    const orden_refacciones = ref<OrdenProducto[]>([]);
    const ordenBitacora     = ref<OrdenBitacora[]>([]);
    const documentos        = ref<Documento[]>([]);
    const dialogTrabajo     = ref<boolean>(false);
    const dialogRefaccion   = ref<boolean>(false);
    const dialogMiscelaneo  = ref<boolean>(false);
    const trabajosbitacora  = ref<TrabajoBitacora[]>([]);
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
    const tipo_operacion_trabajo    = ref<string>('Show') // Create,Update,Show
    const tipo_operacion_misc       = ref<string>('Show') // Create,Update,Show
    const tipo_operacion_refaccion  = ref<string>('Consultar') // Solicitar, Consultar
    const tecnicos          = ref<Tecnico[]>([]);
    const selectecnicotrabajo = ref();
    const selecttrabajo     = ref();
    const trabajosfiltrados = ref<Trabajo[]>([]);
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
    const bittrabajos       = ref<BitTrabajo[]>([]);
    const filters           = ref({
                                orden:          { value: null, matchMode: FilterMatchMode.CONTAINS},
                                fecha_orden:    { value: null, matchMode: FilterMatchMode.DATE_IS},
                                estatus_orden:  { value: null, matchMode: FilterMatchMode.CONTAINS},
                                trabajo:        { value: null, matchMode: FilterMatchMode.CONTAINS},
                                notas:          { value: null, matchMode: FilterMatchMode.CONTAINS},
                                tecnico:        { value: null, matchMode: FilterMatchMode.CONTAINS},
                            });
    const bitrefacciones    = ref<BitRefaccion[]>([]);
    const filtersrefa       = ref({
                                id:             { value: null, matchMode: FilterMatchMode.CONTAINS},
                                requisicion_id: { value: null, matchMode: FilterMatchMode.CONTAINS},
                                producto_id:    { value: null, matchMode: FilterMatchMode.CONTAINS},
                                cantidad:       { value: null, matchMode: FilterMatchMode.CONTAINS},
                                costo:          { value: null, matchMode: FilterMatchMode.CONTAINS},
                                costo_total:    { value: null, matchMode: FilterMatchMode.CONTAINS},
                                precio:         { value: null, matchMode: FilterMatchMode.CONTAINS},
                                importe:        { value: null, matchMode: FilterMatchMode.CONTAINS},
                                descripcion:    { value: null, matchMode: FilterMatchMode.CONTAINS},
                                codigo:         { value: null, matchMode: FilterMatchMode.CONTAINS},
                                costo_alterno:  { value: null, matchMode: FilterMatchMode.CONTAINS},
                            });
    
    onMounted(async () => {

    });

    const buscarUnidad = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`Unidades/SearchByText/${event.query}`,null);
            const unidades:Unidad[] = response.data;
            unidadfiltradas.value = unidades;
        }
    }

    const consultarUnidad = async() => {
        toast.add({
            group:      'waiting',
            summary:    'Consultando información...'
        });
        try {
            ordenes.value.splice(0);
            bittrabajos.value.splice(0);
            bitrefacciones.value.splice(0);
            const response = await ApiService.get2(`Orden/OrdenesByUnidad/${selectunidad.value.id}`,null);
            ordenes.value = response.data;
            const restrabajo = await ApiService.get2(`Orden/TrabajoByUnidad/${selectunidad.value.id}`,null);
            bittrabajos.value = restrabajo.data;
            const resprefacciones = await ApiService.get2(`Requisicion/GetOrdenProductosByUnidad/${selectunidad.value.id}`,null);
            bitrefacciones.value = resprefacciones.data;
            toast.removeGroup('waiting');
            if (ordenes.value.length == 0) {
                toast.add({
                    severity:   'warn',
                    summary:    'No se encontraron registros para esta unidad',
                    detail:     selectunidad.value.numeroeco+
                                    '\nPlacas: '+selectunidad.value.numeroeco+
                                    '\nTipo: '+selectunidad.value.talle_tipo_unidad.tipo_unidad+
                                    '\nMarca: '+selectunidad.value.talle_marca.marca
                                    ,
                    life:       4500,
                });
                selectunidad.value = null;
            }
        } catch (error) {
            toast.removeAllGroups();
            toast.add({
                severity:   'error',
                summary:    'Se genero un error al consultar',
                detail:     'Intentelo mas tarde o consulte a soporte técnico \n'+error,
                life:       3500,
            });
        }
    }

    const consultarOrden = async() => {
        toast.add({
            group:      'waiting',
            summary:    `Consultando información de la orden: ${selectorden.value!.folio} ...`
        });
        try {
            const resporden = await ApiService.get2(`Orden/GetById/${selectorden.value!.id}`,null);
            registro.value = resporden.data;
            const respmisc = await ApiService.get2(`Orden/MiscelaneoByOrden/${registro.value.id}`,null);
            miscelaenos_orden.value.splice(0);
            miscelaenos_orden.value = <Orden_Miscelaneo[]>respmisc.data;
            const respbitacora = await ApiService.get2(`Orden/BitacoraByOrden/${registro.value.id}`,null);
            ordenBitacora.value.splice(0);
            ordenBitacora.value = <OrdenBitacora[]>respbitacora.data;
            const resptra = await ApiService.get2(`Orden/TrabajoByOrden/${registro.value.id}`,null);
            trabajos_orden.value.splice(0);
            trabajos_orden.value = <Orden_Trabajo[]>resptra.data;
            orden_refacciones.value.splice(0);
            const resprefacciones = await ApiService.get2(`Requisicion/GetOrdenProductosByOrden/${registro.value.id}`,null);
            orden_refacciones.value = resprefacciones.data;
            const respdocumentos = await ApiService.get2(`AdmFactura/GetRegistrosByOrden/${registro.value.id}`,null);
            documentos.value.splice(0);
            documentos.value = respdocumentos.data;
            toast.removeGroup('waiting');
        } catch (error) {
            toast.removeAllGroups();
            toast.add({
                severity:   'error',
                summary:    'Se genero un error al consultar',
                detail:     'Intentelo mas tarde o consulte a soporte técnico \n'+error,
                life:       3500,
            });
        }
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

    const closeDialogTrabajo = async (accion: string) => {
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

    return {
        isPending,
        isLoading,
        selectunidad,
        unidadfiltradas,
        ordenes,
        selectorden,
        tabActiva,
        tabActivaDet,
        trabajos_orden,
        miscelaenos_orden,
        orden_refacciones,
        registro,
        documentos,
        ordenBitacora,
        dialogTrabajo,
        dialogRefaccion,
        dialogMiscelaneo,
        tipo_operacion_trabajo,
        tipo_operacion_misc,
        tipo_operacion_refaccion,
        refaccion_orden,
        refacciones_orden,
        tecnicos,
        selectecnicotrabajo,
        selecttrabajo,
        trabajosfiltrados,
        trabajo_orden,
        trabajosbitacora,
        miscelaneo_orden,
        bittrabajos,
        filters,
        bitrefacciones,
        filtersrefa,

        buscarUnidad,
        consultarUnidad,
        consultarOrden,
        openDialogRefaccion,
        openDialogTrabajo,
        openDialogMiscelaneo,
        closeDialogTrabajo,
        closeDialogMiscelaneo,
    }
}

export default useBitacora;