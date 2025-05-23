import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import { useNProgress} from '@vueuse/integrations/useNProgress'
import ApiService from "@/core/services/ApiService";

const { isLoading } = useNProgress(0.5);

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/dashboard",
        component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
        meta: {
            middleware: "auth",
        },
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                component: () => import("@/views/Dashboard.vue"),
                meta: {
                    pageTitle: "Dashboard",
                    breadcrumbs: ["Dashboards"],
                },
            },
            // Opción Configuración Parametros
            {
                path: "/modules/configuracion/parametros",
                name: 'parametros',
                component: () => import(/* webpackChunkName: "parametros" */ "@/modules/configuracion/parametros/layouts/ParametrosLayout.vue"),
                meta: {
                    pageTitle: "Parametros",
                    breadcrumbs: ["Configuración","Parametros"],
                    codigo: '006'
                },
                redirect: { name: 'parametrosindex'},
                children: [
                    {
                        path: 'parametrosindex',
                        name: 'parametrosindex',
                        component: () => import(/* webpackChunkName: "parametrosindex" */ "@/modules/configuracion/parametros/pages/IndexPage.vue"),
                        meta: {
                            pageTitle: "Parametros",
                        }
                    }
                ]
            },
            // Menú Configuración Roles
            {
                path: "/modules/configuracion/roles",
                name: "roles",
                component: () => import(/* webpackChunkName: "roles" */ "@/modules/configuracion/roles/layouts/RolesLayout.vue"),
                meta: {
                    pageTitle: "Roles",
                    breadcrumbs: ["Configuración","Roles"],
                    codigo: '002'
                },
                redirect: { name: 'roleslist'},
                children:[
                    {
                        path: 'roleslist',
                        name: 'roleslist',
                        component: () => import(/* webpackChunkName: "roleslist" */ "@/modules/configuracion/roles/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Roles",
                        }
                    },
                    {
                        path: 'rol-nuevo/',
                        name: 'rol-nuevo',
                        component: () => import(/* webpackChunkName: "rolnuevo" */ "@/modules/configuracion/roles/pages/RolesNuevoPage.vue"),
                        meta: {
                            pageTitle: "Roles Nuevo"
                        }
                    },
                    {
                        path: 'rol-edita/:id',
                        name: 'rol-edita',
                        component: () => import(/* webpackChunkName: "roledita" */ "@/modules/configuracion/roles/pages/RolesEditaPage.vue"),
                        meta: {
                            pageTitle: "Roles Editar"
                        }
                    },
                    {
                        path: 'rol-consulta/:id',
                        name: 'rol-consulta',
                        component: () => import(/* webpackChunkName: "rolconsulta" */ "@/modules/configuracion/roles/pages/RolesConsultaPage.vue"),
                        meta: {
                            pageTitle: "Roles Consulta"
                        }
                    },
                    {
                        path: 'rol-elimina/:id',
                        name: 'rol-elimina',
                        component: () => import(/* webpackChunkName: "rolelimina" */ "@/modules/configuracion/roles/pages/RolesEliminaPage.vue"),
                        meta: {
                            pageTitle: "Roles Elimina"
                        }
                    },
                ]
            },
            // Menú Configuración Departamentos
            {
                path: "/modules/configuracion/departamentos",
                name: "departamentos",
                component: () => import(/* webpackChunkName: "departamentos" */ "@/modules/configuracion/departamentos/layouts/DepartamentosLayout.vue"),
                meta: {
                    pageTitle: "Departamentos",
                    breadcrumbs: ["Configuración","Departamentos"],
                    codigo: '003'
                },
                redirect: { name: 'departamentoslist'},
                children:[
                    {
                        path: 'departamentoslist',
                        name: 'departamentoslist',
                        component: () => import(/* webpackChunkName: "departamentoslist" */ "@/modules/configuracion/departamentos/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Departamentos",
                        }
                    },
                    {
                        path: 'departamento-nuevo/',
                        name: 'departamento-nuevo',
                        component: () => import(/* webpackChunkName: "departamentonuevo" */ "@/modules/configuracion/departamentos/pages/DepartamentosNuevoPage.vue"),
                        meta: {
                            pageTitle: "Departanentos Nuevo"
                        }
                    },
                    {
                        path: 'departamento-edita/:id',
                        name: 'departamento-edita',
                        component: () => import(/* webpackChunkName: "departamentoedita" */ "@/modules/configuracion/departamentos/pages/DepartamentosEditaPage.vue"),
                        meta: {
                            pageTitle: "Departanentos Editar"
                        }
                    },
                    {
                        path: 'departamento-consulta/:id',
                        name: 'departamento-consulta',
                        component: () => import(/* webpackChunkName: "departamentoconsulta" */ "@/modules/configuracion/departamentos/pages/DepartamentosConsultaPage.vue"),
                        meta: {
                            pageTitle: "Departamentos Consulta"
                        }
                    },
                    {
                        path: 'departamento-elimina/:id',
                        name: 'departamento-elimina',
                        component: () => import(/* webpackChunkName: "departamentoelimina" */ "@/modules/configuracion/departamentos/pages/DepartamentosEliminaPage.vue"),
                        meta: {
                            pageTitle: "Departanentos Elimina"
                        }
                    },
                ]
            },
            // Menú Configuración Permisos
            {
                path: "/modules/configuracion/permisos",
                name: "permisos",
                component: () => import(/* webpackChunkName: "permisos" */ "@/modules/configuracion/permisos/layouts/PermisosLayout.vue"),
                meta: {
                    pageTitle: "Permisos",
                    breadcrumbs: ["Configuración","Permisos"],
                    codigo: '004'
                },
                redirect: { name: 'permisoslist'},
                children:[
                    {
                        path: 'permisoslist',
                        name: 'permisoslist',
                        component: () => import(/* webpackChunkName: "permisoslist" */ "@/modules/configuracion/permisos/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Permisos",
                        }
                    },
                    {
                        path: 'permiso-nuevo/',
                        name: 'permiso-nuevo',
                        component: () => import(/* webpackChunkName: "permisonuevo" */ "@/modules/configuracion/permisos/pages/PermisoNuevoPage.vue"),
                        meta: {
                            pageTitle: "Permiso Nuevo"
                        }
                    },
                    {
                        path: 'permiso-edita/:id',
                        name: 'permiso-edita',
                        component: () => import(/* webpackChunkName: "permisoedita" */ "@/modules/configuracion/permisos/pages/PermisoEditaPage.vue"),
                        meta: {
                            pageTitle: "Permiso Editar"
                        }
                    },
                    {
                        path: 'permiso-consulta/:id',
                        name: 'permiso-consulta',
                        component: () => import(/* webpackChunkName: "permisoconsulta" */ "@/modules/configuracion/permisos/pages/PermisoConsultaPage.vue"),
                        meta: {
                            pageTitle: "Permiso Consulta"
                        }
                    },
                    {
                        path: 'permiso-elimina/:id',
                        name: 'permiso-elimina',
                        component: () => import(/* webpackChunkName: "permisoelimina" */ "@/modules/configuracion/permisos/pages/PermisoEliminaPage.vue"),
                        meta: {
                            pageTitle: "Permisos Elimina"
                        }
                    },
                ]
            },
            // Menú Configuración Modulos
            {
                path: "/modules/configuracion/modulos",
                name: "modulos",
                component: () => import(/* webpackChunkName: "modulos" */ "@/modules/configuracion/modulos/layouts/ModulosLayout.vue"),
                meta: {
                    pageTitle: "Modulos",
                    breadcrumbs: ["Configuración","Modulos"],
                    codigo: '005'
                },
                redirect: { name: 'moduloslist'},
                children:[
                    {
                        path: 'moduloslist',
                        name: 'moduloslist',
                        component: () => import(/* webpackChunkName: "moduloslist" */ "@/modules/configuracion/modulos/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Modulos",
                        }
                    },
                    {
                        path: 'modulo-nuevo/',
                        name: 'modulo-nuevo',
                        component: () => import(/* webpackChunkName: "modulonuevo" */ "@/modules/configuracion/modulos/pages/ModuloNuevoPage.vue"),
                        meta: {
                            pageTitle: "Modulos Nuevo"
                        }
                    },
                    {
                        path: 'modulo-edita/:id',
                        name: 'modulo-edita',
                        component: () => import(/* webpackChunkName: "modulosedita" */ "@/modules/configuracion/modulos/pages/ModuloEditaPage.vue"),
                        meta: {
                            pageTitle: "Modulos Editar"
                        }
                    },
                    {
                        path: 'modulo-consulta/:id',
                        name: 'modulo-consulta',
                        component: () => import(/* webpackChunkName: "moduloconsulta" */ "@/modules/configuracion/modulos/pages/ModuloConsultaPage.vue"),
                        meta: {
                            pageTitle: "Modulos Consulta"
                        }
                    },
                    {
                        path: 'modulo-elimina/:id',
                        name: 'modulo-elimina',
                        component: () => import(/* webpackChunkName: "moduloelimina" */ "@/modules/configuracion/modulos/pages/ModuloEliminaPage.vue"),
                        meta: {
                            pageTitle: "Modulos Elimina"
                        }
                    },
                ]
            },
            // Item Configuración Modulos-Permisos
            {
                path: "/modules/configuracion/modulospermisos",
                name: 'modulospermisos',
                component: () => import(/* webpackChunkName: "modulospermisos" */ "@/modules/configuracion/modulospermisos/layouts/ModulosPermisosLayout.vue"),
                meta: {
                    pageTitle: "Modulos - Permisos",
                    breadcrumbs: ["Configuración","Modulos-Permisos"],
                    codigo: '006'
                },
                redirect: { name: 'modulospermisosindex'},
                children: [
                    {
                        path: 'modulospermisosindex',
                        name: 'modulospermisosindex',
                        component: () => import(/* webpackChunkName: "modulospermisosindex" */ "@/modules/configuracion/modulospermisos/pages/IndexPage.vue"),
                        meta: {
                            pageTitle: "Modulos - Permisos",
                        }
                    }
                ]
            },
            // Menú Configuración Usuarios
            {
                path: "/modules/configuracion/usuarios",
                name: "usuarios",
                component: () => import(/* webpackChunkName: "usuarios" */ "@/modules/configuracion/usuarios/layouts/UsuariosLayout.vue"),
                meta: {
                    pageTitle: "Usuarios",
                    breadcrumbs: ["Configuración","Usuarios"],
                    codigo: '007'
                },
                redirect: { name: 'usuarioslist'},
                children:[
                    {
                        path: 'usuarioslist',
                        name: 'usuarioslist',
                        component: () => import(/* webpackChunkName: "usuarioslist" */ "@/modules/configuracion/usuarios/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Usuarios",
                        }
                    },
                    {
                        path: 'usuario-nuevo/',
                        name: 'usuario-nuevo',
                        component: () => import(/* webpackChunkName: "usuarionuevo" */ "@/modules/configuracion/usuarios/pages/UsuarioNuevoPage.vue"),
                        meta: {
                            pageTitle: "Usuario Nuevo"
                        }
                    },
                    {
                        path: 'usuario-edita/:id',
                        name: 'usuario-edita',
                        component: () => import(/* webpackChunkName: "usuarioedita" */ "@/modules/configuracion/usuarios/pages/UsuarioEditaPage.vue"),
                        meta: {
                            pageTitle: "Usuario Editar"
                        }
                    },
                    {
                        path: 'usuario-consulta/:id',
                        name: 'usuario-consulta',
                        component: () => import(/* webpackChunkName: "usuarioconsulta" */ "@/modules/configuracion/usuarios/pages/UsuarioConsultaPage.vue"),
                        meta: {
                            pageTitle: "Usuario Consulta"
                        }
                    },
                    {
                        path: 'usuario-elimina/:id',
                        name: 'usuario-elimina',
                        component: () => import(/* webpackChunkName: "usuarioelimina" */ "@/modules/configuracion/usuarios/pages/UsuarioEliminaPage.vue"),
                        meta: {
                            pageTitle: "Usuario Elimina"
                        }
                    },
                ]
            },
            // Item Configuración Usuarios - Permisos
            {
                path: "/modules/configuracion/usuariospermisos",
                name: "usuariospermisos",
                component: () => import(/* webpackChunkName: "usuariospermisos" */ "@/modules/configuracion/usuariospermisos/layouts/UsuariosPermisosLayouts.vue"),
                meta: {
                    pageTitle: "Usuarios Permisos",
                    breadcrumbs: ["Configuración","Usuarios Permisos"],
                    codigo: '008'
                },
                redirect: { name: 'usuariospermisosindex'},
                children:[{
                            path: 'usuariospermisosindex',
                            name: 'usuariospermisosindex',
                            component: () => import(/* webpackChunkName: "usuariospermisosindex" */ "@/modules/configuracion/usuariospermisos/pages/IndexPage.vue"),
                            meta: {
                                pageTitle: "Usuarios Permisos",

                            }
                        },
                ]
            },
            // Item Configuración Folio Documentos
            {
                path: "/modules/configuracion/folioDocumento",
                name: "foliodocumentos",
                component: () => import(/* webpackChunkName: "foliodocumentos" */ "@/modules/configuracion/folioDocumento/layouts/FolioDocumentoLayout.vue"),
                meta: {
                    pageTitle: "Folio Documentos",
                    breadcrumbs: ["Configuración","Folio Documento"],
                    codigo: '041'
                },
                redirect: { name: 'foliodocumentolist'},
                children:[
                    {
                        path: 'foliodocumentolist',
                        name: 'foliodocumentolist',
                        component: () => import(/* webpackChunkName: "foliodocumentolist" */ "@/modules/configuracion/folioDocumento/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Folio Documentos",
                        }
                    },
                    {
                        path: 'folio-nuevo/',
                        name: 'folio-nuevo',
                        component: () => import(/* webpackChunkName: "folionuevo" */ "@/modules/configuracion/folioDocumento/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Folio Documento Nuevo"
                        }
                    },
                    {
                        path: 'folio-edita/:id',
                        name: 'folio-edita',
                        component: () => import(/* webpackChunkName: "folioedita" */ "@/modules/configuracion/folioDocumento/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Folio Documento Editar"
                        }
                    },
                    {
                        path: 'folio-consulta/:id',
                        name: 'folio-consulta',
                        component: () => import(/* webpackChunkName: "folioconsulta" */ "@/modules/configuracion/folioDocumento/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Folio Documento Consulta"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Motivos
            {
                path: "/modules/taller/catalogos/motivos",
                name: "motivo",
                component: () => import(/* webpackChunkName: "motivo" */ "@/modules/taller/catalogos/motivos/layouts/MotivoLayout.vue"),
                meta: {
                    pageTitle: "Motivos",
                    breadcrumbs: ["Taller","Catalogos","Motivos"],
                    codigo: '051'
                },
                redirect: { name: 'motivoslist'},
                children:[
                    {
                        path: 'motivoslist',
                        name: 'motivoslist',
                        component: () => import(/* webpackChunkName: "motivoslist" */ "@/modules/taller/catalogos/motivos/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Motivos",
                        }
                    },
                    {
                        path: 'motivo-nuevo/',
                        name: 'motivo-nuevo',
                        component: () => import(/* webpackChunkName: "motivonuevo" */ "@/modules/taller/catalogos/motivos/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Motivo Nuevo"
                        }
                    },
                    {
                        path: 'motivo-edita/:id',
                        name: 'motivo-edita',
                        component: () => import(/* webpackChunkName: "motivoedita" */ "@/modules/taller/catalogos/motivos/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Motivo Editar"
                        }
                    },
                    {
                        path: 'motivo-consulta/:id',
                        name: 'motivo-consulta',
                        component: () => import(/* webpackChunkName: "motivoconsulta" */ "@/modules/taller/catalogos/motivos/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Motivo Consulta"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Marcas
            {
                path: "/modules/taller/catalogos/marcas",
                name: "marcas",
                component: () => import(/* webpackChunkName: "marcas" */ "@/modules/taller/catalogos/marcas/layouts/MarcasLayout.vue"),
                meta: {
                    pageTitle: "Marcas",
                    breadcrumbs: ["Taller","Catalogos","Marcas"],
                    codigo: '009'
                },
                redirect: { name: 'marcaslist'},
                children:[
                    {
                        path: 'marcaslist',
                        name: 'marcaslist',
                        component: () => import(/* webpackChunkName: "marcaslist" */ "@/modules/taller/catalogos/marcas/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Marcas",
                        }
                    },
                    {
                        path: 'marca-nuevo/',
                        name: 'marca-nuevo',
                        component: () => import(/* webpackChunkName: "marcanuevo" */ "@/modules/taller/catalogos/marcas/pages/MarcaNuevoPage.vue"),
                        meta: {
                            pageTitle: "Marca Nuevo"
                        }
                    },
                    {
                        path: 'marca-edita/:id',
                        name: 'marca-edita',
                        component: () => import(/* webpackChunkName: "marcaedita" */ "@/modules/taller/catalogos/marcas/pages/MarcaEditaPage.vue"),
                        meta: {
                            pageTitle: "Marca Editar"
                        }
                    },
                    {
                        path: 'marca-consulta/:id',
                        name: 'marca-consulta',
                        component: () => import(/* webpackChunkName: "marcaconsulta" */ "@/modules/taller/catalogos/marcas/pages/MarcaConsultaPage.vue"),
                        meta: {
                            pageTitle: "Marca Consulta"
                        }
                    },
                    {
                        path: 'marca-elimina/:id',
                        name: 'marca-elimina',
                        component: () => import(/* webpackChunkName: "marcaelimina" */ "@/modules/taller/catalogos/marcas/pages/MarcaEliminaPage.vue"),
                        meta: {
                            pageTitle: "Marca Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Modelos
            {
                path: "/modules/taller/catalogos/modelos",
                name: "modelos",
                component: () => import(/* webpackChunkName: "modelos" */ "@/modules/taller/catalogos/modelos/layouts/ModelosLayout.vue"),
                meta: {
                    pageTitle: "Modelos",
                    breadcrumbs: ["Taller","Catalogos","Modelos"],
                    codigo: '010'
                },
                redirect: { name: 'modeloslist'},
                children:[
                    {
                        path: 'modeloslist',
                        name: 'modeloslist',
                        component: () => import(/* webpackChunkName: "modeloslist" */ "@/modules/taller/catalogos/modelos/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Modelos",
                        }
                    },
                    {
                        path: 'modelo-nuevo/',
                        name: 'modelo-nuevo',
                        component: () => import(/* webpackChunkName: "modelonuevo" */ "@/modules/taller/catalogos/modelos/pages/ModeloNuevoPage.vue"),
                        meta: {
                            pageTitle: "Modelo Nuevo"
                        }
                    },
                    {
                        path: 'modelo-edita/:id',
                        name: 'modelo-edita',
                        component: () => import(/* webpackChunkName: "modeloedita" */ "@/modules/taller/catalogos/modelos/pages/ModeloEditaPage.vue"),
                        meta: {
                            pageTitle: "Modelo Editar"
                        }
                    },
                    {
                        path: 'modelo-consulta/:id',
                        name: 'modelo-consulta',
                        component: () => import(/* webpackChunkName: "modeloconsulta" */ "@/modules/taller/catalogos/modelos/pages/ModeloConsultaPage.vue"),
                        meta: {
                            pageTitle: "Modelo Consulta"
                        }
                    },
                    {
                        path: 'modelo-elimina/:id',
                        name: 'modelo-elimina',
                        component: () => import(/* webpackChunkName: "modeloelimina" */ "@/modules/taller/catalogos/modelos/pages/ModeloEliminaPage.vue"),
                        meta: {
                            pageTitle: "Modelo Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Transmisiones
            {
                path: "/modules/taller/catalogos/transmisiones",
                name: "transmisiones",
                component: () => import(/* webpackChunkName: "transmisiones" */ "@/modules/taller/catalogos/transmisiones/layouts/TransmisionesLayout.vue"),
                meta: {
                    pageTitle: "Transmisiones",
                    breadcrumbs: ["Taller","Catalogos","Transmisiones"],
                    codigo: '012'
                },
                redirect: { name: 'transmisioneslist'},
                children:[
                    {
                        path: 'transmisioneslist',
                        name: 'transmisioneslist',
                        component: () => import(/* webpackChunkName: "transmisioneslist" */ "@/modules/taller/catalogos/transmisiones/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Transmisiones",
                        }
                    },
                    {
                        path: 'transmision-nuevo/',
                        name: 'transmision-nuevo',
                        component: () => import(/* webpackChunkName: "transmisionnuevo" */ "@/modules/taller/catalogos/transmisiones/pages/TransmisionNuevoPage.vue"),
                        meta: {
                            pageTitle: "Transmisión Nueva"
                        }
                    },
                    {
                        path: 'transmision-edita/:id',
                        name: 'transmision-edita',
                        component: () => import(/* webpackChunkName: "transmisionedita" */ "@/modules/taller/catalogos/transmisiones/pages/TransmisionEditaPage.vue"),
                        meta: {
                            pageTitle: "Transmisión Editar"
                        }
                    },
                    {
                        path: 'transmision-consulta/:id',
                        name: 'transmision-consulta',
                        component: () => import(/* webpackChunkName: "transmisionconsulta" */ "@/modules/taller/catalogos/transmisiones/pages/TransmisionConsultaPage.vue"),
                        meta: {
                            pageTitle: "Transmisión Consulta"
                        }
                    },
                    {
                        path: 'transmision-elimina/:id',
                        name: 'transmision-elimina',
                        component: () => import(/* webpackChunkName: "transmisionelimina" */ "@/modules/taller/catalogos/transmisiones/pages/TransmisionEliminaPage.vue"),
                        meta: {
                            pageTitle: "Transmision Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Tipo Unidad
            {
                path: "/modules/taller/catalogos/tipounidad",
                name: "tipounidad",
                component: () => import(/* webpackChunkName: "tipounidad" */ "@/modules/taller/catalogos/tipounidad/layouts/TipoUnidadLayout.vue"),
                meta: {
                    pageTitle: "Tipo Unidad",
                    breadcrumbs: ["Taller","Catalogos","Tipo Unidad"],
                    codigo: '013'
                },
                redirect: { name: 'tipounidadlist'},
                children:[
                    {
                        path: 'tipounidadlist',
                        name: 'tipounidadlist',
                        component: () => import(/* webpackChunkName: "tipounidadlist" */ "@/modules/taller/catalogos/tipounidad/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Tipo Unidad",
                        }
                    },
                    {
                        path: 'tipounidad-nuevo/',
                        name: 'tipounidad-nuevo',
                        component: () => import(/* webpackChunkName: "tipounidadnuevo" */ "@/modules/taller/catalogos/tipounidad/pages/TipoUnidadNuevoPage.vue"),
                        meta: {
                            pageTitle: "Tipo Unidad Nueva"
                        }
                    },
                    {
                        path: 'tipounidad-edita/:id',
                        name: 'tipounidad-edita',
                        component: () => import(/* webpackChunkName: "tipounidaddita" */ "@/modules/taller/catalogos/tipounidad/pages/TipoUnidadEditaPage.vue"),
                        meta: {
                            pageTitle: "Tipo Unidad Editar"
                        }
                    },
                    {
                        path: 'tipounidad-consulta/:id',
                        name: 'tipounidad-consulta',
                        component: () => import(/* webpackChunkName: "tipounidadconsulta" */ "@/modules/taller/catalogos/tipounidad/pages/TipoUnidadConsultaPage.vue"),
                        meta: {
                            pageTitle: "Tipo Unidad Consulta"
                        }
                    },
                    {
                        path: 'tipounidad-elimina/:id',
                        name: 'tipounidad-elimina',
                        component: () => import(/* webpackChunkName: "tipounidadelimina" */ "@/modules/taller/catalogos/tipounidad/pages/TipoUnidadEliminaPage.vue"),
                        meta: {
                            pageTitle: "Tipo Unidad Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Componente
            {
                path: "/modules/taller/catalogos/componentes",
                name: "componentes",
                component: () => import(/* webpackChunkName: "componentes" */ "@/modules/taller/catalogos/componentes/layouts/ComponentesLayout.vue"),
                meta: {
                    pageTitle: "Componentes",
                    breadcrumbs: ["Taller","Catalogos","Componentes"],
                    codigo: '014'
                },
                redirect: { name: 'componenteslist'},
                children:[
                    {
                        path: 'componenteslist',
                        name: 'componenteslist',
                        component: () => import(/* webpackChunkName: "componenteslist" */ "@/modules/taller/catalogos/componentes/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Componentes",
                        }
                    },
                    {
                        path: 'componente-nuevo/',
                        name: 'componente-nuevo',
                        component: () => import(/* webpackChunkName: "componentesnuevo" */ "@/modules/taller/catalogos/componentes/pages/ComponenteNuevoPage.vue"),
                        meta: {
                            pageTitle: "Componente Nuevo"
                        }
                    },
                    {
                        path: 'componente-edita/:id',
                        name: 'componente-edita',
                        component: () => import(/* webpackChunkName: "componenteedita" */ "@/modules/taller/catalogos/componentes/pages/ComponenteEditaPage.vue"),
                        meta: {
                            pageTitle: "Componente Editar"
                        }
                    },
                    {
                        path: 'componente-consulta/:id',
                        name: 'componente-consulta',
                        component: () => import(/* webpackChunkName: "componenteconsulta" */ "@/modules/taller/catalogos/componentes/pages/ComponenteConsultaPage.vue"),
                        meta: {
                            pageTitle: "Componente Consulta"
                        }
                    },
                    {
                        path: 'componente-elimina/:id',
                        name: 'componente-elimina',
                        component: () => import(/* webpackChunkName: "componenteelimina" */ "@/modules/taller/catalogos/componentes/pages/ComponenteEliminaPage.vue"),
                        meta: {
                            pageTitle: "Componente Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Bahia
            {
                path: "/modules/taller/catalogos/bahias",
                name: "bahias",
                component: () => import(/* webpackChunkName: "bahias" */ "@/modules/taller/catalogos/bahias/layouts/BahiasLayout.vue"),
                meta: {
                    pageTitle: "bahias",
                    breadcrumbs: ["Taller","Catalogos","Bahias"],
                    codigo: '017'
                },
                redirect: { name: 'bahiaslist'},
                children:[
                    {
                        path: 'bahiaslist',
                        name: 'bahiaslist',
                        component: () => import(/* webpackChunkName: "bahiaslist" */ "@/modules/taller/catalogos/bahias/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Bahias",
                        }
                    },
                    {
                        path: 'bahia-nuevo/',
                        name: 'bahia-nuevo',
                        component: () => import(/* webpackChunkName: "bahianuevo" */ "@/modules/taller/catalogos/bahias/pages/BahiaNuevoPage.vue"),
                        meta: {
                            pageTitle: "Bahia Nueva"
                        }
                    },
                    {
                        path: 'bahia-edita/:id',
                        name: 'bahia-edita',
                        component: () => import(/* webpackChunkName: "bahiaedita" */ "@/modules/taller/catalogos/bahias/pages/BahiaEditaPage.vue"),
                        meta: {
                            pageTitle: "Bahia Editar"
                        }
                    },
                    {
                        path: 'bahia-consulta/:id',
                        name: 'bahia-consulta',
                        component: () => import(/* webpackChunkName: "bahiaconsulta" */ "@/modules/taller/catalogos/bahias/pages/BahiaConsultaPage.vue"),
                        meta: {
                            pageTitle: "Bahia Consulta"
                        }
                    },
                    {
                        path: 'bahia-elimina/:id',
                        name: 'bahia-elimina',
                        component: () => import(/* webpackChunkName: "bahiaelimina" */ "@/modules/taller/catalogos/bahias/pages/BahiaEliminaPage.vue"),
                        meta: {
                            pageTitle: "Bahia Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos División
            {
                path: "/modules/taller/catalogos/divisiones",
                name: "divisiones",
                component: () => import(/* webpackChunkName: "divisiones" */ "@/modules/taller/catalogos/divisiones/layouts/DivisionLayout.vue"),
                meta: {
                    pageTitle: "Divisiones",
                    breadcrumbs: ["Taller","Catalogos","División"],
                    codigo: '017'
                },
                redirect: { name: 'divisioneslist'},
                children:[
                    {
                        path: 'divisioneslist',
                        name: 'divisioneslist',
                        component: () => import(/* webpackChunkName: "divisioneslist" */ "@/modules/taller/catalogos/divisiones/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Divisiones",
                        }
                    },
                    {
                        path: 'division-nuevo/',
                        name: 'division-nuevo',
                        component: () => import(/* webpackChunkName: "divisionnuevo" */ "@/modules/taller/catalogos/divisiones/pages/DivisionNuevoPage.vue"),
                        meta: {
                            pageTitle: "División Nueva"
                        }
                    },
                    {
                        path: 'division-edita/:id',
                        name: 'division-edita',
                        component: () => import(/* webpackChunkName: "divisionedita" */ "@/modules/taller/catalogos/divisiones/pages/DivisionEditaPage.vue"),
                        meta: {
                            pageTitle: "División Editar"
                        }
                    },
                    {
                        path: 'division-consulta/:id',
                        name: 'division-consulta',
                        component: () => import(/* webpackChunkName: "divisionconsulta" */ "@/modules/taller/catalogos/divisiones/pages/DivisionConsultaPage.vue"),
                        meta: {
                            pageTitle: "División Consulta"
                        }
                    },
                    {
                        path: 'division-elimina/:id',
                        name: 'division-elimina',
                        component: () => import(/* webpackChunkName: "divisionelimina" */ "@/modules/taller/catalogos/divisiones/pages/DivisionEliminaPage.vue"),
                        meta: {
                            pageTitle: "División Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Motor
            {
                path: "/modules/taller/catalogos/motores",
                name: "motores",
                component: () => import(/* webpackChunkName: "motores" */ "@/modules/taller/catalogos/motores/layouts/MotorLayout.vue"),
                meta: {
                    pageTitle: "Motores",
                    breadcrumbs: ["Taller","Catalogos","Motores"],
                    codigo: '011'
                },
                redirect: { name: 'motoreslist'},
                children:[
                    {
                        path: 'motoreslist',
                        name: 'motoreslist',
                        component: () => import(/* webpackChunkName: "motoreslist" */ "@/modules/taller/catalogos/motores/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Motores",
                        }
                    },
                    {
                        path: 'motor-nuevo/',
                        name: 'motor-nuevo',
                        component: () => import(/* webpackChunkName: "motornuevo" */ "@/modules/taller/catalogos/motores/pages/MotorNuevoPage.vue"),
                        meta: {
                            pageTitle: "Motor Nuevo"
                        }
                    },
                    {
                        path: 'motor-edita/:id',
                        name: 'motor-edita',
                        component: () => import(/* webpackChunkName: "motoredita" */ "@/modules/taller/catalogos/motores/pages/MotorEditaPage.vue"),
                        meta: {
                            pageTitle: "Motor Editar"
                        }
                    },
                    {
                        path: 'motor-consulta/:id',
                        name: 'motor-consulta',
                        component: () => import(/* webpackChunkName: "motorconsulta" */ "@/modules/taller/catalogos/motores/pages/MotorConsultaPage.vue"),
                        meta: {
                            pageTitle: "Motor Consulta"
                        }
                    },
                    {
                        path: 'motor-elimina/:id',
                        name: 'motor-elimina',
                        component: () => import(/* webpackChunkName: "divisionelimina" */ "@/modules/taller/catalogos/motores/pages/MotorEliminaPage.vue"),
                        meta: {
                            pageTitle: "Motor Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Tipos de Servicio 
            {
                path: "/modules/taller/catalogos/tiposervicios",
                name: "tiposervicios",
                component: () => import(/* webpackChunkName: "tiposervicios" */ "@/modules/taller/catalogos/tiposervicios/layouts/TipoServicioLayout.vue"),
                meta: {
                    pageTitle: "Tipos de Servicio",
                    breadcrumbs: ["Taller","Catalogos","Tipos de Servicio"],
                    codigo: '015'
                },
                redirect: { name: 'tiposervicioslist'},
                children:[
                    {
                        path: 'tiposervicioslist',
                        name: 'tiposervicioslist',
                        component: () => import(/* webpackChunkName: "tiposervicioslist" */ "@/modules/taller/catalogos/tiposervicios/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Tipos de Servicio",
                        }
                    },
                    {
                        path: 'tiposervicio-nuevo/',
                        name: 'tiposervicio-nuevo',
                        component: () => import(/* webpackChunkName: "tiposervicionuevo" */ "@/modules/taller/catalogos/tiposervicios/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Tipo de Servicio Nuevo"
                        }
                    },
                    {
                        path: 'tiposervicio-edita/:id',
                        name: 'tiposervicio-edita',
                        component: () => import(/* webpackChunkName: "tiposervicioedita" */ "@/modules/taller/catalogos/tiposervicios/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Tipo de Servicio Editar"
                        }
                    },
                    {
                        path: 'tiposervicio-consulta/:id',
                        name: 'tiposervicio-consulta',
                        component: () => import(/* webpackChunkName: "tiposervicioconsulta" */ "@/modules/taller/catalogos/tiposervicios/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Tipo de Servicio Consulta"
                        }
                    },
                    {
                        path: 'tiposervicio-elimina/:id',
                        name: 'tiposervicio-elimina',
                        component: () => import(/* webpackChunkName: "tiposervicioelimina" */ "@/modules/taller/catalogos/tiposervicios/pages/EliminaPage.vue"),
                        meta: {
                            pageTitle: "Tipo de Servicio Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Técnico
            {
                path: "/modules/taller/catalogos/tecnicos",
                name: "tecnicos",
                component: () => import(/* webpackChunkName: "tecnicos" */ "@/modules/taller/catalogos/tecnico/layouts/TecnicoLayout.vue"),
                meta: {
                    pageTitle: "Tecnico",
                    breadcrumbs: ["Taller","Catalogos","Tecnicos"],
                    codigo: '018'
                },
                redirect: { name: 'tecnicoslist'},
                children:[
                    {
                        path: 'tecnicoslist',
                        name: 'tecnicoslist',
                        component: () => import(/* webpackChunkName: "tecnicoslist" */ "@/modules/taller/catalogos/tecnico/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Tecnicos",
                        }
                    },
                    {
                        path: 'tecnico-nuevo/',
                        name: 'tecnico-nuevo',
                        component: () => import(/* webpackChunkName: "tecniconuevo" */ "@/modules/taller/catalogos/tecnico/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Técnico Nuevo"
                        }
                    },
                    {
                        path: 'tecnico-edita/:id',
                        name: 'tecnico-edita',
                        component: () => import(/* webpackChunkName: "tecnicoedita" */ "@/modules/taller/catalogos/tecnico/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Técnico Editar"
                        }
                    },
                    {
                        path: 'tecnico-consulta/:id',
                        name: 'tecnico-consulta',
                        component: () => import(/* webpackChunkName: "tecnicoconsulta" */ "@/modules/taller/catalogos/tecnico/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Técnico Consulta"
                        }
                    },
                    {
                        path: 'tecnico-elimina/:id',
                        name: 'tecnico-elimina',
                        component: () => import(/* webpackChunkName: "tecnicoelimina" */ "@/modules/taller/catalogos/tecnico/pages/EliminaPage.vue"),
                        meta: {
                            pageTitle: "Técnico Elimina"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Trabajo
            {
                path: "/modules/taller/catalogos/trabajos",
                name: "trabajos",
                component: () => import(/* webpackChunkName: "trabajos" */ "@/modules/taller/catalogos/trabajos/layouts/TrabajoLayout.vue"),
                meta: {
                    pageTitle: "Trabajo",
                    breadcrumbs: ["Taller","Catalogos","Trabajos"],
                    codigo: '020'
                },
                redirect: { name: 'trabajoslist'},
                children:[
                    {
                        path: 'trabajoslist',
                        name: 'trabajoslist',
                        component: () => import(/* webpackChunkName: "trabajoslist" */ "@/modules/taller/catalogos/trabajos/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Trabajos",
                        }
                    },
                    {
                        path: 'trabajo-nuevo/',
                        name: 'trabajo-nuevo',
                        component: () => import(/* webpackChunkName: "trabajonuevo" */ "@/modules/taller/catalogos/trabajos/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Trabajo Nuevo"
                        }
                    },
                    {
                        path: 'trabajo-edita/:id',
                        name: 'trabajo-edita',
                        component: () => import(/* webpackChunkName: "trabajoedita" */ "@/modules/taller/catalogos/trabajos/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Trabajo Editar"
                        }
                    },
                    {
                        path: 'trabajo-consulta/:id',
                        name: 'trabajo-consulta',
                        component: () => import(/* webpackChunkName: "trabajoconsulta" */ "@/modules/taller/catalogos/trabajos/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Trabajo Consulta"
                        }
                    },
                ]
            },
            // Menú Taller-Catalogos Unidad
            {
                path: "/modules/taller/catalogos/unidad",
                name: "unidad",
                component: () => import(/* webpackChunkName: "unidad" */ "@/modules/taller/catalogos/unidad/layouts/UnidadLayout.vue"),
                meta: {
                    pageTitle: "Unidad",
                    breadcrumbs: ["Taller","Catalogos","Unidades"],
                    codigo: '019'
                },
                redirect: { name: 'unidadlist'},
                children:[
                    {
                        path: 'unidadlist',
                        name: 'unidadlist',
                        component: () => import(/* webpackChunkName: "unidadlist" */ "@/modules/taller/catalogos/unidad/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Unidades",
                        }
                    },
                    {
                        path: 'unidad-nuevo/',
                        name: 'unidad-nuevo',
                        component: () => import(/* webpackChunkName: "unidadnuevo" */ "@/modules/taller/catalogos/unidad/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Unidad Nueva"
                        }
                    },
                    {
                        path: 'unidad-edita/:id',
                        name: 'unidad-edita',
                        component: () => import(/* webpackChunkName: "unidadedita" */ "@/modules/taller/catalogos/unidad/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Unidad Editar"
                        }
                    },
                    {
                        path: 'unidad-consulta/:id',
                        name: 'unidad-consulta',
                        component: () => import(/* webpackChunkName: "unidadconsulta" */ "@/modules/taller/catalogos/unidad/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Unidad Consulta"
                        }
                    },
                    {
                        path: 'unidad-elimina/:id',
                        name: 'unidad-elimina',
                        component: () => import(/* webpackChunkName: "unidadelimina" */ "@/modules/taller/catalogos/unidad/pages/EliminaPage.vue"),
                        meta: {
                            pageTitle: "Unidad Elimina"
                        }
                    },
                ]
            },
            // Menú Administración-Catalogos Propietarios
            {
                path: "/modules/administracion/catalogos/propietario",
                name: "propietario",
                component: () => import(/* webpackChunkName: "propietario" */ "@/modules/administracion/catalogos/propietario/layouts/PropietarioLayout.vue"),
                meta: {
                    pageTitle: "Emisores",
                    breadcrumbs: ["Administración","Catalogos","Emisores"],
                    codigo: '040'
                },
                redirect: { name: 'propietariolist'},
                children:[
                    {
                        path: 'propietariolist',
                        name: 'propietariolist',
                        component: () => import(/* webpackChunkName: "propietariolist" */ "@/modules/administracion/catalogos/propietario/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Emisores",
                        }
                    },
                    {
                        path: 'propietario-nuevo/',
                        name: 'propietario-nuevo',
                        component: () => import(/* webpackChunkName: "propietarionuevo" */ "@/modules/administracion/catalogos/propietario/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Emisor Nuevo"
                        }
                    },
                    {
                        path: 'propietario-consulta/:id',
                        name: 'propietario-consulta',
                        component: () => import(/* webpackChunkName: "propietarioconsulta" */ "@/modules/administracion/catalogos/propietario/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Emisor Consulta"
                        }
                    },
                    {
                        path: 'propietario-edita/:id',
                        name: 'propietario-edita',
                        component: () => import(/* webpackChunkName: "propietarioedita" */ "@/modules/administracion/catalogos/propietario/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Emisor Editar"
                        }
                    },
                ]
            },
            // Menú Administración-Catalogos Agentes
            {
                path: "/modules/administracion/catalogos/agente",
                name: "agente",
                component: () => import(/* webpackChunkName: "agente" */ "@/modules/administracion/catalogos/agente/layouts/AgenteLayout.vue"),
                meta: {
                    pageTitle: "Agentes",
                    breadcrumbs: ["Administración","Catalogos","Agentes"],
                    codigo: '049'
                },
                redirect: { name: 'agentelist'},
                children:[
                    {
                        path: 'agentelist',
                        name: 'agentelist',
                        component: () => import(/* webpackChunkName: "agentelist" */ "@/modules/administracion/catalogos/agente/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Agentes",
                        }
                    },
                    {
                        path: 'agente-nuevo/',
                        name: 'agente-nuevo',
                        component: () => import(/* webpackChunkName: "agentenuevo" */ "@/modules/administracion/catalogos/agente/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Agente Nuevo"
                        }
                    },
                    {
                        path: 'agente-consulta/:id',
                        name: 'agente-consulta',
                        component: () => import(/* webpackChunkName: "agenteconsulta" */ "@/modules/administracion/catalogos/agente/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Agente Consulta"
                        }
                    },
                    {
                        path: 'agente-edita/:id',
                        name: 'agente-edita',
                        component: () => import(/* webpackChunkName: "agenteedita" */ "@/modules/administracion/catalogos/agente/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "agente Editar"
                        }
                    },
                ]
            },
            // Menú Administración-Catalogos Cliente
            {
                path: "/modules/administracion/catalogos/clientes",
                name: "clientes",
                component: () => import(/* webpackChunkName: "cliente" */ "@/modules/administracion/catalogos/clientes/layouts/ClienteLayout.vue"),
                meta: {
                    pageTitle: "Clientes",
                    breadcrumbs: ["Administración","Catalogos","Clientes"],
                    codigo: '040'
                },
                redirect: { name: 'clientelist'},
                children:[
                    {
                        path: 'clientelist',
                        name: 'clientelist',
                        component: () => import(/* webpackChunkName: "clientelist" */ "@/modules/administracion/catalogos/clientes/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Clientes",
                        }
                    },
                    {
                        path: 'cliente-nuevo/',
                        name: 'cliente-nuevo',
                        component: () => import(/* webpackChunkName: "clientenuevo" */ "@/modules/administracion/catalogos/clientes/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Cliente Nuevo"
                        }
                    },
                    {
                        path: 'cliente-consulta/:id',
                        name: 'cliente-consulta',
                        component: () => import(/* webpackChunkName: "clienteconsulta" */ "@/modules/administracion/catalogos/clientes/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Cliente Consulta"
                        }
                    },
                    {
                        path: 'cliente-edita/:id',
                        name: 'cliente-edita',
                        component: () => import(/* webpackChunkName: "clienteedita" */ "@/modules/administracion/catalogos/clientes/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Cliente Editar"
                        }
                    },
                ]
            },
            // Menú Administración-Catalogos Unidad Medida
            {
                path: "/modules/administracion/catalogos/unidadmedida",
                name: "unidadmedida",
                component: () => import(/* webpackChunkName: "unidadmedida" */ "@/modules/administracion/catalogos/unidadmedida/layouts/UnidadMedidaLayout.vue"),
                meta: {
                    pageTitle: "Unidades de Medida",
                    breadcrumbs: ["Administración","Catalogos","Unidades de Medida"],
                    codigo: '042'
                },
                redirect: { name: 'unidadmedidalist'},
                children:[
                    {
                        path: 'unidadmedidalist',
                        name: 'unidadmedidalist',
                        component: () => import(/* webpackChunkName: "unidadmedidalist" */ "@/modules/administracion/catalogos/unidadmedida/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Unidades de Medida",
                        }
                    },
                    {
                        path: 'unidadmedida-nuevo/',
                        name: 'unidadmedida-nuevo',
                        component: () => import(/* webpackChunkName: "unidadmedidanuevo" */ "@/modules/administracion/catalogos/unidadmedida/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Unidades de Medida Nuevo"
                        }
                    },
                    {
                        path: 'unidadmedida-consulta/:id',
                        name: 'unidadmedida-consulta',
                        component: () => import(/* webpackChunkName: "unidadmedidaconsulta" */ "@/modules/administracion/catalogos/unidadmedida/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Unidades de Medida Consulta"
                        }
                    },
                    {
                        path: 'unidadmedida-edita/:id',
                        name: 'unidadmedida-edita',
                        component: () => import(/* webpackChunkName: "unidadmedidaedita" */ "@/modules/administracion/catalogos/unidadmedida/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Unidades de Medida Editar"
                        }
                    },
                ]
            },
            // Menú Administración-Modulos Factura
            {
                path: "/modules/administracion/modulos/factura",
                name: "factura",
                component: () => import(/* webpackChunkName: "factura" */ "@/modules/administracion/modulos/factura/layouts/FacturaLayout.vue"),
                meta: {
                    pageTitle: "Factura",
                    breadcrumbs: ["Administración","Modulos","Factura"],
                    codigo: '047'
                },
                redirect: { name: 'facturalist'},
                children:[
                    {
                        path: 'facturalist',
                        name: 'facturalist',
                        component: () => import(/* webpackChunkName: "facturalist" */ "@/modules/administracion/modulos/factura/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Factura",
                        }
                    },
                    {
                        path: 'factura-nuevo/',
                        name: 'factura-nuevo',
                        component: () => import(/* webpackChunkName: "facturanuevo" */ "@/modules/administracion/modulos/factura/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Factura Nueva"
                        }
                    },
                    {
                        path: 'factura-consulta/:id',
                        name: 'factura-consulta',
                        component: () => import(/* webpackChunkName: "facturaconsulta" */ "@/modules/administracion/modulos/factura/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Factura Consulta"
                        }
                    },
                    {
                        path: 'factura-edita/:id',
                        name: 'factura-edita',
                        component: () => import(/* webpackChunkName: "facturaedita" */ "@/modules/administracion/modulos/factura/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Factura Editar"
                        }
                    },
                ]
            },
            // Menú Almacén-Catalogos Tipo Inventario
            {
                path: "/modules/almacen/catalogos/tipoinventario",
                name: "tipoinventario",
                component: () => import(/* webpackChunkName: "tipoinventario" */ "@/modules/almacen/catalogos/tipoinventario/layouts/TipoInventarioLayout.vue"),
                meta: {
                    pageTitle: "Tipo de Inventario",
                    breadcrumbs: ["Almacén","Catalogos","Tipo de Inventario"],
                    codigo: '042'
                },
                redirect: { name: 'tipoinventariolist'},
                children:[
                    {
                        path: 'tipoinventariolist',
                        name: 'tipoinventariolist',
                        component: () => import(/* webpackChunkName: "tipoinventariolist" */ "@/modules/almacen/catalogos/tipoinventario/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Tipo de Inventario",
                        }
                    },
                    {
                        path: 'tipoinventario-nuevo/',
                        name: 'tipoinventario-nuevo',
                        component: () => import(/* webpackChunkName: "tipoinventarionuevo" */ "@/modules/almacen/catalogos/tipoinventario/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Tipo de Inventario Nuevo"
                        }
                    },
                    {
                        path: 'tipoinventario-consulta/:id',
                        name: 'tipoinventario-consulta',
                        component: () => import(/* webpackChunkName: "tipoinventarioconsulta" */ "@/modules/almacen/catalogos/tipoinventario/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Tipo de Inventario Consulta"
                        }
                    },
                    {
                        path: 'tipoinventario-edita/:id',
                        name: 'tipoinventario-edita',
                        component: () => import(/* webpackChunkName: "tipoinventarioedita" */ "@/modules/almacen/catalogos/tipoinventario/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Tipo de Inventario Editar"
                        }
                    },
                ]
            },
            // Menú Almacén-Catalogos Almacenes
            {
                path: "/modules/almacen/catalogos/almacen",
                name: "almacen",
                component: () => import(/* webpackChunkName: "almacen" */ "@/modules/almacen/catalogos/almacen/layouts/AlmacenLayout.vue"),
                meta: {
                    pageTitle: "Almacén",
                    breadcrumbs: ["Almacén","Catalogos","Almacén"],
                    codigo: '042'
                },
                redirect: { name: 'almacenlist'},
                children:[
                    {
                        path: 'almacenlist',
                        name: 'almacenlist',
                        component: () => import(/* webpackChunkName: "almacenlist" */ "@/modules/almacen/catalogos/almacen/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Almacén",
                        }
                    },
                    {
                        path: 'almacen-nuevo/',
                        name: 'almacen-nuevo',
                        component: () => import(/* webpackChunkName: "almacennuevo" */ "@/modules/almacen/catalogos/almacen/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Almacen"
                        }
                    },
                    {
                        path: 'almacen-consulta/:id',
                        name: 'almacen-consulta',
                        component: () => import(/* webpackChunkName: "almacenconsulta" */ "@/modules/almacen/catalogos/almacen/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Almacén"
                        }
                    },
                    {
                        path: 'almacen-edita/:id',
                        name: 'almacen-edita',
                        component: () => import(/* webpackChunkName: "almacenedita" */ "@/modules/almacen/catalogos/almacen/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Almacén"
                        }
                    },
                ]
            },
            // Menú Almacén-Catalogos Producto
            {
                path: "/modules/almacen/catalogos/producto",
                name: "producto",
                component: () => import(/* webpackChunkName: "producto" */ "@/modules/almacen/catalogos/producto/layouts/ProductoLayout.vue"),
                meta: {
                    pageTitle: "Producto",
                    breadcrumbs: ["Almacén","Catalogos","Producto"],
                    codigo: '044'
                },
                redirect: { name: 'productolist'},
                children:[
                    {
                        path: 'productolist',
                        name: 'productolist',
                        component: () => import(/* webpackChunkName: "productolist" */ "@/modules/almacen/catalogos/producto/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Producto",
                        }
                    },
                    {
                        path: 'producto-nuevo/',
                        name: 'producto-nuevo',
                        component: () => import(/* webpackChunkName: "productonuevo" */ "@/modules/almacen/catalogos/producto/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Producto Nuevo"
                        }
                    },
                    {
                        path: 'producto-consulta/:id',
                        name: 'producto-consulta',
                        component: () => import(/* webpackChunkName: "productoconsulta" */ "@/modules/almacen/catalogos/producto/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Producto Consulta"
                        }
                    },
                    {
                        path: 'producto-edita/:id',
                        name: 'producto-edita',
                        component: () => import(/* webpackChunkName: "productoedita" */ "@/modules/almacen/catalogos/producto/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Producto Editar"
                        }
                    },
                ]
            },
            // Menú Taller-Modulos Orden
            {
                path: "/modules/taller/modulos/orden",
                name: "orden",
                component: () => import(/* webpackChunkName: "orden" */ "@/modules/taller/modulos/orden/layouts/OrdenLayout.vue"),
                meta: {
                    pageTitle: "Orden de Servicio",
                    breadcrumbs: ["Taller","Modulos","Orden"],
                    codigo: '023'
                },
                redirect: { name: 'ordenlist'},
                children:[
                    {
                        path: 'ordenlist',
                        name: 'ordenlist',
                        component: () => import(/* webpackChunkName: "ordenlist" */ "@/modules/taller/modulos/orden/pages/ListPage.vue"),
                        meta: {
                            pageTitle: "Orden",
                        }
                    },
                    {
                        path: 'orden-nuevo/',
                        name: 'orden-nuevo',
                        component: () => import(/* webpackChunkName: "ordennuevo" */ "@/modules/taller/modulos/orden/pages/NuevoPage.vue"),
                        meta: {
                            pageTitle: "Orden Nueva"
                        }
                    },
                    {
                        path: 'orden-consulta/:id',
                        name: 'orden-consulta',
                        component: () => import(/* webpackChunkName: "ordenconsulta" */ "@/modules/taller/modulos/orden/pages/ConsultaPage.vue"),
                        meta: {
                            pageTitle: "Orden Consulta"
                        }
                    },
                    {
                        path: 'orden-edita/:id',
                        name: 'orden-edita',
                        component: () => import(/* webpackChunkName: "ordenedita" */ "@/modules/taller/modulos/orden/pages/EditaPage.vue"),
                        meta: {
                            pageTitle: "Orden Editar"
                        }
                    },
                ]
            },
            // Menú Talle-Modulos Iniciar/Terminar Trabajos
            {
                path: '/modules/taller/modulos/iniciarterminar',
                name: 'iniciarterminar',
                component: () => import (/* webpackChunkName: "iniciarterminar" */ "@/modules/taller/modulos/iniciarterminar/layouts/IniciarTerminarLayouts.vue"),
                meta: {
                    pageTitle: "Iniciar/Pausar/Terminar Trabajos",
                    breadcrumbs: ["Taller","Modulos","Iniciar/Pausar/Terminar"],
                    codigo: '046'
                },
                redirect: { name: 'iniciarterminarindex'},
                children: [
                    {
                        path: 'iniciarterminarindex',
                        name: 'iniciarterminarindex',
                        component: () => import(/* webpackChunkName: "iniciarterminarindex" */ "@/modules/taller/modulos/iniciarterminar/pages/IndexPage.vue" ),
                        meta: {
                            pageTitle: "Iniciar/Pausar/Terminar Trabajos",
                        }
                    }
                ]
            }
        ],
    },
    {
        path: "/",
        component: () => import("@/layouts/AuthLayout.vue"),
            children: [
            {
                path: "/sign-in",
                name: "sign-in",
                component: () => import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
                meta: {
                    pageTitle: "Entrar",
                },
            },
            {
                path: "/sign-up",
                name: "sign-up",
                component: () => import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
                meta: {
                    pageTitle: "Registrar",
                },
            },
            {
                path: "/password-reset",
                name: "password-reset",
                component: () => import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
                meta: {
                    pageTitle: "Password reset",
                },
            },
        ],
    },
    {
        path: "/",
        component: () => import("@/layouts/SystemLayout.vue"),
        children: [
            {
                // the 404 route, when none of the above matches
                path: "/404",
                name: "404",
                component: () => import("@/views/crafted/authentication/Error404.vue"),
                meta: {
                    pageTitle: "Error 404",
                },
            },
            {
                path: "/500",
                name: "500",
                component: () => import("@/views/crafted/authentication/Error500.vue"),
                meta: {
                    pageTitle: "Error 500",
                },
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/404",
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to) {
        // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll to the top of the page.
        if (to.hash) {
        return {
            el: to.hash,
            top: 80,
            behavior: "smooth",
        };
        } else {
        return {
            top: 0,
            left: 0,
            behavior: "smooth",
        };
        }
    },
});

router.beforeEach((to, from, next) => {
    isLoading.value = true;
    const authStore = useAuthStore();
    const configStore = useConfigStore();

    // current page view title
    document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

    // reset config to initial state
    configStore.resetLayoutConfig();

    // verify auth token before each page change
    // authStore.verifyAuth();

    // before page access check if page requires authentication
    if (to.meta.middleware == "auth") {
        //@ts-ignore
        // NProgress.configure({ showSpinner: false });
        //@ts-ignore
        // NProgress.start();
        //@ts-ignore
        // NProgress.set(0.4);
        
        if (authStore.isAuthenticated) next();
        else  next({ name: "sign-in" });
    } else {
        next();
    }
});

router.afterEach(async (to,from) => {
    const authStore = useAuthStore();
    //@ts-ignore
    // NProgress.done();
    isLoading.value = false;
    if (authStore.isAuthenticated) {
        if (to.meta.codigo) {
            const data = {
                usuario_id: authStore.user.id,
                codigo:     to.meta.codigo,
            }
            try {
                await ApiService.post('Configuracion/ModuloFavorito',data);    
            } catch (error) {
                console.log('Error al actualizar favorito');
            }
            
        } else {
            console.log('No tiene codigo');
        }
    }
    
})

export default router;
