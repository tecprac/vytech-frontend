import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { Unidad } from '../interfaces/interfaces';
import type { Marca } from '@/modules/taller/catalogos/marcas/interfaces/marca';
import type { Modelo } from '@/modules/taller/catalogos/modelos/interfaces/modelo';
import type { TipoUnidad } from '@/modules/taller/catalogos/tipounidad/interfaces/interfaces';
import type { Motor } from '@/modules/taller/catalogos/motores/interfaces/interfaces';
import type { Transmision } from '../../transmisiones/interfaces/interfaces';

const getregistro = async( id:number ):Promise<Unidad> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Unidades/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Unidad = {
            id:                 0,
            numeroeco:          '',
            marca_id:           0,
            modelo_id:          0,
            tipo_unidad_id:     0,
            fecha_compra:       new Date(),
            año:                0,
            placas:             '',
            kms:                0,
            niv:                '',
            num_motor:          '',
            motor_id:           0,
            transmision_id:     0,
            color:              '',
            num_serie:          '',
            clase:              '',
            ejes:               0,
            num_transmision:    '',
            combustible:        'Diesel',
            tarjetacircula:     '',
            pdftcirculacion:    '',
            pdfpermisosct:      '',
            estatus:            '',
            permiso_sct:        '',
            polizaseguro:       '',
            aseguradora:        '',
            vigenciapoliza:     new Date(),
            arrendado:          false,
            pdfpolizaseguro:    '',
            activo:             true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Unidad):Promise<Unidad> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Unidades`,registro);
    return data;
};

const updateRegistro =async (registro:Unidad ):Promise<Unidad> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`Unidades/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Unidad ):Promise<Unidad> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Unidades/${registro.id}`);
    return data;
};


const useUnidad = ( id: number) => {

    const registro          = ref<Unidad>({
                                id:                 0,
                                numeroeco:          '',
                                marca_id:           0,
                                modelo_id:          0,
                                tipo_unidad_id:     0,
                                fecha_compra:       new Date(),
                                año:                0,
                                placas:             '',
                                kms:                0,
                                niv:                '',
                                num_motor:          '',
                                motor_id:           0,
                                transmision_id:     0,
                                color:              '',
                                num_serie:          '',
                                clase:              '',
                                ejes:               0,
                                num_transmision:    '',
                                combustible:        'Diesel',
                                tarjetacircula:     '',
                                pdftcirculacion:    '',
                                pdfpermisosct:      '',
                                estatus:            '',
                                permiso_sct:        '',
                                polizaseguro:       '',
                                aseguradora:        '',
                                vigenciapoliza:     new Date(),
                                arrendado:          false,
                                pdfpolizaseguro:    '',
                                activo:             true,
                            });
    const MensajeError      = ref<string>('');
    const toast             = useToast();
    const selectedmarca     = ref<Marca>({
                                id: 0,
                                descripcion: '',
                                activo: true
                            });
    const selectedmodelo    = ref<Modelo>({
                                id: 0,
                                descripcion: '',
                                activo: true
                            });
    const selectedtipounidad = ref<TipoUnidad>({
                                id: 0,
                                descripcion: '',
                                activo: true
                            });
    const selectedmotor     = ref<Motor>({
                                id: 0,
                                descripcion:    '',
                                marca_id:       0,
                                ficha_tecnica:  '',
                                activo: true
                            });
    const selectedtransmision = ref<Transmision>({
                                id: 0,
                                descripcion: '',
                                activo: true
                            });
    const file_pdf_tarjeta      = ref();
    const file_pdf_poliza       = ref();
    const file_pdf_permiso      = ref();
    const file_tarjeta          = ref();
    const file_poliza           = ref();
    const file_permiso          = ref();
    const file_img              = ref();
    const files_imagenes        = ref();
    const marcasfiltradas       = ref<Marca[]>([]);
    const modelosfiltradas      = ref<Modelo[]>([]);
    const tipounidadfiltradas   = ref<TipoUnidad[]>([]);
    const motoresfiltradas      = ref<Motor[]>([]);
    const transmisionfiltradas  = ref<Transmision[]>([]);
    
    const dialogMarca           = ref<boolean>(false);
    const dialogPDFVisor        = ref<boolean>(false);
    const filePDF               = ref(null);
    const pdfDocumento          = ref();
    const pdfViewer             = ref();
    const combustibles          = ref<string[]>(['Diesel','Electrico','Gas','Gasolina','Otro']);
    const tipoestatus           = ref<string[]>(['Activo','Baja','Siniestrado']);
    const tabActiva             = ref<string>('0');
    const imagenes              = ref();
    const imagenesURL           = ref<string[]>([]);

    const { isPending, data, isError } = useQuery({
        queryKey:               ['unidad', id],
        queryFn:                () => getregistro(id),
        refetchOnWindowFocus:   (id > 0 ? true : false),
        retry:                  false,
    });

    onMounted(async () => {
        // isPending.value = true;
        // if (registro.value.id > 0) {
        //     const response = await ApiService.get2(`Marcas/GetById/${id}`,null);
        //     selectedmarca.value = <Marca>response.data;
        // }
        // isPending.value = false;
        imagenesURL.value.splice(0);
    })

    const selectFile_tarjeta = (event:any) => {
        file_tarjeta.value = event.files[0];
    }

    const selectFile_poliza = (event:any) => {
        file_poliza.value = event.files[0];
    }
    const selectFile_permiso = (event:any) => {
        file_permiso.value = event.files[0];
    }

    const selectImagenes = (event:any) => {
        files_imagenes.value = event.files;
    }

    const subirImagenes = async () => {
        if ( files_imagenes.value) {
            try {
                toast.add({
                    severity:   'info',
                    summary:    `Subiendo imagenes ...`,
                    group:      'uploadfile',
                })
                const formData = new FormData();
                let count:number = 0;
                files_imagenes.value.forEach( async (item:any) => {
                    if (count <= 5) {
                        formData.append('file',item);
                    }
                    count++;
                });
                const { data } = await ApiService.post('upload/multiple/unidades',formData);
                const aimagenes:string[] = [];
                data.forEach((item:any) => {
                        aimagenes.push(item.filename);
                });
                toast.removeGroup('uploadfile');
                file_img.value.clear();
                return aimagenes;
            } catch (error) {
                toast.removeGroup('uploadfile');
                toast.add({
                    severity:   'warn',
                    summary:    'Error archivo',
                    detail:     'Se genero un error al subir las imagenes ',
                    life:       3500
                });
                file_img.value.clear();
                return [];
            }
        }
    }

    const subirArchivo = async (documento: any, tipoarchivo: string) => {
        if(documento) {
            try {
                toast.add({
                    severity:   'info',
                    summary:    `Subiendo archivo ${tipoarchivo} ...`,
                    group:      'uploadfile',
                })
                const formData = new FormData();
                if (tipoarchivo.indexOf('Tarjeta') >= 0) formData.append('file',file_tarjeta.value);
                if (tipoarchivo.indexOf('Póliza') >= 0)  formData.append('file',file_poliza.value);
                if (tipoarchivo.indexOf('Permiso') >= 0) formData.append('file',file_permiso.value);
                formData.append('file',documento);
                const { data } = await ApiService.post('upload/single/unidades',formData);
                toast.removeGroup('uploadfile');
                if (tipoarchivo.indexOf('Tarjeta') >= 0) file_pdf_tarjeta.value.clear();
                if (tipoarchivo.indexOf('Póliza') >= 0)  file_pdf_poliza.value.clear();
                if (tipoarchivo.indexOf('Permiso') >= 0) file_pdf_permiso.value.clear();
                return data.filename;
            } catch (error) {
                toast.removeGroup('uploadfile');
                toast.add({
                    severity:   'warn',
                    summary:    'Error archivo',
                    detail:     'Se genero un error al subir el archivo '+tipoarchivo,
                    life:       3500
                })
                return '';
            }
        }
    }

    const buscarMarcas = async(event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Marcas/SearchByField/descripcion/'+event.query,null)
            const registros:Marca[] = response.data;
            marcasfiltradas.value = registros;
        } 
    }

    const buscarTipoUnidad = async (event: any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('TipoUnidad/SearchByField/descripcion/'+event.query,null)
            const registros:Marca[] = response.data;
            tipounidadfiltradas.value = registros;
        } 
    }

    const buscarModelo = async (event: any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Modelos/SearchByField/descripcion/'+event.query,null)
            const registros:Modelo[] = response.data;
            modelosfiltradas.value = registros;
        } 
    }

    const buscarMotor = async (event: any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Motores/SearchByField/descripcion/'+event.query,null)
            const registros:Motor[] = response.data;
            motoresfiltradas.value = registros;
        } 
    }

    const buscarTransmision = async (event: any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Transmisiones/SearchByField/descripcion/'+event.query,null)
            const registros:Transmision[] = response.data;
            transmisionfiltradas.value = registros;
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
                const response = await ApiService.get2('download/unidades/'+filename,{responseType: 'arraybuffer'});
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
                                                        id:                 0,
                                                        numeroeco:          '',
                                                        marca_id:           0,
                                                        modelo_id:          0,
                                                        tipo_unidad_id:     0,
                                                        fecha_compra:       new Date(),
                                                        año:                0,
                                                        placas:             '',
                                                        kms:                0,
                                                        niv:                '',
                                                        num_motor:          '',
                                                        motor_id:           0,
                                                        transmision_id:     0,
                                                        color:              '',
                                                        num_serie:          '',
                                                        clase:              '',
                                                        ejes:               0,
                                                        num_transmision:    '',
                                                        combustible:        'Diesel',
                                                        tarjetacircula:     '',
                                                        pdftcirculacion:    '',
                                                        pdfpermisosct:      '',
                                                        estatus:            '',
                                                        permiso_sct:        '',
                                                        polizaseguro:       '',
                                                        aseguradora:        '',
                                                        vigenciapoliza:     new Date(),
                                                        arrendado:          false,
                                                        pdfpolizaseguro:    '',
                                                        activo:             true,
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
            imagenesURL.value.splice(0);
            registro.value = {...data.value};
            if (registro.value.id > 0){
                isPending.value = true;
                const response = await ApiService.get2(`Unidades/GetImagenesById/${registro.value.id}`,null);
                imagenes.value = response.data;
                for (let i = 0; i < imagenes.value.length; i++) {
                    const item = imagenes.value[i];
                    const response2 = await ApiService.get2('download/unidades/'+
                        item.file_name,{responseType: 'arraybuffer'}
                    );
                    if (response2.status == 200) {
                        imagenesURL.value.push(URL.createObjectURL(new Blob([response2.data], { type: 'image/*' })));
                    }    
                }
                const resptipo = await ApiService.get2(`TipoUnidad/GetById/${registro.value.tipo_unidad_id}`,null);
                selectedtipounidad.value = <TipoUnidad>resptipo.data;
                const respmarca = await ApiService.get2(`Marcas/GetById/${registro.value.marca_id}`,null);
                selectedmarca.value = <Marca>respmarca.data;
                const respmodelo = await ApiService.get2(`Modelos/GetById/${registro.value.modelo_id}`,null);
                selectedmodelo.value = <Modelo>respmodelo.data;
                const respmotor = await ApiService.get2(`Motores/GetById/${registro.value.motor_id}`,null);
                selectedmotor.value = <Motor>respmotor.data;
                const resptrans = await ApiService.get2(`Transmisiones/GetById/${registro.value.transmision_id}`,null);
                selectedtransmision.value = <Transmision>resptrans.data;
                isPending.value = false;
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
        selectedmodelo,
        selectedtipounidad,
        selectedmotor,
        selectedtransmision,
        marcasfiltradas,
        modelosfiltradas,
        tipounidadfiltradas,
        motoresfiltradas,
        transmisionfiltradas,
        file_pdf_tarjeta,
        file_pdf_poliza,
        file_pdf_permiso,
        file_tarjeta,
        file_poliza,
        file_permiso,
        file_img,
        dialogMarca,
        dialogPDFVisor,
        pdfDocumento,
        pdfViewer,
        combustibles,
        tipoestatus,
        tabActiva,
        imagenesURL,
        
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
        buscarTipoUnidad,
        buscarModelo,
        buscarMotor,
        buscarTransmision,
        subirArchivo,
        subirImagenes,
        selectFile_tarjeta,
        selectFile_permiso,
        selectFile_poliza,
        selectImagenes,
        VisualizarPDF,
        cerrarVisualizarPDF,
    }
}

export default useUnidad;