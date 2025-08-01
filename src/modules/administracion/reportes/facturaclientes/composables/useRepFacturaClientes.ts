import { onMounted, ref } from 'vue';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import type { Documento } from '../interfaces/interfaces';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import { useToast } from 'primevue/usetoast';
import useUtilerias from '@/core/helpers/utilerias';
import * as XLSX from 'xlsx';

const { formatDate,formatNumber, formatCurrency,formatNumber2Dec,formatDateTime,convertTMZtime } = useUtilerias();

const useRepFacturaClientes = () => {
    const toast             = useToast();
    const loading           = ref<boolean>(false);
    const fecha_hoy         = ref<Date>(new Date());
    const fechaini          = ref<Date>(new Date(fecha_hoy.value.getFullYear(),fecha_hoy.value.getMonth(),1));
    const fechafin          = ref<Date>(new Date(fecha_hoy.value.getFullYear(),fecha_hoy.value.getMonth()+1,0));
    const dtdatos           = ref();
    const selectcliente     = ref();
    const clientesfiltrados = ref<Cliente[]>([]);
    const filtro_saldo      = ref<string>("0");
    const filtros_saldo     = ref([{valor: "0", name: 'TODAS'},{valor: "1", name:'Con Saldo'},{valor:"2", name:'Sin Saldo'}]);
    const tabActiva         = ref<string>('0');
    const registros         = ref<Documento[]>([]);
    const columnas          = ref([
                                { field: 'fecha',               header: 'Fecha Alta'},
                                { field: 'folio',               header: 'Folio'},
                                { field: 'serie',               header: 'Serie'},
                                { field: 'subtotal',            header: 'Subtotal'},
                                { field: 'impuestos',           header: 'Impuestos'},
                                { field: 'total',               header: 'Total'},
                                { field: 'saldo',               header: 'Saldo'},
                                { field: 'estatus',             header: 'Estatus'},
                                { field: 'fecha_vence',         header: 'Fecha Vence'},
                                { field: 'observaciones',       header: 'Observaciones'},
                                { field: 'adm_cliente',         header: 'Cliente'},
                                { field: 'adm_propietario',     header: 'Emisor'},
                                { field: 'conf_usuario',        header: 'Usario Registra'},
                                { field: 'sat_metodopago',      header: 'Metodo Pago'},
                                { field: 'sat_formapago',       header: 'Forma Pago'},
                            ]);


    const buscarClientes = async (event:any) => {
        if (event.query.trim().length) {
            const response = await ApiService.get2(`AdmClientes/SearchByText/${event.query}`,null);
            const clientes:Cliente[] = response.data;
            clientesfiltrados.value = clientes;
        }
    }    

    const GenerarReporte = async () => {
        registros.value.splice(0);
        loading.value = true;
        try {
            toast.add({
                severity:   'info',
                summary:    `Consultando información...`,
                group:      'waiting',    
            });
            const body = {
                cliente_id:     selectcliente.value ? selectcliente.value.id : 0,
                tipo:           filtro_saldo.value,
                tipo_documento: 'Factura',
            };
            const response = await ApiService.post(`AdmReportes/facturascliente`,body);
            registros.value = response.data.rows;
            toast.removeGroup('waiting');
        } catch (error) {
            toast.removeGroup('waiting');
            toast.add({
                severity:   "error",
                summary:    "Error al Consultar",
                detail:     "Comuniquese con su area de Soporte Técnico "+error,
                life:       3000
            });   
        }
        loading.value = false;
    }

    const exportarCSV = (event: any) => {
        dtdatos.value.exportCSV();
    }

    const exportarExcel = async () => {
        try {
            toast.add({
                severity:   'info',
                summary:    `Generando archivo XLSX...`,
                group:      'waiting',    
            });
            const data:any[] =[];
            for (let i = 0; i < registros.value.length; i++) {
                const item = registros.value[i];
                data.push({
                    Fecha: item.fecha, 
                    Folio: item.folio,
                    Serie: item.serie,
                    Subtotal: item.subtotal,
                    Impuestos: item.impuestos,
                    Total: item.total,
                    Saldo: item.saldo,
                    Estatus: item.estatus,
                    Fecha_Vence: item.fecha_vence,
                    Observaciones: item.observaciones,
                    Cliente: item.adm_cliente.tipo_persona == 'Moral' ? item.adm_cliente.razon_social : item.adm_cliente.nombre ,
                    ClienteRFC : item.adm_cliente.rfc,
                    Emisor: item.adm_propietario.tipo_persona == 'Moral' ? item.adm_propietario.razon_social : item.adm_propietario.nombre,
                    Usuario: item.conf_usuario.usuario,
                    Metodopago: item.sat_metodopago.c_metodopago+' '+item.sat_metodopago.metodo_pago,
                    Formapago: item.sat_formapago.c_formapago+' '+item.sat_formapago.forma_pago,
                });
            }
            const ws = XLSX.utils.json_to_sheet(data);

            // Formato manual de columnas
            const range = XLSX.utils.decode_range(ws['!ref']!);
            for (let R = range.s.r + 1 ; R <= range.e.r; ++R) {
                // Columna 'fecha' -convertir a formato de fecha
                const fechacell = XLSX.utils.encode_cell({r: R, c: 0});
                ws[fechacell].t = 'd';
                ws[fechacell].z = 'dd/mm/yyy HH:mm';
                const subtotalcell = XLSX.utils.encode_cell({r: R, c: 3});
                ws[subtotalcell].t = 'n';
                ws[subtotalcell].z = '$#,##0.00';
                const impuestoscell = XLSX.utils.encode_cell({r: R, c: 4});
                ws[impuestoscell].t = 'n';
                ws[impuestoscell].z = '$#,##0.00';
                const totalcell = XLSX.utils.encode_cell({r: R, c: 5});
                ws[totalcell].t = 'n';
                ws[totalcell].z = '$#,##0.00';
                const saldocell = XLSX.utils.encode_cell({r: R, c: 6});
                ws[saldocell].t = 'n';
                ws[saldocell].z = '$#,##0.00';
                const vencecell = XLSX.utils.encode_cell({r: R, c: 8});
                ws[vencecell].t = 'd';
                ws[vencecell].z = 'dd/mm/yyy';
            }

            // Establecer ancho de columnas
            ws['!cols'] = [
                { wch: 15 }
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, ws, 'FacturaClientes');

            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            link.download = `FacturaClientes${convertTMZtime(new Date().toISOString())}.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
            toast.removeGroup('waiting');
        } catch (error) {
            toast.removeGroup('waiting');
            toast.add({
                severity:   "error",
                summary:    "Error al generar archivo XLSX",
                detail:     "Comuniquese con su area de Soporte Técnico "+error,
                life:       3000
            });   
        }
        
    }

    return {
        // Propiedades
        loading,
        fechaini,
        fechafin,
        dtdatos,
        selectcliente,
        clientesfiltrados,
        filtro_saldo,
        filtros_saldo,
        tabActiva,
        registros,
        columnas,

        //Metodos
        GenerarReporte,
        formatNumber,
        exportarCSV,
        exportarExcel,
        formatDateTime,
        formatNumber2Dec,
        formatCurrency,
        buscarClientes,
    }

};

export default useRepFacturaClientes;