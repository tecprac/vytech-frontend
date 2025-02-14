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
    fallas_reportadas:      string | null;
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