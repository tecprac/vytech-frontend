export interface Tecnico {
    id:                 number;
    nombres:            string;
    apaterno:           string;
    amaterno:           string;
    fecha_nacimiento:   Date;
    rfc:                string;
    curp:               string;
    calle:              string;
    colonia:            string;
    cp:                 string;
    municipio:          string;
    estado_id:          number;
    especialidad:       string;
    categoria:          string;
    celular:            string;
    nombrecontacto:     string;
    telefonocontacto:   string;
    parentesco:         string;
    telefonocasa:       string;
    costo_hora:         number;
    comentarios:        string;
    imagen:             string;
    activo:             boolean;
    email:              string;
    pin:                string;
    sat_estado?:        sat_estado | null;
}

interface sat_estado {
    estado:  string      
}