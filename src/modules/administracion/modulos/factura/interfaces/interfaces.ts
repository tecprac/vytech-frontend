export interface Documento {
    id:                 		number;
	tipo_documento:     		string;
	folio:              		number;
	serie:              		string;
	propietario_id:     		number;
	cliente_id:         		number;
	agente_id:          		number;
	orden_id:           		number;
	fecha:              		Date;
	dias_credito:       		number;
	fecha_vence:        		Date;
	observaciones:      		string;
	descuentos:         		number;
	tasa_impuesto:      		number;
	tasa_retencion:     		number;
	subtotal:           		number;
	impuestos:          		number;
	retenciones:        		number;
	total:              		number;
	saldo:              		number;
	estatus:            		string;
	lugarexpedicion:    		string;
	almacen_id:         		number;
	usocfdi_id:         		number;
	formapago_id:       		number;
	metodopago_id:      		number;
	usuario_id:         		number;
	usuario_cancela_id?:		number;
	moneda_id:          		number;
	tipocambio:         		number;
	fecha_cancela?:     		Date;
	parcialidades?:     		number;
	numparcialidad?:    		number;
	errortimbrado?:     		string;
	compcartaporte?:    		number;
	motivocancelacion_id?: 		number;
	foliosustitucion?:  		string;
	codigocancela?:     		string;
    activo:             		boolean;
	adm_cliente?:       		adm_cliente | null;
    conf_usuario?:      		conf_usuario | null;
	adm_documento_detalle?:		Documento_Detalle[] | null;
	sat_usocfdi?:				sat_usocfdi | null;
	sat_formapago?:				sat_formapago | null;
	sat_metodopago?:			sat_metodopago | null;
	sat_moneda?:				sat_moneda | null;
	inv_almacen?:				inv_almacen | null;
	adm_cp_adicionales?:		adm_cp_adicionales | null;
	adm_cp_mercancia?:			adm_cp_mercancia[] | null;
	adm_cp_transporte?:			adm_cp_transporte | null;
	adm_documento_relacionado?:	adm_documento_relacionado[] | null;
}

export interface Documento_Detalle {
	id: 					number;
	documento_id: 			number;
	producto_id: 			number;
	almacen_id: 			number;
	orden_trabajo_id: 		number;
	requision_detalle_id: 	number;
	cantidad: 				number;
	devueltas: 				number;
	costo: 					number;
	costotal: 				number;
	precio_unitario: 		number;
	precio: 				number;
	precio_final: 			number;
	importe: 				number;
	porcdescuento: 			number;
	descuento: 				number;
	importe_final: 			number;
	impuesto: 				number;
	porcentanje_impuesto: 	number;
	retencion: 				number;
	porcentaje_retencion: 	number;
	observaciones: 			string;
	activo: 				boolean;
}

interface adm_cliente {
    tipo_persona:   string,
    rfc:            string,
    razon_social:   string,
    nombre:         string,
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

interface sat_metodopago {
	metodo_pago: string,
}

interface sat_moneda {
	moneda: string,
}

interface inv_almacen {
	almacen: string,
}

export interface adm_cp_adicionales {
	id: 					number;
	documento_id: 			number;
	pesobrutototal: 		number;
	c_claveunidadpeso: 		string;
	pesonetototal: 			number;
	numtotalmercancias: 	number;
	idccp?: 				string | null;
	c_regimenaduanero?: 	string | null;
	registroistmo?: 		string | null;
	ubicacionpoloorigen?: 	string | null;
	ubicacionpolodestino?: 	string | null;
	logisticainversarecolecciondevolucion?: string | null;
}

export interface adm_cp_mercancia {
	id?: 						number;
	documento_id: 				number;
	claveprodservcp_id: 		number;
	descripcion: 				string;
	id_cvestc: 					string;
	cantidad: 					number;
	unidad?: 					string;
	matpeligroso?: 				string;
	matpeligroso_id?: 			number;
	descripcionmatpeligroso?: 	string;
	tipoembalaje_id?: 			number;
	pesoenkg: 					number;
	valormercancia: 			number;
	c_sectorcofepris?: 			string;
	nombreingredienteactivo?: 	string;
	nomquimico?: 				string;
	denominaciongenericaprod?: 	string;
	denominaciondistintivaprod?: string;
	fabricante?: 				string;
	fechacaducidad?: 			string;
	lotemedicamento?: 			string;
	c_formafarmaceutica?: 		string;
	c_condicionesespeciales?: 	string;
	registrosanitariofolioautorizacion?: string;
	permisoimportacion?: 		string;
	folioimpovucem?: 			string;
	numcas?: 					string;
	razonsocialempimp?: 		string;
	numregsanplagcofepris?: 	string;
	datosfabricante?: 			string;
	datosformulador?: 			string;
	datosmaquilador?: 			string;
	usoautorizado?: 			string;
}

export interface adm_cp_transporte {
	id?: 						number;
    documento_id: 				number;
    unidad_id: 					number;
    tipopermiso_id: 			number;
    numpermisosct: 				string;
    nombreaseg: 				string;
    numpolizaseguro: 			string;
    configvehicular_id: 		string;
    placavm: 					string;
    aniomodelovm: 				number;
    numremolques: 				number;
    remolque_id_1?: 			number;
    subtiporem_id_1?: 			string;
    placarem1?: 				string;
    remolque_id_2?: 			number;
    subtiporem_id_2?: 			string;
    placarem2?: 				string;
    operador_id: 				number;
    operador_2_id?: 			number;
    propietario_id?: 			number;
    nombreasegma?: 				string;
    numpolizaseguroma?: 		string;
    pesobrutovehicular: 		number;
}

export interface adm_documento_relacionado {
	id?: 				number;
	documento_id: 		number;
	origen: 			string;
	id_documentorel: 	number;
	uuid?: 				string | null;
	tiporelacion_id: 	number;
	activo: 			boolean;
}