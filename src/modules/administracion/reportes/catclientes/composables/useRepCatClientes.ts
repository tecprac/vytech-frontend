import { onMounted, ref } from 'vue';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import type { Cliente } from '@/modules/administracion/catalogos/clientes/interfaces/interfaces';
import { useToast } from 'primevue/usetoast';
import useUtilerias from '@/core/helpers/utilerias';
import * as XLSX from 'xlsx';

const { formatCurrency,convertTMZtime } = useUtilerias();

const useRepCatClientes = () => {
    const toast             = useToast();
    const loading           = ref<boolean>(false);
    const dtdatos           = ref();
    const tabActiva         = ref<string>('0');
    const registros         = ref<Cliente[]>([]);
    const columnas          = ref([
                                { field: 'id',                  header: 'id'},
                                { field: 'tipo_persona',        header: 'tipo_persona'},
                                { field: 'nombres',             header: 'nombres'},
                                { field: 'apaterno',            header: 'apaterno'},
                                { field: 'amaterno',            header: 'amaterno'},
                                { field: 'razon_social',        header: 'razon_social'},
                                { field: 'rep_legal',           header: 'rep_legal'},
                                { field: 'rfc',                 header: 'rfc'},
                                { field: 'curp',                header: 'curp'},
                                { field: 'calle',               header: 'calle'},
                                { field: 'colonia',             header: 'colonia'},
                                { field: 'cp',                  header: 'cp'},
                                { field: 'ciudad',              header: 'ciudad'},
                                { field: 'pais_id',             header: 'pais_id'},
                                { field: 'municipio',           header: 'municipio'},
                                { field: 'estado_id',           header: 'estado_id'},
                                { field: 'estado',              header: 'estado'},
                                { field: 'telefono_fijo',       header: 'telefono_fijo'},
                                { field: 'telefono_movil',      header: 'telefono_movil'},
                                { field: 'email',               header: 'email'},
                                { field: 'email_adicional',     header: 'email_adicional'},
                                { field: 'condiciones',         header: 'condiciones'},
                                { field: 'limite_credito',      header: 'limite_credito'},
                                { field: 'dias_credito',        header: 'dias_credito'},
                                { field: 'saldo',               header: 'saldo'},
                                { field: 'impuesto_iva',        header: 'impuesto_iva'},
                                { field: 'impuesto_iesps',      header: 'impuesto_iesps'},
                                { field: 'retencion_isr',       header: 'retencion_isr'},
                                { field: 'retencion_iva',       header: 'retencion_iva'},
                                { field: 'regimenfiscal_id',    header: 'regimenfiscal_id'},
                                { field: 'observaciones',       header: 'observaciones'},
                                { field: 'enviar_factura',      header: 'enviar_factura'},
                                { field: 'sat_pais',            header: 'sat_pais'},
                                { field: 'sat_estado',          header: 'sat_estado'},
                                { field: 'sat_regimenfiscal',   header: 'sat_regimenfiscal'},
                                { field: 'sat_usocfdi',         header: 'sat_usocfdi'},
                                { field: 'sat_formapago',       header: 'sat_formapago'},
                                { field: 'sat_metodopago',      header: 'sat_metodopago'},
                            ]);
    
    const GenerarReporte = async () => {
        registros.value.splice(0);
        loading.value = true;
        try {
            toast.add({
                severity:   'info',
                summary:    `Consultando información...`,
                group:      'waiting',    
            });
            const response = await ApiService.get2(`AdmReportes/catclientes`,null);
            registros.value = response.data;
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

    const exportarExcel = async () => {
        try {
            toast.add({
                severity:   'info',
                summary:    `Generando archivo XLSX...`,
                group:      'waiting',    
            });
            const data:any[] =[];
            // for (let i = 0; i < registros.value.length; i++) {
            //     const item = registros.value[i];
            //     data.push({
            //         Fecha: item.fecha, 
            //         Folio: item.folio,
            //         Serie: item.serie,
            //         Subtotal: item.subtotal,
            //         Impuestos: item.impuestos,
            //         Total: item.total,
            //         Saldo: item.saldo,
            //         Estatus: item.estatus,
            //         Fecha_Vence: item.fecha_vence,
            //         Observaciones: item.observaciones,
            //         Cliente: item.adm_cliente.tipo_persona == 'Moral' ? item.adm_cliente.razon_social : item.adm_cliente.nombre ,
            //         ClienteRFC : item.adm_cliente.rfc,
            //         Emisor: item.adm_propietario.tipo_persona == 'Moral' ? item.adm_propietario.razon_social : item.adm_propietario.nombre,
            //         Usuario: item.conf_usuario.usuario,
            //         Metodopago: item.sat_metodopago.c_metodopago+' '+item.sat_metodopago.metodo_pago,
            //         Formapago: item.sat_formapago.c_formapago+' '+item.sat_formapago.forma_pago,
            //     });
            // }
            const ws = XLSX.utils.json_to_sheet(registros.value);

            // Formato manual de columnas

            // const range = XLSX.utils.decode_range(ws['!ref']!);
            // for (let R = range.s.r + 1 ; R <= range.e.r; ++R) {
            //     // Columna 'fecha' -convertir a formato de fecha
            //     const fechacell = XLSX.utils.encode_cell({r: R, c: 0});
            //     ws[fechacell].t = 'd';
            //     ws[fechacell].z = 'dd/mm/yyy HH:mm';
            //     const subtotalcell = XLSX.utils.encode_cell({r: R, c: 3});
            //     ws[subtotalcell].t = 'n';
            //     ws[subtotalcell].z = '$#,##0.00';
            //     const impuestoscell = XLSX.utils.encode_cell({r: R, c: 4});
            //     ws[impuestoscell].t = 'n';
            //     ws[impuestoscell].z = '$#,##0.00';
            //     const totalcell = XLSX.utils.encode_cell({r: R, c: 5});
            //     ws[totalcell].t = 'n';
            //     ws[totalcell].z = '$#,##0.00';
            //     const saldocell = XLSX.utils.encode_cell({r: R, c: 6});
            //     ws[saldocell].t = 'n';
            //     ws[saldocell].z = '$#,##0.00';
            //     const vencecell = XLSX.utils.encode_cell({r: R, c: 8});
            //     ws[vencecell].t = 'd';
            //     ws[vencecell].z = 'dd/mm/yyy';
            // }

            // Establecer ancho de columnas
            ws['!cols'] = [
                { wch: 15 }
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, ws, 'CatalogoClientes');

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
            
            link.download = `CatalogoClientes${convertTMZtime(new Date().toISOString())}.xlsx`;
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
        dtdatos,
        tabActiva,
        registros,
        columnas,

        //Metodos
        GenerarReporte,
        exportarExcel,
        formatCurrency,
    }
    
}

export default useRepCatClientes;