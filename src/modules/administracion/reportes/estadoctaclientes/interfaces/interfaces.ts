export interface Documento {
    id:             number,
    tipo_documento: string,
    folio:          number,
    serie:          string,
    fecha:          Date,
    subtotal:       number,
    impuestos:      number,
    total:          number,
    estatus:        string,
    activo:         boolean,
    fecha_vence:    Date,
    saldo:          number,
    observaciones:  string,
    adm_cliente:    adm_cliente,
    adm_propietario:adm_propietario,
    conf_usuario:   conf_usuario,
    sat_metodopago: sat_metodopago,
    sat_formapago:  sat_formapago,
}

interface adm_cliente {
    razon_social:   string,
    rfc:            string,
    tipo_persona:   string,
    nombre:         string,
}

interface adm_propietario {
    razon_social:   string,
    rfc:            string,
    tipo_persona:   string,
    nombre:         string,
}

interface conf_usuario {
    usuario:    string,
}

interface sat_metodopago {
    c_metodopago:   string,
    metodo_pago:    string,
}

interface sat_formapago {
    c_formapago:    string,
    forma_pago:     string,
}

