import { ref, watch, computed, onMounted } from 'vue';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { Tecnico } from '@/modules/taller/catalogos/tecnico/interfaces/interfaces';
import type { Orden,Orden_Trabajo } from '../../orden/interfaces/interfaces';
import type { OrdenTrabajoBitacora } from '../interfaces/interfaces';

import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';

const useIniciaTermina = () => {
    const toast             = useToast();
    const store             = useAuthStore();
    const confirm           = useConfirm();
    const isPending         = ref<boolean>(false);
    const isLoading         = ref<boolean>(false);
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
    const pin               = ref<string>('');
    const trabajos          = ref<Orden_Trabajo[]>([]);
    const dialogOrden       = ref<boolean>(false);
    const dialogTrabajo     = ref<boolean>(false);
    const tipo_operacion    = ref<string>('');
    const trabajo_actual    = ref<Orden_Trabajo>();
    const trabajo_bitacora  = ref<OrdenTrabajoBitacora>({
                                    id:                 0,
                                    usuario_id:         store.user.id,
                                    orden_trabajo_id:   0,
                                    tecnico_id:         0,
                                    fecha_inicio:       new Date(),
                                    fecha_fin:          null,
                                    comentarios:        '',
                                    estatus:            ''
                            });
    const orden_consulta    = ref<Orden>({
                                id:                     0,
                                fecha_alta:             new Date(),
                                folio:                  0,
                                fecha_cierre:           null,
                                serie:                  '',
                                folio_documento_id:     0,
                                cliente_id:             0,
                                tecnico_id:             0,
                                usuario_inicia_id:      0,
                                usuario_cierra_id:      null,
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
                                activo:                 true,
                            });

    onMounted(async () => {
        const respTecnicos = await ApiService.get2('Tecnicos/listado',null);
        tecnicos.value = <Tecnico[]>respTecnicos.data;
    })

    const BuscarTrabajos = async () => {
        if (selectecnico.value.id == 0){
            toast.add({
                severity:'error', summary:'Técnico no Seleccionado',
                detail: 'Debe seleccionar un técnico.', life: 3500,
            });
            return;
        }
        if (pin.value == '') {
            toast.add({
                severity:'error', summary:'PIN Vacío',
                detail: 'Debe capturar un PIN valido.', life: 3500,
            });
            return;
        }
        if (pin.value != selectecnico.value.pin) {
            toast.add({
                severity:'error', summary:'PIN Incorrecto',
                detail: 'El PIN no coincide con el PIN del Técnico.', life: 3500,
            });
            return;
        }
        isLoading.value = true;
        const response = await ApiService.get2(`Orden/TrabajoByTecnico/${selectecnico.value.id}`,null);
        trabajos.value = response.data;
        isLoading.value = false;
    }

    const openDialogOrden = async (orden_id:number) => {
        isLoading.value = true;
        const response  = await ApiService.get2(`Orden/GetByIdFormato/${orden_id}`,null);
        orden_consulta.value = response.data;
        console.log(orden_consulta.value);
        isLoading.value = false;
        dialogOrden.value = true;
    }

    const ActualizaEstatus = async(trabajo_id:number, operacion:string, accion: string) => {
        if (accion == 'Mostrar'){
            trabajo_actual.value = trabajos.value.filter(item => item.id == trabajo_id)[0];
            tipo_operacion.value = operacion;
            dialogTrabajo.value = true;
        } else {
            isLoading.value = true;
            try {
                
                trabajo_bitacora.value.estatus = operacion,
                trabajo_bitacora.value.orden_trabajo_id = trabajo_actual.value!.id;
                trabajo_bitacora.value.tecnico_id = trabajo_actual.value!.tecnico_id;
                switch(operacion){
                    case 'EnProceso': {
                        await ApiService.post('Orden/TrabajoIniciar',trabajo_bitacora.value);
                        break;
                    }
                    case 'Pausa': {
                        await ApiService.post('Orden/TrabajoPausa',trabajo_bitacora.value);
                        break;
                    }
                    case 'Terminado': {
                        await ApiService.post('Orden/TrabajoTerminar',trabajo_bitacora.value);
                        break;
                    }
                    case 'Cancelado': {
                        await ApiService.post('Orden/TrabajoCancelar',trabajo_bitacora.value);
                        break;
                    }
                }
                
                const response = await ApiService.get2(`Orden/TrabajoByTecnico/${selectecnico.value.id}`,null);
                trabajos.value.splice(0);
                trabajos.value = response.data;
                toast.add({
                    severity:'success', summary:'Trabajo '+operacion,
                    detail: 'Registro guardado correctamente.', life: 3000,
                });
                trabajo_bitacora.value.comentarios = '';
            } catch (error) {
                toast.add({
                    severity:'error', summary:'Error al Actualizar',
                    detail: 'Intentelo mas tarde ó Comuniquese con su area de Soporte.', life: 3500,
                });
            }
            isLoading.value = false;
            dialogTrabajo.value = false;
        }
    }

    

    return {
        isPending,
        isLoading,
        tecnicos,
        selectecnico,
        pin,
        trabajos,
        dialogOrden,
        dialogTrabajo,
        tipo_operacion,
        trabajo_actual,
        trabajo_bitacora,
        orden_consulta,

        BuscarTrabajos,
        ActualizaEstatus,
        openDialogOrden
    }
}

export default useIniciaTermina;