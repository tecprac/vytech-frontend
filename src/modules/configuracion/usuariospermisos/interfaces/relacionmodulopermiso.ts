export interface RelacionModuloPermiso {
    id:             number;
    modulo_id:      number;
    permiso_id:     number;
    conf_modulo:    conf_modulo;
    conf_permiso:   conf_permiso;
    activo:         boolean;
}

interface conf_modulo {
    uso:    string;
    modulo: string;
    codigo: string;
}

interface conf_permiso {
    permiso: string;
}