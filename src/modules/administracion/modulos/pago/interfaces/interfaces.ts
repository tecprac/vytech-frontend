export interface Documento {
    id: 				number;
	folio_documento_id: number;
	folio: 				number;
	serie: 				string;
	ctabanco_id: 		number;
	formapago_id: 		number;
	moneda_id: 			number;
	tipocambio: 		number;
	propietario_id: 	number;
	cliente_id: 		number;
	ctaordenante: 		string;
	id_bancoordenante: 	number;
	fecha_registro: 	Date;
	fecha_pago: 		Date;
	saldoafavor: 		number;
	doctosaldoafavor_id?: number | null;
	importe: 			number;
	saldo: 				number;
	usuario_id: 		number;
	referencia?: 		string | null;
	concepto?: 			string | null;
	usuario_cancela_id?: number | null;
	fecha_cancela?: 	Date | null;
	observaciones?: 	string | null;
	estatus: 			string;
	errortimbrado: 		string;
	filepdf?: 			string | null;
	usocfdi_id: 		number;
	motivocancela_id?: 	number | null;
	foliosustitucion?: 	string | null;
    activo:             boolean;
	adm_cliente?:       adm_cliente | null;
    conf_usuario?:      conf_usuario | null;
    sat_usocfdi?:		sat_usocfdi | null;
	sat_formapago?:		sat_formapago | null;
	sat_moneda?:		sat_moneda | null;
}

export interface Documento_Detalle {
    id:             number;
	pago_id:        number;
	documento_id:   number;
    c_metodopago:   string;
	parcialidad:    number;
	importe:        number;
	saldoant:       number;
	saldoinsoluto?: number | null;
	notas?:         string | null;
    adm_documentos?: adm_documento | null;
}

export interface Documento_CFDI {
    id: 					number;
    documento_id: 			number;
    folio:   				number;
    serie:					string;
    tipodecomprobante_id: 	number;
    uuid: 					string;
    fecha_emision: 		    Date;
    enviado: 				boolean;
    email:   				string;
    fecha_cancelacion: 	    Date | null;
    estatus: 				string;
    fechatimbrado:   		string;
    version: 				string;
    sellocfd: 				string;
    nocertificadosat: 		string;
    nocertificado:   		string;
    sellosat: 				string;
    cadenaoriginal?: 		string;
    filepdf: 				string;
    filexml: 				string;
    filepdf_acuse?:         string | null;
    estatuscancelacion?:    string | null;
    error?: 				string;
    sat_tipodecomprobante?:  sat_tipodecomprobante;
    versioncfdi: 			string | null;
    versionccp?: 			string | null;
}

export interface Factura {
    id:                 number,
    folio:              number,
    serie:              string,
    estatus:            string,
    tipo_documento:     string,
    fecha:              Date,
    fecha_vence:        Date,
    total:              number,
    saldo:              number,
    adm_cliente?:       adm_cliente | null,
    sat_metodopago?:    sat_metodopago | null,
}

interface sat_tipodecomprobante {
    id:                     number;
	c_tipodecomprobante:    string;
	descripcion:            string;
}

interface sat_metodopago {
    c_metodopago:   string,
    descripcion:    string,
}

interface adm_cliente {
    tipo_persona:   string,
    rfc:            string,
    razon_social:   string,
    nombres:        string,
    apterno:        string,
    amaterno:       string,
}

interface conf_usuario {
    usuario:    string,
    nombre:     string,
}

interface sat_usocfdi {
	uso_cfdi:	string,
}

interface sat_formapago {
	forma_pago: string,
}

interface sat_moneda {
	moneda: string,
}

export interface adm_documento_relacionado {
    id: 				number;
    pago_id:     		number;
    origen: 			string;
    id_documentorel: 	number;
    uuid: 				string;
    tiporelacion_id: 	number;
    activo: 			boolean;
    sat_tiporelacion?:	sat_tiporelacion | null;
}

interface sat_tiporelacion {
    c_tiporelacion:	string;
    descripcion:	string;
}

export interface AdmCtaBanco {
    id:             number;
    banco_id:       number;
    descripcion:    string;
    cuenta:         string;
    clabe:          string;
    propietario_id: number;
    titular:        string;
    saldo:          number;
}

interface adm_documento {
    tipo_documento: string,
    folio:          number,
    serie:          string,
    propietario_id: number,
    cliente_id:     number,
    total:          number,
    saldo:          number,
    estatus:        number,
    adm_cliente?:   adm_cliente | null,
}

export interface MailOptions {
    to:         string,
    from:       string,
    bcc:        string,
    subject:    string,
    htmlBody:   string,
}

export interface ConsultaCFDIResponse {
    'a:CodigoEstatus': string;
    'a:EsCancelable': string;
    'a:Estado': string;
    'a:EstatusCancelacion'?: string | null; // puede venir vacío
    'a:ValidacionEFOS': string;
}

export interface SatMotivoCancela {
    id: 			number;
	c_motivo: 		string;
	descripcion: 	string;
}