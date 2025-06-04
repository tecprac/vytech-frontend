export interface Orden {
    id:                     number;
    fecha_alta:             Date;
    folio:                  number;
    fecha_cierre:           Date | null;
    serie:                  string;
    folio_documento_id:     number;
    cliente_id:             number;
    tecnico_id:             number;
    usuario_inicia_id:      number;
    usuario_cierra_id:      number | null;
    tipo_servicio_id:       number;
    mantenimiento_id:       number | null;
    unidad_id:              number;
    bahia_id:               number;
    kms:                    number;
    nivel_combustible:      number;
    otros_componentes:      string | null;
    fallas_reportadas:      string;
    falla_audio1:           string | null;
    falla_audio2:           string | null;
    costo_refacciones:      number;
    costo_miscelaneos:      number;
    costo_manoobra:         number;
    costo_otrostalleres:    number;
    estatus:                string;
    filepdf:                string | null;
    nota_proceso:           string | null;
    nota_cerrada:           string | null;
    nota_cancelada:         string | null;
    activo:                 boolean;
    conf_usuario?:          conf_usuario;
    adm_cliente?:           adm_cliente;
    talle_tecnico?:         talle_tecnico;
    talle_bahia?:           talle_bahia;
    talle_tipo_servicio?:   talle_tipo_servicio;
    talle_unidad?:          talle_unidad;
}

interface conf_usuario {
    usuario:    string
}

interface adm_cliente {
    tipo_persona:   string,
    rfc:            string,
    razon_social:   string,
    nombre:         string,
}

interface talle_tecnico {
    tecnico:    string
}

interface talle_bahia {
    bahia:  string
}

interface talle_tipo_servicio {
    tipo_servicio: string
}

interface talle_unidad{
    unidad:             string,
    num_motor:          string,
    num_serie:          string,
    placas:             string,
    anio:               number,
    color:              string,
    talle_marca:        talle_marca,
    talle_modelo:       talle_modelo,
    talle_tipo_unidad:  talle_tipo_unidad,
    talle_motor:        talle_motor,
} 

interface talle_marca {
    marca: string
}

interface talle_modelo {
    modelo: string
}

interface talle_tipo_unidad {
    tipo_unidad: string    
}

interface talle_motor {
    motor: string
}

export interface Orden_Trabajo {
    id:                 number;
    orden_id:           number;
    usuario_id:         number;
    fecha:              Date;
    trabajo_id:         number;
    descripcion:        string;
    tecnico_id:         number;
    estatus:            string;
    notas:              string;
    horas_estandar:     number;
    horas_acumuladas:   number;
    horas_facturadas:   number;
    importe:            number;
    activo:             boolean;
    talle_orden?:       talle_orden;
    conf_usuario?:      conf_usuario;
    talle_tecnico?:     talle_tecnico;
    talle_trabajo?:     talle_trabajo;
    talle_requisicion_detalles?: RequisicionDetalle[];
}

interface talle_orden {
    folio:  number,
    serie:  string,
}

interface conf_usuario {
    usuario:    string,
    nombre:     string,
}

interface talle_tecnico {
    tecnico:    string
}

interface talle_trabajo {
    trabajo:    string,
    horasestandard: number,
    codigo_trabajo: string,
    precio_trabajo: number,
    talle_division: talle_division,
}

interface talle_division {
    descripcion_division: string
}

export interface Orden_Miscelaneo {
    id:             number;
    orden_id:       number;
    usuario_id:     number;
    estatus:        string;
    fecha:          Date;
    descripcion:    string;
    cantidad:       number;
    costo:          number;
    importe:        number;
    usuario_id_cancela?: number | null;
    fecha_cancela?: Date | null;
    notas:          string;
    activo:         boolean;
    talle_orden?:   talle_orden;
    conf_usuario?:  conf_usuario;
}

export interface Requisicion {
    id:                         number;
    fecha_alta:                 Date;
    folio_documento_id:         number;
    folio:                      number;
    serie?:                     string;
    orden_id:                   number;
    usuario_id:                 number;
    estatus:                    string;
    usuario_autoriza_id?:       number | null;
    fecha_autorizacion?:        Date | null;
    subtotal:                   number;
    fecha_promesa?:             Date | null;
    observaciones?:             string | null;
    filepdf?:                   string | null;
    talle_requisicion_detalle?: RequisicionDetalle[];
}

export interface RequisicionDetalle {
    id:                 number;
    requisicion_id:     number;
    producto_id:        number;
    cantidad:           number;
    costo:              number;
    costo_total:        number;
    cantidad_surtida:   number;
    cantidad_pendiente: number;
    cantidad_cancelada: number;
    observaciones:      string;
    descripcion:        string;
    codigo:             string;
    trabajo_id:         number;
    inv_producto?:      Producto;
    talle_requisicion?: Requisicion;
}

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
    fecha_ultimacompra?:    Date;
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
}

export interface TrabajoBitacora {
    id:                 number;
    usuario_id:         number;
    orden_trabajo_id:   number;
    tecnico_id:         number;
    fecha_inicio:       Date;
    fecha_fin?:         Date | null;
    comentarios:        string;
    estatus:            string;
    talle_tecnico?:     talle_tecnico;
}

interface talle_tecnico {
    id:         number,
    nombre:     string,
    apaterno:   string,
    amaterno:   string,
}