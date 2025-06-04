import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
    {
        pages: [
            {
                heading:    "dashboard",
                route:      "/dashboard",
                keenthemesIcon: "element-11",
                bootstrapIcon: "bi-app-indicator",
            },
        ],
    },
    // DIVISOR MENÚ PRINCIPAL
    {
        heading:    "mainmenu",
        route:      "/",
    },
    // Sección Configuración
    {
        pages: [
            {
                sectionTitle: 'settings',
                route:          '/configuracion',
                keenthemesIcon: "setting-2",
                bootstrapIcon: "bi-app-indicator",
                seccion: 'CONFIGURACION',
                sub: [
                    {
                        heading:    'Parametros',
                        route:      '/modules/configuracion/parametros',
                        codigo:     '001'
                    },
                    {
                        heading:    'Roles',
                        route:      '/modules/configuracion/roles',
                        codigo:     '002',
                    },
                    {
                        heading:    'Departamentos',
                        route:      '/modules/configuracion/departamentos',
                        codigo:     '003',
                    },
                    {
                        heading:    'Permisos',
                        route:      '/modules/configuracion/permisos',
                        codigo:     '004',
                    },
                    {
                        heading:    'Módulos',
                        route:      '/modules/configuracion/modulos',
                        codigo:     '005',
                    },
                    {
                        heading:    'Módulos-Permisos',
                        route:      '/modules/configuracion/modulospermisos',
                        codigo:     '006',
                    },
                    {
                        heading:    'Usuarios',
                        route:      '/modules/configuracion/usuarios',
                        codigo:     '007',
                    },
                    {
                        heading:    'Usuarios-Permisos',
                        route:      '/modules/configuracion/usuariospermisos',
                        codigo:     '008',
                    },
                    {
                        heading:    'Folio Documento',
                        route:      '/modules/configuracion/folioDocumento',
                        codigo:     '041',
                    },
                ]
            }
        ]
    },
    
    // Sección Almacén
    {
        pages: [
            {
                sectionTitle:   "store",
                route:          "/almacen",
                keenthemesIcon: "parcel",
                bootstrapIcon:  "bi-app-indicator",
                seccion:        "ALMACEN",
                sub:[
                    {
                        sectionTitle: "catalogs",
                        route:      "/almacen/catalogos",
                        keenthemesIcon: "parcel",
                        bootstrapIcon:  "bi-app-indicator",
                        seccion:    "ALMACEN",
                        subseccion: "CATALOGOS",
                        sub: [
                            {
                                heading:    'Almacén',
                                route:      '/modules/almacen/catalogos/almacen',
                                codigo:     '050',
                            },
                            {
                                heading:    'Tipo Inventario',
                                route:      '/modules/almacen/catalogos/tipoinventario',
                                codigo:     '043',
                            },
                            {
                                heading:    'Producto',
                                route:      '/modules/almacen/catalogos/producto',
                                codigo:     '044',
                            },
                        ]
                    },
                    {
                        sectionTitle: "modules",
                        route:      "/almacen/modulos",
                        pages:[]
                    },
                    {
                        sectionTitle: "reports",
                        route:      "/almacen/reportes",
                        pages:[]
                    },
                ],
            }
        ]
    },
    // Sección Taller
    {
        pages: [
            {
                sectionTitle:   "workshop",
                route:          "/taller",
                keenthemesIcon: "truck",
                bootstrapIcon:  "bi-app-indicator",
                seccion:        "TALLER",
                sub:[
                    {
                        sectionTitle:   "catalogs",
                        route:          "/taller/catalogos",
                        seccion:        "TALLER",
                        subseccion:     "CATALOGOS",
                        sub:[
                                {
                                    heading:    'Motivos',
                                    route:      '/modules/taller/catalogos/motivos',
                                    codigo:     '051',
                                },
                                {
                                    heading:    'Marcas',
                                    route:      '/modules/taller/catalogos/marcas',
                                    codigo:     '009',
                                },
                                {
                                    heading:    'Modelos',
                                    route:      '/modules/taller/catalogos/modelos',
                                    codigo:     '010',
                                },
                                {
                                    heading:    'Motores',
                                    route:      '/modules/taller/catalogos/motores',
                                    codigo:     '011',
                                },
                                {
                                    heading:    'Transmisiones',
                                    route:      '/modules/taller/catalogos/transmisiones',
                                    codigo:     '012',
                                },
                                {
                                    heading:    'Componentes',
                                    route:      '/modules/taller/catalogos/componentes',
                                    codigo:     '014',
                                },
                                {
                                    heading:    'Tipo Unidad',
                                    route:      '/modules/taller/catalogos/tipounidad',
                                    codigo:     '013',
                                },
                                {
                                    heading:    'Tipo Servicio',
                                    route:      '/modules/taller/catalogos/tiposervicios',
                                    codigo:     '015',
                                },
                                {
                                    heading:    'División',
                                    route:      '/modules/taller/catalogos/divisiones',
                                    codigo:     '016',
                                },
                                {
                                    heading:    'Bahias',
                                    route:      '/modules/taller/catalogos/bahias',
                                    codigo:     '017',
                                },
                                {
                                    heading:    'Tecnicos',
                                    route:      '/modules/taller/catalogos/tecnicos',
                                    codigo:     '018',
                                },
                                {
                                    heading:    'Unidades',
                                    route:      '/modules/taller/catalogos/unidad',
                                    codigo:     '019',
                                },
                                {
                                    heading:    'Trabajos',
                                    route:      '/modules/taller/catalogos/trabajos',
                                    codigo:     '020',
                                },
                                {
                                    heading:    'Mantenimientos',
                                    route:      '/modules/taller/catalogos/mantenimientos',
                                    codigo:     '021',
                                },
                        ]
                    },
                    {
                        sectionTitle:   "modules",
                        route:          "/taller/modulos",
                        seccion:        "TALLER",
                        subseccion:     "MODULOS",
                        sub:[
                            {
                                heading:    'Cotizaciones',
                                route:      '/modules/taller/modulos/cotizaciones',
                                codigo:     '022',
                            },
                            {
                                heading:    'Orden de Servcio',
                                route:      '/modules/taller/modulos/orden',
                                codigo:     '023',
                            },
                            {
                                heading:    'Iniciar/Terminar Trabajos',
                                route:      '/modules/taller/modulos/iniciarterminar',
                                codigo:     '046',
                            },
                            {
                                heading:    'Bitacora de Unidad',
                                route:      '/modules/taller/modulos/bitacora',
                                codigo:     '024',
                            },
                        ]
                    },
                    {
                        sectionTitle:   "reports",
                        route:          "/taller/reportes",
                        seccion:        "TALLER",
                        subseccion:     "REPORTES",
                        sub:[
                            {
                                sectionTitle:   "catalogs",
                                route:          "/modules/taller/reportes/catalogos",
                                seccion:        "TALLER",
                                subseccion:     "REPORTES",
                                sub:[
                                    {
                                        heading:    'Marcas',
                                        route:      '/modules/reportes/catalogos/marcas',
                                        codigo:     '025',
                                    },
                                    {
                                        heading:    'Modelos',
                                        route:      '/modules/reportes/catalogos/modelos',
                                        codigo:     '026',
                                    },
                                    {
                                        heading:    'Motores',
                                        route:      '/modules/reportes/catalogos/motores',
                                        codigo:     '027',
                                    },
                                    {
                                        heading:    'Transmisiones',
                                        route:      '/modules/reportes/catalogos/transmisiones',
                                        codigo:     '028',
                                    },
                                    {
                                        heading:    'Tipo Unidad',
                                        route:      '/modules/reportes/catalogos/tipounidad',
                                        codigo:     '029',
                                    },
                                    {
                                        heading:    'Componentes',
                                        route:      '/modules/reportes/catalogos/componentes',
                                        codigo:     '030',
                                    },
                                    {
                                        heading:    'Tipo Servcio',
                                        route:      '/modules/reportes/catalogos/tiposervicio',
                                        codigo:     '031',
                                    },
                                    {
                                        heading:    'Divisiones',
                                        route:      '/modules/reportes/catalogos/divisiones',
                                        codigo:     '032',
                                    },
                                    {
                                        heading:    'Bahias',
                                        route:      '/modules/reportes/catalogos/bahias',
                                        codigo:     '033',
                                    },
                                    {
                                        heading:    'Tecnicos',
                                        route:      '/modules/reportes/catalogos/tecnicos',
                                        codigo:     '034',
                                    },
                                    {
                                        heading:    'Unidades',
                                        route:      '/modules/reportes/catalogos/unidades',
                                        codigo:     '035',
                                    },
                                    {
                                        heading:    'Trabajos',
                                        route:      '/modules/reportes/catalogos/trabajos',
                                        codigo:     '036',
                                    },
                                    {
                                        heading:    'Mantenimientos',
                                        route:      '/modules/reportes/catalogos/mantenimientos',
                                        codigo:     '037',
                                    },
                                ]
                            },
                            {
                                heading:    'Cotizaciones',
                                route:      '/modules/taller/reportes/cotizaciones',
                                codigo:     '038',
                            },
                            {
                                heading:    'Ordenes de Servicio',
                                route:      '/modules/taller/reportes/ordenes',
                                codigo:     '039',
                            },
                        ]
                    },
                ],
                
                    
                
            }
        ]
    },
    // Sección Administración
    {
        pages: [
            {
                sectionTitle:   "administration",
                route:          "/administracion",
                keenthemesIcon: "graph-up",
                bootstrapIcon:  "bi-app-indicator",
                seccion:        "ADMINISTRACION",
                sub:[
                    {
                        sectionTitle: "catalogs",
                        route:      "/administracion/catalogos",
                        seccion:    "ADMINISTRACION",
                        subseccion: "CATALOGOS",
                        sub:[
                                {
                                    heading:    'Unidades de Peso y Medida',
                                    route:      '/modules/administracion/catalogos/unidadmedida',
                                    codigo:     '042',
                                },
                                {
                                    heading:    'Emisores',
                                    route:      '/modules/administracion/catalogos/propietario',
                                    codigo:     '048',
                                },
                                {
                                    heading:    'Agentes',
                                    route:      '/modules/administracion/catalogos/agente',
                                    codigo:     '049',
                                },
                                {
                                    heading:    'Clientes',
                                    route:      '/modules/administracion/catalogos/clientes',
                                    codigo:     '040',
                                }
                        ]
                        
                    },
                    {
                        sectionTitle: "modules",
                        route:      "/administracion/modulos",
                        seccion:    "ADMINISTRACION",
                        subseccion: "MODULOS",
                        sub:[
                                {
                                    heading:    'Factura',
                                    route:      '/modules/administracion/modulos/factura',
                                    codigo:     '047',
                                },
                                {
                                    heading:    'Pago',
                                    route:      '/modules/administracion/modulos/pago',
                                    codigo:     '052',
                                },
                        ]
                    },
                    {
                        sectionTitle: "reports",
                        route:      "/administracion/reportes",
                        seccion:    "ADMINISTRACION",
                        subseccion: "REPORTES",
                        sub:[]
                    },
                ],
            }
        ]
    },

];

export default MainMenuConfig;
