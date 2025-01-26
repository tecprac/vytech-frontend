export interface Motor {
    id:             number;
    descripcion:    string;
    marca_id:       number;
    ficha_tecnica:  string;
    file_name?:     string;
    talle_marca?:   talle_marca;
    activo:         boolean;
}

interface talle_marca {
    marca:  string      
}