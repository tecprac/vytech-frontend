import { ref, watch, computed, onMounted } from 'vue';
import { useQuery,useMutation } from '@tanstack/vue-query';
import ApiService from "@/core/services/ApiService";
import { useToast } from 'primevue/usetoast';
import type { Documento, Documento_Detalle, adm_cp_adicionales,
    adm_cp_mercancia, adm_cp_transporte, adm_documento_relacionado } from '../interfaces/interfaces';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import type { FolioDocumento } from '@/modules/configuracion/folioDocumento/interfaces/interfaces';
import type { Propietario } from '@/modules/administracion/catalogos/propietario/interfaces/interfaces';
import type { Agente } from '@/modules/administracion/catalogos/agente/interfaces/interfaces';
import type { Producto } from '@/modules/almacen/catalogos/producto/interfaces/interfaces';
import type { SatMoneda } from '@/modules/sat/catalogos/moneda/interfaces/interfaces';
import type { Almacen } from '@/modules/almacen/catalogos/almacen/interfaces/interfaces';
import Swal from 'sweetalert2';
import { getAssetPath } from "@/core/helpers/assets";
import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';
import useUtilerias from '@/core/helpers/utilerias';

const getregistro = async( id:number ):Promise<Documento> => {
    if (id > 0){
        ApiService.setHeader();
        const { data } = await ApiService.get2(`AdmFactura/GetById/${id}`,null);
        return data;
    } else {
        const newRegistro:Documento = {
            id:                 		0,
            tipo_documento:     		'Factura',
            folio:              		0,
            serie:              		'',
            propietario_id:     		0,
            cliente_id:         		0,
            agente_id:          		0,
            orden_id:           		0,
            fecha:              		new Date(),
            dias_credito:       		0,
            fecha_vence:        		new Date(),
            observaciones:      		'',
            descuentos:         		0,
            tasa_impuesto:      		0,
            tasa_retencion:     		0,
            subtotal:           		0,
            impuestos:          		0,
            retenciones:        		0,
            total:              		0,
            saldo:              		0,
            estatus:            		'SinAplicar',
            lugarexpedicion:    		'',
            almacen_id:         		0,
            usocfdi_id:         		0,
            formapago_id:       		0,
            metodopago_id:      		0,
            usuario_id:         		0,
            usuario_cancela_id: 		0,
            moneda_id:          		0,
            tipocambio:         		1,
            fecha_cancela:       		new Date(),
            parcialidades:       		0,
            numparcialidad:     		0,
            errortimbrado:       		'',
            compcartaporte:     		0,
            motivocancelacion_id: 		0,
            foliosustitucion:     		'',
            codigocancela:       		'',
            activo:             		true,
        }
        return newRegistro;
    }
};

const newRegistro =async (registro:Documento):Promise<Documento> => {
    ApiService.setHeader();
    const { data } = await ApiService.post(`AdmFactura`,registro);
    return data;
};

const updateRegistro =async (registro:Documento ):Promise<Documento> => { 
    ApiService.setHeader();
    const { data } = await ApiService.patch(`AdmFactura/${registro.id}`,registro);
    return data;
};

const deleteRegistro =async ( registro:Documento ):Promise<Documento> => {
    ApiService.setHeader();
    const { data } = await ApiService.delete(`AdmFactura/${registro.id}`);
    return data;
};

