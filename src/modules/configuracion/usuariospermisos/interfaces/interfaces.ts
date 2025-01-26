export interface Registro {
    id:                         number;
    rol_id:                     number;
    departamento_id:            number;
    rol:                        string;
    departamento:               string;
    sucursal:                   string;
    usuario:                    string;
    nombre:                     string;
}

export interface Modulo {
    id:     number;
    nombre: string;
    codigo: string;
    uso:    string;
}

export interface Usuario {
    id:                         number;
    rol_id:                     number;
    departamento_id:            number;
    rol:                        string,
    departamento:               string,
    sucursal:                   string,
    usuario:                    string,
    nombre:                     string,    
}

export interface PermisoAsigando {
    usuario:    string,
    seccion:    string,
    subseccion: string,
    modulo:     string,
    permiso:    string,
    modulo_id:  number,
    permiso_id: number,
}

interface PermissionStatus {
    checked: boolean;
    partialChecked: boolean;
}

export interface PermissionsMap {
    [key: string]: PermissionStatus;
}

export interface TreeNode {
    key:            string;
    label:          string;
    data:           string;
    icon:           string;
    expandedIcon?:  string;
    collapsedIcon?: string;
    type?:          string;
    children?:      TreeNode[];
}