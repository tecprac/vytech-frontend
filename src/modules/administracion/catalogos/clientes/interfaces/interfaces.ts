export interface Cliente {
    id:                     number;
    tipo_persona:           string;
    nombres:                string;
    apaterno:               string;
    amaterno:               string;
    razon_social:           string;
    rep_legal:              string;
    rfc:                    string;
    curp:                   string;
    calle:                  string;
    colonia:                string;
    cp:                     string;
    ciudad:                 string;
    pais_id:                number;
    municipio:              string;
    estado_id:              number;
    estado:                 string;
    telefono_fijo:          string;
    telefono_movil:         string;
    email:                  string;
    email_adicional:        string;
    condiciones:            string;
    limite_credito:         number;
    dias_credito:           number;
    saldo:                  number;
    impuesto_iva:           number;
    impuesto_iesps:         number;
    retencion_isr:          number;
    retencion_iva:          number;
    desglosariespsencfdi:   boolean;
    tiene_addenda:          boolean;
    addenda_id:             number | null;
    carta_porte:            boolean;
    regimenfiscal_id:       number;
    usocfdi_id:             number;
    formapago_id:           number;
    metodopago_id:          number;
    observaciones:          string;
    latitud:                string;
    longitud:               string;
    add_addenda?:           adm_addenda | null;
    sat_pais?:              sat_pais | null;
    sat_estado?:            sat_estado | null;
    sat_regimenfiscal?:     sat_regimenfiscal | null;
    sat_usocfdi?:           sat_usocfdi | null;
    sat_formapago?:         sat_formapago | null;
    sat_metodopago?:        sat_metodopago | null;
    activo:                 boolean;
}

interface adm_addenda {
    addenda:    string
}

interface sat_pais {
    c_pais:     string,
    pais:       string,
}

interface sat_estado {
    c_estado:   string,
    estado:     string,
}

interface sat_regimenfiscal {
    c_regimenfiscal:    string,
    regimenfiscal:      string,
}

interface sat_usocfdi {
    c_usocfdi:  string,
    usocfdi:    string,
}

interface sat_formapago {
    c_formapago:    string,
    formapago:      string,
}

interface sat_metodopago {
    c_metodopago:   string,
    metodopago:     string,
}
