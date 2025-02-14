import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Motor } from '../interfaces/interfaces';
import type { Marca } from '@/modules/taller/catalogos/marcas/interfaces/marca';
import { useToast } from 'primevue/usetoast';

const getregistro = async( id:number ):Promise<Motor> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Motores/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Motor = {
            id:             0,
            descripcion:    '',
            marca_id:       0,
            ficha_tecnica:  '',
            file_name:      '',
            activo:         true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Motor):Promise<Motor> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Motores`,registro);
    return data;
};

const updateRegistro =async (registro:Motor ):Promise<Motor> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`Motores/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Motor ):Promise<Motor> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Motores/${registro.id}`);
    return data;
};


const useMotor = ( id: number) => {

    const registro          = ref<Motor>({
                                id:             0,
                                descripcion:    '',
                                marca_id:       0,
                                file_name:      '',
                                ficha_tecnica:  '',
                                activo:         true,
                            });
    const MensajeError      = ref<string>('');
    const toast             = useToast();
    const selectedmarca     = ref<Marca>({
                                id: 0,
                                descripcion: '',
                                activo: true
                            })
    const file_pdf          = ref();
    const marcasfiltradas   = ref<Marca[]>([]);
    const file              = ref();
    const dialogMarca       = ref<boolean>(false);
    const dialogPDFVisor    = ref<boolean>(false);
    const filePDF           = ref(null);
    const pdfDocumento      = ref();
    const pdfViewer         = ref();

    const { isPending, data, isError } = useQuery({
        queryKey:    ['motor', id],
        queryFn:    () => getregistro(id),
        retry: false,
    });

    onMounted(async () => {
        // isPending.value = true;
        // if (registro.value.id > 0) {
        //     const response = await ApiService.get2(`Marcas/GetById/${id}`,null);
        //     selectedmarca.value = <Marca>response.data;
        // }
        // isPending.value = false;
    })

    const selectFile = ($event:any) => {
        file.value = $event.files[0];
    }

    const subirArchivo = async () => {
        if(file.value) {
            try {
                toast.add({
                    severity: 'info',
                    summary: "Subiendo archivo...",
                    group:      'uploadfile',
                })
                const formData = new FormData();
                formData.append('file',file.value);
                const { data } = await ApiService.post('upload/single/motores',formData);
                registro.value.file_name = data.filename;
                toast.removeGroup('uploadfile');
            } catch (error) {
                toast.add({
                    severity:   'warn',
                    summary:    'Error archivo',
                    detail:     'Se genero un error al subir el archivo',
                    life:       3500
                })
            }
            file_pdf.value.clear();
        }
    }

    const buscarMarcas = async(event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Marcas/SearchByField/descripcion/'+event.query,null)
            const marcas:Marca[] = response.data;
            marcasfiltradas.value = marcas;
        } 
    }

    const cerrarVisualizarPDF = () => {
        if (pdfDocumento.value) {
            dialogPDFVisor.value = false;
            URL.revokeObjectURL(pdfDocumento.value);
            pdfDocumento.value = null;
        }
    }

    const VisualizarPDF = async () => {
        if (registro.value.file_name) {
            toast.add({
                severity:   'info',
                summary:    "Descargando archivo pdf...",
                group:      'uploadfile',
            })
            filePDF.value = null;
            try {
                const response = await ApiService.get2('download/motores/'+registro.value.file_name,{responseType: 'arraybuffer'});
                if (response.status == 200) {
                    filePDF.value = response.data;
                    // const blob = new Blob([response.data], { type: 'application/pdf' });
                    pdfDocumento.value = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                    toast.removeGroup('uploadfile');
                    dialogPDFVisor.value = true;
                } else {
                    toast.removeGroup('uploadfile');
                    toast.add({
                        severity:   "error",
                        summary:    "Visualizar PDF",
                        detail:     "No se logro descargar el archivo solicitado\n. Intentelo mas tarde.",
                        life:       3500,
                    })
                }    
            } catch (error) {
                toast.removeGroup('uploadfile');
                toast.add({
                    severity:   "error",
                    summary:    "Visualizar PDF",
                    detail:     "No se logro descargar el archivo solicitado.\n Intentelo mas tarde.",
                    life:       3500,
                })
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
                                                        id:             0,
                                                        descripcion:    '',
                                                        marca_id:       0,
                                                        ficha_tecnica:  '',
                                                        file_name:      '',
                                                        activo:         true
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
                const response = await ApiService.get2(`Marcas/GetById/${registro.value.marca_id}`,null);
                selectedmarca.value = <Marca>response.data;
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
        selectedmarca,
        marcasfiltradas,
        file_pdf,
        file,
        dialogMarca,
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
        buscarMarcas,
        subirArchivo,
        selectFile,
        VisualizarPDF,
        cerrarVisualizarPDF,
    }
}

export default useMotor;