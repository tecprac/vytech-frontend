import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import useUtilerias from "@/core/helpers/utilerias";

export interface User {
    id:             number;
    usuario:        string;
    password:       string;
    nombre:         string;
    email:          string;
    emailvalidate:  boolean;
    superusuario:   boolean;
    rol_id:         number;
    departamento_id: number;
    api_token:      string;
    departamento:   string;
    rol:            string;
    ultimo_acceso?: string;
    [key: string]:  any;
}

export interface Permisos {
    codigo: string,
    modulo: string,
    permiso: string,
}

const { getLocalIP } = useUtilerias();

export const useAuthStore = defineStore("auth", () => {
    const errors            = ref({});
    const errormsg          = ref('');
    const user              = ref<User>({} as User);
    const validar_sesion    = ref<number>(0);
    const modulos           = ref<string>('');
    const secciones         = ref<string>('');
    const permisos          = ref<Permisos[]>([]);
    const isAuthenticated   = ref(!!JwtService.getToken());

    function setAuth(authUser: User, validarsesion: number) {
        isAuthenticated.value   = true;
        user.value              = authUser;
        validar_sesion.value    = validarsesion;
        errors.value            = {};
        errormsg.value          = '';
        JwtService.saveToken(user.value.api_token);
    }

    async function setPermisos() {
        if (user.value.id != 0) {
            modulos.value = '';
            secciones.value = '';
            // permisos.value = [];
            permisos.value.splice(0);
            await ApiService.get2(`Usuarios/GetModulos/${user.value.id}/Web`,null)
            .then(({data}) => {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    modulos.value += element.codigo+',';
                    
                }
            });
            await ApiService.get2(`Usuarios/GetSecciones/${user.value.id}/Web`,null)
            .then(({data}) => {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    secciones.value += element.seccion+',';
                }
            });
            await ApiService.get2(`Usuarios/GetPermisosByModulo/${user.value.id}`,null)
            .then(({data}) => {
                permisos.value.splice(0);
                for (let h = 0; h < data.length; h++) {
                    const element = data[h];
                    permisos.value.push( {
                        codigo: element.codigo,
                        modulo: element.modulo,
                        permiso: element.permiso,
                    });
                }
            });
        }
    }

    function setError(error: any, mensaje: string) {
        errors.value = { ...error };
        errormsg.value = mensaje;
    }

    function purgeAuth() {
        isAuthenticated.value = false;
        user.value = {} as User;
        errors.value = [];
        errormsg.value = '';
        modulos.value = '';
        secciones.value = '';
        permisos.value = [];
        permisos.value.splice(0);
        JwtService.destroyToken();
    }

    async function login(credentials: User) {
        credentials.ip_acceso = await getLocalIP();
        return ApiService.post("auth/login", credentials)
        .then( async ({ data }) => {
            const dataUser: User = {
                id:             data.user.id,
                usuario:        data.user.usuario,
                password:       data.user.password,
                nombre:         data.user.nombre,
                email:          data.user.email,
                emailvalidate:  data.user.emailvalidate,
                superusuario:   data.user.superusuario,
                rol_id:         data.user.rol_id,
                departamento_id: data.user.departamento_id,
                api_token:      data.token,
                departamento:   data.user.conf_departamento.departamento,
                rol:            data.user.conf_rol.rol,
                ultimo_acceso:  data.user.ultimo_acceso,
            };
            setAuth(dataUser,data.validar_sesion);
            if (user.value.id != 0) {
                modulos.value = '';
                secciones.value = '';
                permisos.value.splice(0);
                ApiService.setHeader();
                await ApiService.get2(`Usuarios/GetModulos/${user.value.id}/Web`,null)
                .then(({data}) => {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        modulos.value += element.codigo+',';
                    }
                })
                await ApiService.get2(`Usuarios/GetSecciones/${user.value.id}/Web`,null)
                .then(({data}) => {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        secciones.value += element.seccion+',';
                    }
                });
                await ApiService.get2(`Usuarios/GetPermisosByModulo/${user.value.id}`,null)
                .then(({data}) => {
                    for (let h = 0; h < data.length; h++) {
                        const element = data[h];
                        permisos.value.push( {
                            codigo: element.codigo,
                            modulo: element.modulo,
                            permiso: element.permiso,
                        });
                    }
                })
            }
        })
        .catch((error:any) => {
            if (error.code == 'ERR_BAD_REQUEST') {
                if (error.response.status == '400') {
                    setError(error.response.data.errors, 'Se genero un error desconocido');
                } else {
                    setError(error.response.data.errors, error.response.data.message);
                }
            } else if (error.code == 'ERR_NETWORK') {
                setError([], 'Se genero un error al conectarse con el Servidor');
            } else {
                // setError([], error.response.data.errors);
                setError([], error);
            }
        });
    }

    function logout() {
        purgeAuth();
    }

    async function register(credentials: User) {
        return ApiService.post("register", credentials)
        .then(({ data }) => {
            setAuth(data,0);
        })
        .catch(({ response }) => {
            setError(response.data.errors, response.data.message);
        });
    }

    async function forgotPassword(email: string) {
        return ApiService.post("forgot_password", email)
        .then(() => {
            setError({},'');
        })
        .catch(({ response }) => {
            setError(response.data.errors, response.data.message);
        });
    }

    async function verifyAuth() {
        if (JwtService.getToken()) {
            ApiService.setHeader();
            await ApiService.post("auth/verify_token", { api_token: JwtService.getToken() })
            .then(({ data }) => {
                const dataUser: User = {
                    id:             data.user.id,
                    usuario:        data.user.usuario,
                    password:       data.user.password,
                    nombre:         data.user.nombre,
                    email:          data.user.email,
                    emailvalidate:  data.user.emailvalidate,
                    superusuario:   data.user.superusuario,
                    rol_id:         data.user.rol_id,
                    departamento_id: data.user.departamento_id,
                    api_token:      data.token,
                    departamento:   data.user.conf_departamento.departamento,
                    rol:            data.user.conf_rol.rol,
                    ultimo_acceso:  data.user.ultimo_acceso,
                };
                setAuth(dataUser,data.validar_sesion);
            })
            .catch( ( error: any ) => {
                console.log(error);
                // setError(response.data.errors, response.data.message);
                purgeAuth();
            });
            if (user.value.id != 0) {
                modulos.value = '';
                secciones.value = '';
                permisos.value = [];
                await ApiService.get2(`Usuarios/GetModulos/${user.value.id}/Web`,null)
                .then(({data}) => {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        modulos.value += element.codigo+',';
                    }
                });
                await ApiService.get2(`Usuarios/GetSecciones/${user.value.id}/Web`,null)
                .then(({data}) => {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        secciones.value += element.seccion+',';
                    }
                });
                await ApiService.get2(`Usuarios/GetPermisosByModulo/${user.value.id}`,null)
                .then(({data}) => {
                    for (let h = 0; h < data.length; h++) {
                        const element = data[h];
                        permisos.value.push( {
                            codigo: element.codigo,
                            modulo: element.modulo,
                            permiso: element.permiso,
                        });
                    }
                });
            }
        } else {
            purgeAuth();
        }
    }

    return {
        // Propiedades
        errors,
        errormsg,
        user,
        isAuthenticated,
        validar_sesion,
        modulos,
        permisos,
        secciones,

        //Metodos
        login,
        logout,
        register,
        forgotPassword,
        verifyAuth,
        setPermisos,
    };
},{persist: true});
