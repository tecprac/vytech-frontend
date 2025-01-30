export interface Trabajo {
    id:                 number,
    descripcion:        string,
    division_id:        number,
    horasestandar:      number,
    ficha_tecnica:      string,
    codigo:             string,
    costo_reposicion:   number,
    margen_utilidad:    number,
    precio:             number,
    estatus:            string,
    descvariable:       boolean,
    claveprodserv_id:   number,
    claveunidad_id:     number,
    objetoimpuesto_id:  number,
    impiva:             number,
    impiesps:           number,
    retencion_isr:      number,
    retencion_iva:      number,
    talle_division?:    talle_division,
    sat_claveprodserv?: sat_claveprodserv,
    sat_claveunidad?:   sat_claveunidad,
    sat_objetoimpuesto?:sat_objetoimpuesto,
    activo:             boolean,
}

interface talle_division {
    division:  string
}

interface sat_claveprodserv {
    c_claveprodserv:    string,
    claveprodserv:      string
}

interface sat_claveunidad {
    c_claveunidad:  string,
    claveunidad:    string
}

interface sat_objetoimpuesto {
    c_objetoimp:    string,
    objetoimp:      string,
}

export interface Permisos {
    modulo: string,
    permiso: string,
}