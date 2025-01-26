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
    }
}

export default useTecnico;