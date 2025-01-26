export interface Trabajo {
    id:                 number;
    descripcion:        string;
    division_id:        number;
    horasestandar:      number;
    ficha_tecnica:      string;
    talle_division?:    talle_division;
    activo:             boolean;
}

interface talle_division {
    division:  string
}