const useDocumento = (id: number ) => {
    const store             = useAuthStore();
    const confirm           = useConfirm();
    const registro          = ref<Documento>({
                                id:                 		0,
                                tipo_documento:     		'Factura',
                                folio:              		0,
                                serie:              		'',
                                propietario_id:     		0,
                                cliente_id:         		0,
                                agente_id:          		0,
                                orden_id:           		0,
                                fecha:              		new Date(),
                                dias_credito:       		0,
                                fecha_vence:        		new Date(),
                                observaciones:      		'',
                                descuentos:         		0,
                                tasa_impuesto:      		0,
                                tasa_retencion:     		0,
                                subtotal:           		0,
                                impuestos:          		0,
                                retenciones:        		0,
                                total:              		0,
                                saldo:              		0,
                                estatus:            		'SinAplicar',
                                lugarexpedicion:    		'',
                                almacen_id:         		0,
                                usocfdi_id:         		0,
                                formapago_id:       		0,
                                metodopago_id:      		0,
                                usuario_id:         		0,
                                usuario_cancela_id: 		0,
                                moneda_id:          		0,
                                tipocambio:         		1,
                                fecha_cancela:       		new Date(),
                                parcialidades:       		0,
                                numparcialidad:     		0,
                                errortimbrado:       		'',
                                compcartaporte:     		0,
                                motivocancelacion_id: 		0,
                                foliosustitucion:     		'',
                                codigocancela:       		'',
                                activo:             		true,
                            });
    const foliosdoctos      = ref<FolioDocumento[]>([]);
    const selecfoliodocto   = ref<FolioDocumento>({
                                    id:             0,
                                    modulo_id:      0,
                                    folio_siguiente: 0,
                                    documento:      '',
                                    serie:          '',
                                    activo:         true
                                });
    const propietarios      = ref<Propietario[]>([]);
    const selectpropietario = ref<Propietario>({
                                    id:                 0,
                                    tipo_persona:       'Fisica',
                                    nombres:            '',
                                    apaterno:           '',
                                    amaterno:           '',
                                    razon_social:       '',
                                    rfc:                '',
                                    curp:               '',
                                    calle:              '',
                                    colonia:            '',
                                    cp:                 '',
                                    ciudad:             '',
                                    pais_id:            0,
                                    localidad:          '',
                                    estado_id:          0,
                                    estado:             '',
                                    telefono_fijo:      '',
                                    telefono_movil:     '',
                                    email:              '',
                                    email_adicional:    '',
                                    regimenfiscal_id:   0,
                                    usocfdi_id:         0,
                                    formapago_id:       0,
                                    metodopago_id:      0,
                                    observaciones:      '',
                                    latitud:            '',
                                    longitud:           '',
                                    file_certificado_csd: '',
                                    file_certificado_key: '',
                                    password_certificado: '',
                                    vigencia_certificado: new Date(),
                                    api_key:            '',
                                    api_key_pruebas:    '',
                                    file_imagen_logo:   '',
                                    activo:             true,
                                    sat_pais:           null,
                                    sat_estado:         null,
                                    sat_regimenfiscal:  null,
                                    sat_usocfdi:        null,
                                    sat_formapago:      null,
                                    sat_metodopago:     null,
                            });
    const agentes           = ref<Agente[]>([]);
    const selectagente      = ref<Agente>({
                                    id: 		0,
                                    nombre: 	'',
                                    apaterno: 	'',
                                    amaterno: 	'',
                                    porc_venta: 0,
                                    porc_cobro:	0,
                                    activo:		true,
                                });
    const monedas           = ref<SatMoneda[]>([]);
    const selectmoneda      = ref<SatMoneda>({
                                id:         0,
                                c_moneda:   '',
                                descripcion: '',
                                decimales:  0,
                                activo:     true,
                            });
    const almacenes         = ref<Almacen[]>([]);
    const selectalmacen     = ref<Almacen>({
                                id:             0,
                                nombre:         '',
                                esconsignacion: false,
                                direccion:      '',
                                ciudad:         '',
                                estado:         '',
                                activo:         true,
                            });
    const selectcliente     = ref();
    const clientesfiltrados = ref<Cliente[]>([]);
    const selectproducto    = ref();
    const productosfiltrados= ref<Producto[]>([]);
    const { formatCurrency, formatNumber2Dec } = useUtilerias();
    const { isPending, data, isError } = useQuery({
            queryKey:               ['orden', id],
            queryFn:                () => getregistro(id),
            refetchOnWindowFocus:   (id > 0 ? true : false),
            retry:                  false,
    });

    onMounted(async () => {
        foliosdoctos.value.splice(0);
        propietarios.value.splice(0);
        agentes.value.splice(0);
        const response  = await ApiService.get2('Modulos/SearchByField/codigo/049',null);
        const modulo = response.data[0];
        const respfoliosdocto = await ApiService.get2(`FolioDocumento/SearchByModuloId/${modulo.id}`,null);
        foliosdoctos.value = <FolioDocumento[]>respfoliosdocto.data;
        if (foliosdoctos.value.length > 0 ) {
            selecfoliodocto.value = foliosdoctos.value[0];
            if (id == 0) registro.value.folio  = selecfoliodocto.value.folio_siguiente;
            registro.value.serie  = selecfoliodocto.value.serie;
        } else {
            Swal.fire({
                title:  'No existe Folio',
                html:   'No se encontraron Folios para este tipo de Documento.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const respropietario = await ApiService.get2('AdmPropietario/listado',null);
        propietarios.value = <Propietario[]>respropietario.data;
        if (propietarios.value.length > 0){
            selectpropietario.value = propietarios.value[0];
        } else {
            Swal.fire({
                title:  'No existen Emisores',
                html:   'No se encontraron Emisores.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const respagente = await ApiService.get2('AdmAgente/listado',null);
        agentes.value = <Agente[]>respagente.data;
        if (agentes.value.length > 0){
            selectagente.value = agentes.value[0];
        } else {
            Swal.fire({
                title:  'No existen Agentes/Vendedores',
                html:   'No se encontraron Agentes/Vendedores.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const respmoneda = await ApiService.get2('SatMoneda/listado',null);
        monedas.value = <SatMoneda[]>respmoneda.data;
        if (monedas.value.length > 0){
            selectmoneda.value = monedas.value[0];
        } else {
            Swal.fire({
                title:  'No existen Monedas',
                html:   'No se encontraron Monedes dentro del Catalogo del SAT.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
        const resalmacen = await ApiService.get2('InvAlmacen/listado',null);
        almacenes.value = <Almacen[]>respmoneda.data;
        if (almacenes.value.length > 0){
            selectalmacen.value = almacenes.value[0];
        } else {
            Swal.fire({
                title:  'No existen Almacenes',
                html:   'No se encontraron Almacenes dentro del Catalogo de Almacenes.<br>Consulte a su Administrador',
                icon:   "warning",
                timer:  5000,
            });
        }
    });

    const cambiaDocumento = () => {
        registro.value.folio = selecfoliodocto.value.folio_siguiente;
        registro.value.serie = selecfoliodocto.value.serie;
    }

    const buscarClientes = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`AdmClientes/SearchByText/${event.query}`,null);
            const clientes:Cliente[] = response.data;
            clientesfiltrados.value = clientes;
        }
    }

    const buscarProductos = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`InvProducto/SearchByText/${event.query}`,null);
            const refacciones:Producto[] = response.data;
            productosfiltrados.value = refacciones;
        }
    }

    return {
        isPending,
        registro,

        cambiaDocumento,
        buscarClientes,
        buscarProductos
    }
}

export default useDocumento;