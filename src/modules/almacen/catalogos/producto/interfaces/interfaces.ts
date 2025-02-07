export interface Producto {
    id:                     number;
    codigo:                 string;
    codigo_alterno:         string;
    codigo_barras:          string;
    descripcion:            string;
    ficha_tecnica:          string;
    metodo_costeo:          string;
    tipo_inventario_id:     number;
    marca_id:               number;
    unidad_medida_id:       number;
    costo_reposicion:       number;
    ultimo_costo:           number;
    margen_utilidad:        number;
    precio:                 number;
    fecha_ultimacompra:     Date | null;
    estatus:                string;
    inventariable:          boolean;
    descvariable:           boolean;
    claveprodserv_id:       number;
    claveunidad_id:         number;
    clase:                  string;
    objetoimpuesto_id:      number;
    impiva:                 number;
    impiesps:               number;
    retencion_isr:          number;
    retencion_iva:          number;
    file_imagen:            string;
    file_pdf:               string;
    activo:                 boolean;
    talle_marca?:           talle_marca | null;
    inv_tipo_inventario?:   inv_tipo_inventario | null;
    adm_unidad_medida?:     adm_unidad_medida | null;
    sat_claveprodserv?:     sat_claveprodserv | null;
    sat_claveunidad?:       sat_claveunidad | null;
    sat_objetoimpuesto?:    sat_objetoimpuesto | null;
}

export interface Permisos {
    modulo: string,
    permiso: string,
}

interface talle_marca {
    marca: string
}

interface adm_unidad_medida {
    unidad_medida: string
}

interface inv_tipo_inventario {
    tipo_inventario: string
}


interface sat_claveprodserv {
    c_claveprodserv:    string,
    claveprodserv:      string,
}

interface sat_claveunidad {
    c_claveunidad:  string,
    claveunidad:    string,
}

interface sat_objetoimpuesto {
    c_objetoimp:    string,
    objetoimpuesto: string,
}