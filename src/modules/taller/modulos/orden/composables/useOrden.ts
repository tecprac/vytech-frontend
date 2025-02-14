import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { Orden } from '../interfaces/interfaces';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import type { Tecnico } from '@/modules/taller/catalogos/tecnico/interfaces/interfaces';
import type { Unidad } from '@/modules/taller/catalogos/unidad/interfaces/interfaces';
import type { Bahia } from '@/modules/taller/catalogos/bahias/interfaces/interfaces';
import type { FolioDocumento } from '@/modules/configuracion/folioDocumento/interfaces/interfaces';
import type { TipoServicio } from '@/modules/taller/catalogos/tiposervicios/interfaces/interfaces';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import { getAssetPath } from "@/core/helpers/assets";

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
    const registro          = ref<Orden>({
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
    const selectecnico      = ref();
    const selectcliente     = ref();
    const clientesfiltrados = ref<Cliente[]>([]);
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
    const pdfDocumento      = ref();
    const pdfViewer         = ref();
    const MensajeError      = ref<string>('');
    const toast             = useToast();

    const { isPending, data, isError } = useQuery({
        queryKey:    ['orden', id],
        queryFn:    () => getregistro(id),
        retry: false,
    });

    onMounted(async () => {
        foliosdoctos.value.splice(0);
        tiposservicios.value.splice(0);
        tecnicos.value.splice(0);
        bahias.value.splice(0);
        const response  = await ApiService.get2('Modulos/SearchByField/codigo/023',null);
        const modulo = response.data[0];
        const respfoliosdocto = await ApiService.get2(`FolioDocumento/SearchByModuloId/${modulo.id}`,null);
        foliosdoctos.value = <FolioDocumento[]>respfoliosdocto.data;
        const respTecnicos = await ApiService.get2('Tecnicos/listado',null);
        tecnicos.value = <Tecnico[]>respTecnicos.data;
        const respBahias = await ApiService.get2('Bahias/listado',null);
        bahias.value = <Bahia[]>respBahias.data;
        if (foliosdoctos.value.length > 0) {
            selecfoliodocto.value = foliosdoctos.value[0];
            registro.value.folio = selecfoliodocto.value.folio_siguiente;
            registro.value.serie = selecfoliodocto.value.serie;
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
        selectiposervicio.value = tiposservicios.value[0];
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

    const cerrarVisualizarPDF = () => {
        if (pdfDocumento.value) {
            dialogPDFVisor.value = false;
            URL.revokeObjectURL(pdfDocumento.value);
            pdfDocumento.value = null;
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
        }
    },{immediate: true});

    const generaPDF = () => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4"
        });
        pdf.setLanguage("es-MX");
        pdf.addImage(getAssetPath('media/logos/logo_prodiesel_small.png'),'PNG',20,10,150,0,'Logo');
        pdf.text("Orden de Servicio",20,20);
        pdfDocumento.value = pdf.output("dataurlstring");
        dialogPDFVisor.value = true;
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
        buscarClientes,
        buscarUnidad,
        generaPDF,
        cerrarVisualizarPDF,
    }

}

export default useOrden;
