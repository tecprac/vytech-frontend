export interface Permiso {
    id:     number;
    data:   string;
}

export interface Modulo {
    id:         number;
    data:       string;
    seccion:    string;
    subseccion: string;
}

export interface Registro {
    idModulo: number;
    idPermiso: number;
}

export interface ModuloPermiso {
    id:     number;
    data:   string;
}