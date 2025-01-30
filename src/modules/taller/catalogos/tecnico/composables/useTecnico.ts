import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Tecnico } from '../interfaces/interfaces';
import type { SatEstado } from '@/modules/sat/catalogos/estados/interfaces/interfaces';
import { useToast } from 'primevue/usetoast';
import useUtilerias from "@/core/helpers/utilerias" ;

const getregistro = async( id:number ):Promise<Tecnico> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Tecnicos/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Tecnico = {
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
            email:              '',
            pin:                '',
            nss:                "",
            file_pdf:           "",
            file_pdf2:          "",
            activo:             true,
            sat_estado:         null,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Tecnico):Promise<Tecnico> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Tecnicos`,registro);
    return data;
};

const updateRegistro =async (registro:Tecnico ):Promise<Tecnico> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`Tecnicos/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Tecnico ):Promise<Tecnico> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Tecnicos/${registro.id}`);
    return data;
};

const { 
    convertTMZdatetime
} = useUtilerias();

const useTecnico = ( id: number) => {
    const registro          = ref<Tecnico>({
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
                                email:              '',
                                pin:                '',
                                nss:                "",
                                file_pdf:           "",
                                file_pdf2:          "",
                                activo:             true,
                                sat_estado:         null,
                            });
    const MensajeError      = ref<string>('');
    const toast             = useToast();
    const selectedestado    = ref<SatEstado>({
                                id: 0,
                                c_estado:       '',
                                c_pais:         '',
                                descripcion:    '',
                                activo: true
                            })
    const file_img          = ref();
    const estadosfiltrados  = ref<SatEstado[]>([]);
    const file              = ref();
    const dialogMarca       = ref<boolean>(false);
    const dialogPDFVisor    = ref<boolean>(false);
    const fileIMG           = ref(null);
    const imgURL            = ref();
    const pdfViewer         = ref();
    const tabActiva         = ref<string>('0');
    const file_pdf_pdf      = ref();
    const file_pdf_pdf2     = ref();
    const file_pdf          = ref();
    const file_pdf2         = ref();
    const filePDF           = ref(null);
    const pdfDocumento      = ref();

    const { isPending, data, isError } = useQuery({
        queryKey:    ['tecnico', id],
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

    const selectFile_pdf = (event:any) => {
        file_pdf.value = event.files[0];
    }

    const selectFile_pdf2 = (event:any) => {
        file_pdf2.value = event.files[0];
    }

    const subirArchivoPDF = async (documento: any, tipoarchivo: string) => {
        if(documento) {
            try {
                toast.add({
                    severity:   'info',
                    summary:    `Subiendo archivo ${tipoarchivo} ...`,
                    group:      'uploadfile',
                });
                const formData = new FormData();
                if (tipoarchivo.indexOf('pdf1') >= 0) formData.append('file',file_pdf.value);
                if (tipoarchivo.indexOf('fpd2') >= 0)  formData.append('file',file_pdf2.value);
                formData.append('file',documento);
                const { data } = await ApiService.post('upload/single/tecnicos',formData);
                toast.removeGroup('uploadfile');
                if (tipoarchivo.indexOf('pdf1') >= 0) file_pdf_pdf.value.clear();
                if (tipoarchivo.indexOf('pdf2') >= 0)  file_pdf_pdf2.value.clear();
                return data.filename;
            } catch (error) {
                console.log(error);
                toast.removeGroup('uploadfile');
                toast.add({
                    severity:   'warn',
                    summary:    'Error archivo',
                    detail:     'Se genero un error al subir el archivo '+tipoarchivo,
                    life:       3500
                });
                return '';
            }
        }
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
                const { data } = await ApiService.post('upload/single/tecnicos',formData);
                registro.value.imagen = data.filename;
                toast.removeGroup('uploadfile');
            } catch (error) {
                toast.add({
                    severity:   'warn',
                    summary:    'Error archivo',
                    detail:     'Se genero un error al subir el archivo',
                    life:       3500
                })
            }
            file_img.value.clear();
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
                group:      'uploadfile',
            })
            filePDF.value = null;
            try {
                const response = await ApiService.get2('download/tecnicos/'+filename,{responseType: 'arraybuffer'});
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

    const ObtenerImagen = async () => {
        if (registro.value.imagen.length > 0) {
            const response = await ApiService.get2('download/tecnicos/'+
                registro.value.imagen,{responseType: 'arraybuffer'}
            );
            if (response.status == 200) {
                fileIMG.value = response.data;
                imgURL.value = URL.createObjectURL(new Blob([response.data], { type: 'image/*' }));
            }
        }
    }

    const buscarEstados = async(event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(
                'SatEstados/getSearchByFieldWithFilter/descripcion/'+event.query+'/c_pais/MEX',null)
            const estados:SatEstado[] = response.data;
            estadosfiltrados.value = estados;
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
                                                        email:              '',
                                                        pin:                '',
                                                        nss:                "",
                                                        file_pdf:           "",
                                                        file_pdf2:          "",
                                                        activo:             true,
                                                        sat_estado:         null,
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
            registro.value.fecha_nacimiento = new Date(data.value.fecha_nacimiento);
            if (id > 0) {
                const response = await ApiService.get2(`SatEstados/GetById/${registro.value.estado_id}`,null);
                selectedestado.value = <SatEstado>response.data;
                await ObtenerImagen();
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
        fileIMG,
        file,
        file_img,
        dialogMarca,
        dialogPDFVisor,
        imgURL,
        pdfViewer,
        tabActiva,
        file_pdf,
        file_pdf2,
        file_pdf_pdf,
        file_pdf_pdf2,
        pdfDocumento,
        
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
        subirArchivo,
        selectFile,
        subirArchivoPDF,
        selectFile_pdf,
        selectFile_pdf2,
        VisualizarPDF,
        cerrarVisualizarPDF,
    }
}

export default useTecnico;