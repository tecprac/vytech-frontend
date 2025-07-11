import { ref } from 'vue';
import type { Cotizacion } from '../interfaces/interfaces';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import JsBarcode from 'jsbarcode';
import { getAssetPath } from "@/core/helpers/assets";
import useUtilerias from '@/core/helpers/utilerias';

const useCotizacionFormatos = () => {
    const registro  = ref<Cotizacion>({
                            id:                 0,
                            fecha:              new Date(),
                            estatus:            'SinAutorizar',
                            folio_documento_id: 0,
                            folio:              0,
                            serie:              '',
                            cliente_id:         0,
                            propietario_id:     0,
                            agente_id:          0,
                            nombre_cliente:     '',
                            atencion:           '',
                            fecha_vence:        new Date(),
                            unidad_registrada:  false,
                            unidad_id:          0,
                            email_envio:        '',
                            observaciones:      '',
                            descuentos:         0,
                            tasa_impuesto:      0,
                            tasa_retencion:     0,
                            subtotal:           0,
                            impuestos:          0,
                            retenciones:        0,
                            total:              0,
                            usuario_id:         0,
                            moneda_id:          0,
                            tipocambio:         1,
                            filepdf:            '',
                            activo:             true,
                    });
    
    const { formatDateTime,convertTMZdate, convertTMZdatetime, convertTMZtime, formatNumber } = useUtilerias();

    const PDFNormal = (data: any) => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4"
        });

        return pdf.output("dataurlstring");
    }

    const PDFObservaciones = (data: any) => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4"
        });

        return pdf.output("dataurlstring");
    }

    return {
        PDFNormal,
        PDFObservaciones
    }

}

export default useCotizacionFormatos;