export interface Usuario {
    id:             number;
    usuario:        string;
    password:       string;
    nombre:         string;
    email:          string;
    telefono_movil: string;
    codigo_pais:    string;
    rol_id:         number;
    departamento_id:number;
    ultimo_acceso:  Date;
    ipacceso:       string;
    activo:         boolean;
    superusuario?:  boolean;
    rol?:           conf_rol;
    modulo?:        conf_departamento;
}

export interface conf_rol {
    rol:    string;
}

export interface conf_departamento {
    departamento: string;
}