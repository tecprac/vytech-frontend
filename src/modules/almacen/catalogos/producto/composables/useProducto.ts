import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Producto } from '../interfaces/interfaces';
import type { SatClaveProdServ } from '@/modules/sat/catalogos/claveprodserv/interfaces/interfaces';
import type { SatClaveUnidad } from '@/modules/sat/catalogos/claveunidad/interfaces/interfaces';
import type { SatObjetoImpuesto } from '@/modules/sat/catalogos/objetoimpuesto/interfaces/interfaces';
import type { Marca } from '@/modules/taller/catalogos/marcas/interfaces/marca';
import type { TipoInventario } from '@/modules/almacen/catalogos/tipoinventario/interfaces/interfaces';
import type { UnidadMedida } from '@/modules/administracion/catalogos/unidadmedida/interfaces/interfaces';
import { useToast } from 'primevue/usetoast';

const getregistro = async( id:number ):Promise<Producto> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`InvProducto/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Producto = {
                                id:                 0,
                                codigo:             '',
                                codigo_alterno:     '',
                                codigo_barras:      '',
                                descripcion:        '',
                                ficha_tecnica:      '',
                                metodo_costeo:      'Promedio',
                                tipo_inventario_id: 0,
                                marca_id:           0,
                                unidad_medida_id:   0,
                                costo_reposicion:   0,
                                ultimo_costo:       0,
                                margen_utilidad:    0,
                                precio:             0,
                                fecha_ultimacompra: null,
                                estatus:            'Activo',
                                inventariable:      false,
                                descvariable:       false,
                                claveprodserv_id:   0,
                                claveunidad_id:     0,
                                clase:              'Producto',
                                objetoimpuesto_id:  0,
                                impiva:             16,
                                impiesps:           0,
                                retencion_isr:      0,
                                retencion_iva:      0,
                                file_imagen:        '',
                                file_pdf:           '',
                                activo:             true,
                                talle_marca:        null,
                                inv_tipo_inventario: null,
                                adm_unidad_medida: null,
                                sat_claveprodserv: null,
                                sat_claveunidad:   null,
                        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Producto):Promise<Producto> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`InvProducto`,registro);
    return data;
};

const updateRegistro =async (registro:Producto ):Promise<Producto> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`InvProducto/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Producto ):Promise<Producto> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`InvProducto/${registro.id}`);
    return data;
};


