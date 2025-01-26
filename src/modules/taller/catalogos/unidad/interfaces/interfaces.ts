export interface Unidad {
    id:                 number;
    numeroeco:          string;
    marca_id:           number;
    modelo_id:          number;
    tipo_unidad_id:     number;
    fecha_compra:       Date;
    año:                number;
    placas:             string;
    kms:                number;
    niv:                string;
    num_motor:          string;
    motor_id:           number;
    transmision_id:     number;
    color:              string;
    num_serie:          string;
    clase:              string;
    ejes:               number;
    num_transmision:    string;
    combustible:        string;
    tarjetacircula:     string;
    pdftcirculacion:    string;
    pdfpermisosct:      string;
    estatus:            string;
    permiso_sct:        string;
    polizaseguro:       string;
    aseguradora:        string;
    vigenciapoliza:     Date | null;
    arrendado:          boolean;
    pdfpolizaseguro:    string;
    talle_marca?:       talle_marca;
    talle_modelo?:      talle_modelo;
    talle_tipo_unidad?: talle_tipo_unidad;
    talle_motor?:       talle_motor;
    talle_transmision?: talle_transmision;
    imagenes?:          string[];
    activo:             boolean;
}

interface talle_marca {
    marca:  string      
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

interface talle_transmision {
    transmision: string
}