export interface Cotizacion {
    id:                 number,
    fecha:              Date,
    estatus:            string,
    folio_documento_id: number,
    folio:              number,
    serie:              string,
    cliente_id:         number,
    propietario_id:     number,
    agente_id:          number,
    nombre_cliente?:    string,
    atencion?:          string,
    unidad_registrada:  boolean,
    unidad_id?:         number,
    datos_unidad:       string,
    email_envio:        string,
    fecha_vence:        Date,
    observaciones?:     string,
    descuentos?:        number,
    tasa_impuesto?:     number,
    tasa_retencion?:    number,
    subtotal:           number,
    impuestos:          number,
    retenciones:        number,
    total:              number,
    usuario_id:         number,
    usuario_cancela_id?: number,
    moneda_id:          number,
    tipocambio?:        number,
    fecha_cancela?:     Date,
    obs_cancela?:       string,
    filepdf?:           string,
    activo:             boolean,
    adm_cliente?:       adm_cliente | null,
    adm_propietario?:   adm_propietario | null,
    adm_agente?:        adm_agente | null,
    conf_usuario?:      conf_usuario | null,
}

export interface Cotizacion_Detalle {
    id:                     number,
    cotizacion_id:          number,
    tipo_partida:           string,
    trabajo_id:             number,
    producto_id:            number,
    descripcion:            string,
    cantidad:               number,
    precio_unitario:        number,
    precio:                 number,
    precio_final:           number,
    importe:                number,
    porcdescuento:          number,
    descuento:              number,
    importe_final:          number,
    impuesto:               number,
    porcentaje_impuesto:    number,
    retencion:              number,
    porcentaje_retencion:   number,
    estatus:                string,
    observaciones:          string,
    usuario_autoriza_id?:   number | null,
    fecha_autoriza?:        Date | null,
    notas_autoriza?:        string,
    orden_id?:              number | null,
    activo:                 boolean,    
}

interface adm_cliente {
    tipo_persona:   string,
    rfc:            string,
    razon_social:   string,
    nombre:         string,
}

interface adm_propietario {
    tipo_persona:   string,
    rfc:            string,
    razon_social:   string,
    nombre:         string,    
}

interface conf_usuario {
    usuario:    string,
    nombre:     string,
}

interface adm_agente {
    nombre:     string,
    apaterno:   string,
    amaterno:   string,
    porc_venta: number,
    porc_cobro: number,
}

export interface MailOptions {
    to:         string,
    from:       string,
    bcc:        string,
    subject:    string,
    htmlBody:   string,
}

export interface Permisos {
    modulo: string,
    permiso: string,
}