import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import type { Usuario } from '../interfaces/usuario';
import type { Departamento } from '../../departamentos/interfaces/departamento';
import type { Rol } from '../../roles/interfaces/rol';
import { useToast } from 'primevue/usetoast';

interface cpassword {
    password:   string,
    confirmapwd:string,
}

const getregistro = async( id:number ):Promise<Usuario> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`Usuarios/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Usuario = {
            id:             0,
            usuario:        '',
            password:       '',
            nombre:         '',
            email:          '',
            telefono_movil: '',
            codigo_pais:    '+52',
            rol_id:         0,
            departamento_id:0,
            ultimo_acceso:  new Date(),
            ipacceso:       '',
            activo:         true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Usuario):Promise<Usuario> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`Usuarios`,registro);
    return data;
};

const updateRegistro =async (registro:Usuario ):Promise<Usuario> => { 
    ApiService.setHeader();
    const { data } = await ApiService.put(`Usuarios/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Usuario ):Promise<Usuario> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`Usuarios/${registro.id}`);
    return data;
};

const useUsuario = ( id: number) => {

    const registro      = ref<Usuario>({
        id:             0,
        usuario:        '',
        password:       '',
        nombre:         '',
        email:          '',
        telefono_movil: '',
        codigo_pais:    '',
        rol_id:         0,
        departamento_id:0,
        ultimo_acceso:  new Date(),
        ipacceso:       '',
        activo:         true

    });
    const MensajeError          = ref<string>('');
    const toast                 = useToast();
    const roles                 = ref<Rol[]>([]);
    const departamentos         = ref<Departamento[]>([]);
    const nombrerol             = ref<string>('');
    const nombredepartamento    = ref<string>('');
    const dialogPassword        = ref<boolean>(false);
    const cambiarPassword       = ref<cpassword>({
                                    password:       '',
                                    confirmapwd:    '',
                                });

    const limpiarValores = () => {
        registro.value = {
            id:             0,
            usuario:        '',
            password:       '',
            nombre:         '',
            email:          '',
            telefono_movil: '',
            codigo_pais:    '+52',
            rol_id:         0,
            departamento_id:0,
            ultimo_acceso:  new Date(),
            ipacceso:       '',
            activo:         true,
        }
    }

    const mostrarDialogPassword = () => {
        cambiarPassword.value = {
            password:   '',
            confirmapwd: '',
        };
        dialogPassword.value = true;
    }

    const enviarPassword = async ()  => {
        if (cambiarPassword.value.password != cambiarPassword.value.confirmapwd) {
            toast.add({severity: 'warn', summary:'Verificar', detail: 'No coinciden las contraseñas', life: 3000});
            return;
        } else if (cambiarPassword.value.password.trim().length == 0) {
            toast.add({severity: 'warn', summary:'Verificar', detail: 'La contraseña no puede estar en blanco', life: 3000});
            return;
        } else {
            try {
                ApiService.setHeader();
                await ApiService.put(`Usuarios/ActualizaPassword/${registro.value.id}`,cambiarPassword.value);
                dialogPassword.value = false;
                toast.add({ severity: 'success', summary: "Password Actualizado", life: 3000 });
            } catch (error: any) {
                toast.add({severity: 'error', summary:'Verificar', detail: 'Se genero un error al intentar actualizar contraseña', life: 3000});
            }
            
        }
    }

    onMounted( async () => {
        ApiService.setHeader();
        const responserol = await ApiService.get2('Roles/listado',null);
        roles.value = <Rol[]>responserol.data;
        const responsedepto = await ApiService.get2('Departamentos/listado',null);
        departamentos.value = <Departamento[]>responsedepto.data;
        nombredepartamento.value = departamentos.value[0].nombre;
        nombrerol.value = roles.value[0].nombre;
        if (id > 0) {
            nombrerol.value             = roles.value.find(({id}) => id == registro.value.rol_id)!.nombre;
            nombredepartamento.value    = departamentos.value.find(({id}) => id == registro.value.departamento_id)!.nombre;
        }
    });


    const { isPending, data, isError } = useQuery({
        queryKey:    ['usuario', id],
        queryFn:    () => getregistro(id),
        retry: false,
    });

    const dataMutationNew    = useMutation( { mutationFn: newRegistro,
                                                onSuccess() {
                                                    toast.add({
                                                        severity:   'success',
                                                        summary:    'Éxito',
                                                        detail:     'Información guardada correctamente',
                                                        life:       3500
                                                    })
                                                    limpiarValores();
                                                },
                                                onError(error: any) {
                                                    MensajeError.value = error.response.data.message;
                                                    toast.add({
                                                        severity: 'error',
                                                        summary: 'Error al guardar',
                                                        detail: '['+MensajeError.value+']'+'\n\nIntentelo mas tarde o comuniquese con su area de soporte',
                                                        life: 4000
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
                                                        life: 4000
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
                                                        life: 4000
                                                    });
                                                }
                                            });

    watch( data, () => {
        if (data.value)
            registro.value = {...data.value};
    },{immediate: true});

    return {
        isPending,
        registro,
        dataMutationUpdate,
        dataMutationNew,
        dataMutationDelete,
        isError,
        MensajeError,
        nombredepartamento,
        nombrerol,
        departamentos,
        roles,
        dialogPassword,
        cambiarPassword,
        
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
        mostrarDialogPassword,
        enviarPassword,
    }
}

export default useUsuario;