const useProducto = ( id: number) => {
    const registro              = ref<Producto>({
                                    id:                 0,
                                    codigo:             '',
                                    codigo_alterno:     '',
                                    codigo_barras:      '',
                                    descripcion:        '',
                                    ficha_tecnica:      '',
                                    metodo_costeo:      'Promedio',
                                    tipo_inventario_id: 0,
                                    marca_id:           0,
                                    unidad_medida_id:   0,
                                    costo_reposicion:   0,
                                    ultimo_costo:       0,
                                    margen_utilidad:    0,
                                    precio:             0,
                                    fecha_ultimacompra: null,
                                    estatus:            'Activo',
                                    inventariable:      false,
                                    descvariable:       false,
                                    claveprodserv_id:   0,
                                    claveunidad_id:     0,
                                    clase:              'Producto',
                                    objetoimpuesto_id:  0,
                                    impiva:             16,
                                    impiesps:           0,
                                    retencion_isr:      0,
                                    retencion_iva:      0,
                                    file_imagen:        '',
                                    file_pdf:           '',
                                    activo:             true,
                                    talle_marca:        null,
                                    inv_tipo_inventario: null,
                                    adm_unidad_medida: null,
                                    sat_claveprodserv: null,
                                    sat_claveunidad:   null,
                                });
    const MensajeError          = ref<string>('');
    const toast                 = useToast();
    const file_img              = ref();
    const file                  = ref();
    const dialogMarca           = ref<boolean>(false);
    const dialogPDFVisor        = ref<boolean>(false);
    const fileIMG               = ref(null);
    const imgURL                = ref();
    const pdfViewer             = ref();
    const tabActiva             = ref<string>('0');
    const file_pdf_pdf          = ref();
    const file_pdf              = ref();
    const filePDF               = ref(null);
    const pdfDocumento          = ref();
    const selectedmarca         = ref<Marca>({
                                    id: 0,
                                    descripcion: '',
                                    activo: true
                                });
    const marcasfiltradas       = ref<Marca[]>([]);
    const tipos_inventario      = ref<TipoInventario[]>([]);
    const selecttipo_inventario  = ref<TipoInventario>({
                                    id:             0,
                                    descripcion:    '',
                                    activo:         true,
                                });
    const satprodservfiltrados  = ref<SatClaveProdServ[]>([]);
    const selectedprodserv      = ref<SatClaveProdServ>({
                                    id:                 0,
                                    c_claveprodserv:    '',
                                    descripcion:        '',
                                    ini_vigencia:       null,
                                    fin_vigencia:       null,
                                    activo:             true,
                                });
    const satclaveunidadfiltradas = ref<SatClaveUnidad[]>([]);
    const selectedclaveunidad   = ref<SatClaveUnidad>({
                                    id:             0,
                                    c_claveunidad:  '',
                                    nombre:         '',
                                    ini_vigencia:   null,
                                    fin_vigencia:   null,
                                    activo:         true
                                });
    const satobjetosimpuestos   = ref<SatObjetoImpuesto[]>([]);
    const selectobjetoimpuesto  = ref<SatObjetoImpuesto>({
                                    id:             0,
                                    c_objetoimp:    '',
                                    descripcion:    '',
                                    ini_vigencia:   null,
                                    fin_vigencia:   null,
                                    activo:         true,
                                });
    const unidades_medida       = ref<UnidadMedida[]>([]);
    const selectunidad_medida   = ref<UnidadMedida>({
                                    id:             0,
                                    descripcion:    '',
                                    activo:         true
                                });

    const { isPending, data, isError } = useQuery({
        queryKey:    ['producto', id],
        queryFn:    () => getregistro(id),
        retry: false,
    });

    onMounted(async () => {
        satobjetosimpuestos.value.splice(0);
        tipos_inventario.value.splice(0);
        unidades_medida.value.splice(0);
        isPending.value = true;
        // Objetos de Impuesto
        const response = await ApiService.get2(`SatObjetoImp/listado`,null);
        satobjetosimpuestos.value = <SatObjetoImpuesto[]>response.data;
        const tempobjimp:SatObjetoImpuesto[] = satobjetosimpuestos.value.filter(item => item.c_objetoimp=='02');
        if (tempobjimp) selectobjetoimpuesto.value = tempobjimp[0];
        // Tipo de Imventario
        const responseinv = await ApiService.get2(`InvTipoInventario/listado`,null);
        tipos_inventario.value = <TipoInventario[]>responseinv.data;
        // if (tipos_inventario.value.length > 0) selecttipo_inventario.value = tipos_inventario.value[0];
        // Unidad de Medida
        const responsemed = await ApiService.get2(`AdmUnidadMedida/listado`,null);
        unidades_medida.value = <UnidadMedida[]>responsemed.data;
        // if (unidades_medida.value.length > 0) selectunidad_medida.value = unidades_medida.value[0];

        isPending.value = false;
    });

    const CalculaPrecios = () => {
        if (registro.value.costo_reposicion > 0 && registro.value.margen_utilidad > 0) 
            registro.value.precio = (+registro.value.costo_reposicion * (1 + (+registro.value.margen_utilidad/100)));
        if (registro.value.costo_reposicion == 0 && registro.value.precio > 0 && registro.value.margen_utilidad > 0) 
            registro.value.costo_reposicion = (+registro.value.precio / (1 + (+registro.value.margen_utilidad/100)));
    }

    const buscarMarca = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('Marcas/SearchByField/descripcion/'+event.query,null)
            const marcas:Marca[] = response.data;
            marcasfiltradas.value = marcas;
        } 
    }

    const buscarClaveProdServ = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('SatClaveProdServ/SearchByText/'+event.query,null)
            const registros:SatClaveProdServ[] = response.data;
            satprodservfiltrados.value = registros;
        } 
    }

    const buscarClaveUnidad = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2('SatClaveUnidad/SearchByText/'+event.query,null)
            const registros:SatClaveUnidad[] = response.data;
            satclaveunidadfiltradas.value = registros;
        } 
    }

    const selectFile = ($event:any) => {
        file.value = $event.files[0];
    }

    const selectFile_pdf = (event:any) => {
        file_pdf.value = event.files[0];
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
                formData.append('file',documento);
                const { data } = await ApiService.post('upload/single/productos',formData);
                toast.removeGroup('uploadfile');
                if (tipoarchivo.indexOf('pdf1') >= 0) file_pdf_pdf.value.clear();

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
                const { data } = await ApiService.post('upload/single/productos',formData);
                registro.value.file_imagen = data.filename;
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
                const response = await ApiService.get2('download/productos/'+filename,{responseType: 'arraybuffer'});
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
        if (registro.value.file_imagen.length > 0) {
            const response = await ApiService.get2('download/productos/'+
                registro.value.file_imagen,{responseType: 'arraybuffer'}
            );
            if (response.status == 200) {
                fileIMG.value = response.data;
                imgURL.value = URL.createObjectURL(new Blob([response.data], { type: 'image/*' }));
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
                                                        codigo:             '',
                                                        codigo_alterno:     '',
                                                        codigo_barras:      '',
                                                        descripcion:        '',
                                                        ficha_tecnica:      '',
                                                        metodo_costeo:      'Promedio',
                                                        tipo_inventario_id: 0,
                                                        marca_id:           0,
                                                        unidad_medida_id:   0,
                                                        costo_reposicion:   0,
                                                        ultimo_costo:       0,
                                                        margen_utilidad:    0,
                                                        precio:             0,
                                                        fecha_ultimacompra: null,
                                                        estatus:            'Activo',
                                                        inventariable:      false,
                                                        descvariable:       false,
                                                        claveprodserv_id:   0,
                                                        claveunidad_id:     0,
                                                        clase:              'Producto',
                                                        objetoimpuesto_id:  0,
                                                        impiva:             16,
                                                        impiesps:           0,
                                                        retencion_isr:      0,
                                                        retencion_iva:      0,
                                                        file_imagen:        '',
                                                        file_pdf:           '',
                                                        activo:             true,
                                                        talle_marca:        null,
                                                        inv_tipo_inventario: null,
                                                        adm_unidad_medida: null,
                                                        sat_claveprodserv: null,
                                                        sat_claveunidad:   null,
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
                isPending.value = true;
                const response = await ApiService.get2(`InvTipoInventario/GetById/${registro.value.tipo_inventario_id}`,null);
                selecttipo_inventario.value = <TipoInventario>response.data;
                const responseuni = await ApiService.get2(`AdmUnidadMedida/GetById/${registro.value.unidad_medida_id}`,null);
                selectunidad_medida.value = <UnidadMedida>responseuni.data;
                const responsemar = await ApiService.get2(`Marcas/GetById/${registro.value.marca_id}`,null);
                selectedmarca.value = <Marca>responsemar.data;
                const resclaveprodserv  = await ApiService.get2(`SatClaveProdServ/GetById/${registro.value.claveprodserv_id}`,null);
                selectedprodserv.value  = <SatClaveProdServ>resclaveprodserv.data;
                const resclaveunidad    = await ApiService.get2(`SatClaveUnidad/GetById/${registro.value.claveunidad_id}`,null);
                selectedclaveunidad.value  = <SatClaveUnidad>resclaveunidad.data;
                await ObtenerImagen();
                isPending.value = false;
            }
        }
            
    },{immediate: true, deep: true});

    return {
        isPending,
        registro,
        dataMutationUpdate,
        dataMutationNew,
        dataMutationDelete,
        isError,
        MensajeError,
        fileIMG,
        file,
        file_img,
        dialogMarca,
        dialogPDFVisor,
        imgURL,
        pdfViewer,
        tabActiva,
        file_pdf,
        file_pdf_pdf,
        pdfDocumento,
        selectedmarca,
        marcasfiltradas,
        tipos_inventario,
        selecttipo_inventario,
        satprodservfiltrados,
        selectedprodserv,
        satclaveunidadfiltradas,
        selectedclaveunidad,
        satobjetosimpuestos,
        selectobjetoimpuesto,
        unidades_medida,
        selectunidad_medida,
        
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
        buscarMarca,
        buscarClaveProdServ,
        buscarClaveUnidad,
        subirArchivo,
        selectFile,
        subirArchivoPDF,
        selectFile_pdf,
        VisualizarPDF,
        cerrarVisualizarPDF,
        CalculaPrecios,
    }
}

export default useProducto;