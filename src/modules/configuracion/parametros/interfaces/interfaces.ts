export interface Version {
    id_registro:            number,
    plataforma:             string,
    version_actual:         string,
    version_anterior:       string,
    fecha_actualizacion:    string,
    observaciones:          string,
}

export interface Parametro {
    id:             number;
    grupo:          string;
    ambito:         string;
    tipodato:       string;
    nombre:         string;
    valor:          string;
    descripcion:    string;
}

export interface Grupo {
    id:     number,
    grupo:  string,
    count:  number,
}