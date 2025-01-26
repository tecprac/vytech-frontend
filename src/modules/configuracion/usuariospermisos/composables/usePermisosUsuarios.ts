import { ref, onMounted } from 'vue';
import ApiService from '@/core/services/ApiService';
import type { PermissionsMap, PermisoAsigando, TreeNode } from '../interfaces/interfaces';
import type { Usuario } from '../../usuarios/interfaces/usuario';
import Swal from 'sweetalert2';
import { useToast } from 'primevue/usetoast';

const usePermisosUsuarios = () => {
    
    const toast = useToast();
    const isPending                     = ref<boolean>(false);
    const selectusuario                 = ref<Usuario>({
                                            id: 0,
                                            usuario: '',
                                            password: '',
                                            nombre: '',
                                            email: '',
                                            rol_id: 0,
                                            departamento_id: 0,
                                            telefono_movil: '',
                                            codigo_pais: '',
                                            ultimo_acceso: new Date(),
                                            ipacceso: '',
                                            activo: true
                                        });
    const usuarios                      = ref<Usuario[]>([]);
    const usuariosfiltrados             = ref<Usuario[]>([]);
    const nodes_configuracion           = ref<TreeNode[]>([]);
    const nodes_taller                  = ref<TreeNode[]>([]);
    const nodes_almacen                 = ref<TreeNode[]>([]);
    const nodes_administracion          = ref<TreeNode[]>([]);
    const key_configuracion             = ref<PermissionsMap>({});
    const key_taller                    = ref<PermissionsMap>({});
    const key_almacen                   = ref<PermissionsMap>({});
    const key_administracion            = ref<PermissionsMap>({});
    const expandkey_configuracion       = ref({});
    const expandkey_taller              = ref({});
    const expandkey_almacen             = ref({});
    const expandkey_administracion      = ref({});
    const loadingConf                   = ref<boolean>(false);
    const loadingTalle                  = ref<boolean>(false);
    const loadingAlma                   = ref<boolean>(false);
    const loadingAdm                    = ref<boolean>(false);

    onMounted(async () => {
        isPending.value = true;
        usuarios.value.splice(0);
        ApiService.setHeader();
        const response = await ApiService.get2('Usuarios/listado',null);
        usuarios.value = <Usuario[]>response.data.usuarios;
        const responseconf = await ApiService.get2('Modulos/GetTreeModulosPermisos/CONFIGURACION',null);
        nodes_configuracion.value = responseconf.data;
        const responsetaller = await ApiService.get2('Modulos/GetTreeModulosPermisos/TALLER',null);
        nodes_taller.value = responsetaller.data;
        const responsealmacen = await ApiService.get2('Modulos/GetTreeModulosPermisos/ALMACEN',null);
        nodes_almacen.value = responsealmacen.data;
        const responseaadmon = await ApiService.get2('Modulos/GetTreeModulosPermisos/ADMINISTRACION',null);
        nodes_administracion.value = responseaadmon.data;
        isPending.value = false;
    });

    const buscarUsuarios = async(event:any) => {
        if (!event.query.trim().length) {
            usuariosfiltrados.value = [...usuarios.value];
        } else {
            usuariosfiltrados.value = usuarios.value.filter((item:Usuario) => {
                return item.usuario.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }

    const ObtenerRelUsuario = async (id:number) => {
        key_configuracion.value = {};
        key_almacen.value       = {};
        key_taller.value        = {};
        key_administracion.value= {};
        Swal.fire({
            title: 'Consultando permisos asignados...',
            showDenyButton: false,
        });
        Swal.showLoading();
        try {
            ApiService.setHeader();
            // CONFIGURACION
            const response_conf = await ApiService.get2(`Usuarios/GetArbolPermisosUsuario/${id}/CONFIGURACION`,null);
            const permisos_conf = <PermisoAsigando[]>response_conf.data;
            for (let i = 0; i < permisos_conf.length; i++) {
                const item = permisos_conf[i];
                key_configuracion.value['3|PERMISO:'+item.modulo_id+'-'+item.permiso_id] = { checked: true, partialChecked: false };
            }
            // ALMACEN
            const response_alma = await ApiService.get2(`Usuarios/GetArbolPermisosUsuario/${id}/ALMACEN`,null);
            const permisos_alma = <PermisoAsigando[]>response_alma.data;
            for (let i = 0; i < permisos_alma.length; i++) {
                const item = permisos_alma[i];
                key_almacen.value['3|PERMISO:'+item.modulo_id+'-'+item.permiso_id] = { checked: true, partialChecked: false };
            }
            // TALLER
            const response_talle = await ApiService.get2(`Usuarios/GetArbolPermisosUsuario/${id}/TALLER`,null);
            const permisos_talle = <PermisoAsigando[]>response_talle.data;
            for (let i = 0; i < permisos_talle.length; i++) {
                const item = permisos_talle[i];
                key_taller.value['3|PERMISO:'+item.modulo_id+'-'+item.permiso_id] = { checked: true, partialChecked: false };
            }
            // ADMINISTRACION
            const response_adm = await ApiService.get2(`Usuarios/GetArbolPermisosUsuario/${id}/ADMINISTRACION`,null);
            const permisos_adm = <PermisoAsigando[]>response_adm.data;
            for (let i = 0; i < permisos_adm.length; i++) {
                const item = permisos_adm[i];
                key_administracion.value['3|PERMISO:'+item.modulo_id+'-'+item.permiso_id] = { checked: true, partialChecked: false };
            }
        } catch (error: any) {
            toast.add({
                severity:   "error",
                summary:    'Error',
                detail:     'Se genero un error al consultar los permisos del usuario\n.Intentelo mas tarde',
                life:       3000
            })
        }
        Swal.close();
    }

    // CONFIGURACIÓN
    const onNodeSelectConf = async (node) => {
        try {
            loadingConf.value = true;
            const apermisos:string[] = []
            for (const item in key_configuracion.value) {
                const value = key_configuracion.value[item];
                if (value.checked == true && item.indexOf('PERMISO') >= 0 ) {
                    const temp:string = item.toString();
                    apermisos.push(temp.substring(temp.indexOf(':')+1));
                }
            }
            const datos = {
                usuario_id: selectusuario.value.id,
                seccion:    'CONFIGURACION',
                permisos:   apermisos
            }
            ApiService.setHeader();
            await ApiService.post('/Usuarios/ActualizaPermisos',datos);
            loadingConf.value = false;    
        } catch (error) {
            toast.add({
                severity:   "error",
                summary:    'Error',
                detail:     'Se genero un error al intentar actualizar, intentelo mas tarde',
                life:       3000
            })
            loadingConf.value = false;
        }
        
    }

    const expandConf = () => {
        for (const node of nodes_configuracion.value) {
            expandNodeConf(node);
        }
        expandkey_configuracion.value = { ...expandkey_configuracion.value };
    };
    
    const expandNodeConf = (node) => {
        if (node.children && node.children.length) {
            expandkey_configuracion.value[node.key] = true;
            for (const child of node.children) {
                expandNodeConf(child);
            }
        }
    };

    // TALLER
    const onNodeSelectTalle = async (node) => {
        try {
            loadingTalle.value = true;
            const apermisos:string[] = []
            for (const item in key_taller.value) {
                const value = key_taller.value[item];
                if (value.checked == true && item.indexOf('PERMISO') >= 0 ) {
                    const temp:string = item.toString();
                    apermisos.push(temp.substring(temp.indexOf(':')+1));
                }
            }
            const datos = {
                usuario_id: selectusuario.value.id,
                seccion:    'TALLER',
                permisos:   apermisos
            }
            ApiService.setHeader();
            await ApiService.post('/Usuarios/ActualizaPermisos',datos);
            loadingTalle.value = false;    
        } catch (error) {
            toast.add({
                severity:   "error",
                summary:    'Error',
                detail:     'Se genero un error al intentar actualizar, intentelo mas tarde',
                life:       3000
            })
            loadingTalle.value = false;
        }
        
    }

    const expandTalle = () => {
        for (const node of nodes_taller.value) {
            expandNodeTalle(node);
        }
        expandkey_taller.value = { ...expandkey_taller.value };
    };

    const expandNodeTalle = (node) => {
        if (node.children && node.children.length) {
            expandkey_taller.value[node.key] = true;
            for (const child of node.children) {
                expandNodeTalle(child);
            }
        }
    };

    // ALMACEN
    const onNodeSelectAlma = async (node) => {
        try {
            loadingAlma.value = true;
            const apermisos:string[] = []
            for (const item in key_almacen.value) {
                const value = key_almacen.value[item];
                if (value.checked == true && item.indexOf('PERMISO') >= 0 ) {
                    const temp:string = item.toString();
                    apermisos.push(temp.substring(temp.indexOf(':')+1));
                }
            }
            const datos = {
                usuario_id: selectusuario.value.id,
                seccion:    'ALMACEN',
                permisos:   apermisos
            }
            ApiService.setHeader();
            await ApiService.post('/Usuarios/ActualizaPermisos',datos);
            loadingAlma.value = false;    
        } catch (error) {
            toast.add({
                severity:   "error",
                summary:    'Error',
                detail:     'Se genero un error al intentar actualizar, intentelo mas tarde',
                life:       3000
            })
            loadingAlma.value = false;
        }
        
    }

    const expandAlma = () => {
        for (const node of nodes_almacen.value) {
            expandNodeAlma(node);
        }
        expandkey_almacen.value = { ...expandkey_almacen.value };
    };

    const expandNodeAlma = (node) => {
        if (node.children && node.children.length) {
            expandkey_almacen.value[node.key] = true;
            for (const child of node.children) {
                expandNodeAlma(child);
            }
        }
    };

    // ADMINISTRACION
    const onNodeSelectAdm = async (node) => {
        try {
            loadingAdm.value = true;
            const apermisos:string[] = []
            for (const item in key_administracion.value) {
                const value = key_administracion.value[item];
                if (value.checked == true && item.indexOf('PERMISO') >= 0 ) {
                    const temp:string = item.toString();
                    apermisos.push(temp.substring(temp.indexOf(':')+1));
                }
            }
            const datos = {
                usuario_id: selectusuario.value.id,
                seccion:    'ADMINISTRACION',
                permisos:   apermisos
            }
            ApiService.setHeader();
            await ApiService.post('/Usuarios/ActualizaPermisos',datos);
            loadingAdm.value = false;    
        } catch (error) {
            toast.add({
                severity:   "error",
                summary:    'Error',
                detail:     'Se genero un error al intentar actualizar, intentelo mas tarde',
                life:       3000
            })
            loadingAdm.value = false;
        }
    }

    const expandAdm = () => {
        for (const node of nodes_administracion.value) {
            expandNodeAdm(node);
        }
        expandkey_administracion.value = { ...expandkey_administracion.value };
    };

    const expandNodeAdm = (node) => {
        if (node.children && node.children.length) {
            expandkey_administracion.value[node.key] = true;
            for (const child of node.children) {
                expandNodeAdm(child);
            }
        }
    };
    return {
        //Propiedades
        isPending,
        selectusuario,
        usuarios,
        usuariosfiltrados,
        nodes_configuracion,
        nodes_taller,
        nodes_almacen,
        nodes_administracion,
        key_configuracion,
        key_taller,
        key_almacen,
        key_administracion,
        expandkey_configuracion,
        expandkey_taller,
        expandkey_almacen,
        expandkey_administracion,
        loadingConf,
        loadingTalle,
        loadingAlma,
        loadingAdm,

        //Metodos
        buscarUsuarios,
        ObtenerRelUsuario,
        onNodeSelectConf,
        expandConf,
        onNodeSelectTalle,
        expandTalle,
        onNodeSelectAlma,
        expandAlma,
        onNodeSelectAdm,
        expandAdm,
    }

}

export default usePermisosUsuarios;