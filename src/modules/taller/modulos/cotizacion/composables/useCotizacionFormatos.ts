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
                            datos_unidad:       '',
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
    
    const { formatDate, formatDateTime,convertTMZdate, convertTMZdatetime, 
        convertTMZtime, formatNumber, formatCurrency } = useUtilerias();

    const PDFNormal = (data: any, unidad: any, connotas: boolean = false) => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4"
        });

        const totalPagesExp = '{total_pages_count_string}'
        const registros:any = [];
        data.talle_cotizacion_detalles.forEach((item: any) => {
            registros.push([
                item.cantidad,
                item.tipo_partida,
                connotas ? item.descripcion+'\nNotas: '+item.observaciones : item.descripcion,
                formatCurrency(item.precio),
                formatCurrency(item.descuento),
                formatCurrency(item.importe_final)
            ]);
        });
        
        // Leyenda de observaciones
        const notas = [
            '• Los precios aquí cotizados son estimaciones sujetas a verificación y pueden variar sin previo aviso.',
            '• La presente cotización no representa un compromiso final ni obliga al taller a mantener los precios indicados.',
            '• En caso de requerirse piezas adicionales o detectarse fallas no contempladas, el cliente será notificado para su autorización',
            '  previa.',
            '• El taller no se hace responsable por daños ocultos o defectos preexistentes que no puedan ser detectados durante una ',
            '  inspección preliminar.',
        ];

        // CONSTRUCCION PDF ENCABEZADO
        pdf.setLanguage("es-MX");

        autoTable(pdf,{
            margin: { top: 185,left: 14,right: 14, bottom: 220 },
            headStyles: {
                fillColor: [164,22,22],
                fontSize: 9,
                halign: 'center',
                valign: 'middle',
            },
            bodyStyles: {
                textColor: 0,
                fontSize: 9,
                halign: 'center' 
            },
            columnStyles: {
                0: {halign: 'right'},
                1: {halign: 'left'},
                2: {halign: 'left'},
                3: {halign: 'right'},
                4: {halign: 'right'},
                5: {halign: 'right'},
            },
            head: [['Cantidad','Unidad','Descripcion','Precio','Descuento','Importe']],
            body: registros,
            willDrawPage: () => {
                pdf.addImage(getAssetPath('media/logos/logo_small.png'),'PNG',20,10,150,0,'Logo');
                pdf.addImage(getAssetPath('media/logos/tago_taller.jpg'),'jpg',430,10,150,0,'LogoTAGO');
                pdf.setFontSize(16);
                pdf.setTextColor(0,0,0);
                pdf.setFont("helvetica","bold");
                pdf.text("JOSÉ LUIS TAPIA PARRALES",190,40);
                pdf.setFontSize(11);
                pdf.text("INGENIERO DE CAMPO Y SOPORTE",215,50);
                pdf.setFontSize(11);
                pdf.text("TÉCNICO A MOTORES VEHÍCULARES",210,60);
                pdf.setDrawColor(0);
                pdf.setFillColor(164,22,22);
                pdf.roundedRect(240, 67, 120, 18,3,3,'F');
                pdf.setFontSize(14);
                pdf.setTextColor(255,255,255);
                pdf.text("461 312 4810",268,80);
                pdf.addImage(getAssetPath('media/logos/logo-what.png'),'png',245,65,21,0,'LogoWhat');
                pdf.setFontSize(12);
                pdf.setTextColor(0,0,0);
                pdf.setFont("helvetica","bold");
                pdf.text("contacto@vytechservices.com.mx",300,95,{align: 'center'});
                
                // CONSTRUCCION CUADRO DE ENCABEZADO
                pdf.setFillColor(164,22,22);
                pdf.roundedRect(14,105,568,75,2,2,'F');
                pdf.setFont("helvetica","bold");
                pdf.setFontSize(13);
                pdf.setTextColor(255,255,255);
                pdf.setFont("helvetica","bold");
                pdf.text(`COTIZACIÓN DE  MANO DE OBRA / REFACCIONES  NO. ${data.serie} - ${data.folio} `,300,116,{align: 'center'});
                pdf.setFillColor(255,255,255);
                pdf.roundedRect(16,118,564,60,2,2,'F');

                // DATOS DEL ENCABEZADO 
                pdf.setFontSize(11);
                pdf.setTextColor(0,0,0);
                pdf.setFont("helvetica","bold");
                pdf.text(`Cliente:`,20,128)
                pdf.text(`Fecha:`,480,128)
                // pdf.text(`Vence:`,480,142)
                pdf.setFont("helvetica","normal");
                pdf.text(`${data.nombre_cliente ? data.nombre_cliente : data.adm_cliente.tipo_persona == 'Moral' ? data.adm_cliente.razon_social : data.adm_cliente.nombre}`,75,128)
                pdf.text(`${convertTMZdate(data.fecha)}`,520,128);
                pdf.setFont("helvetica","bold");
                pdf.text(`Atención:`,20,142);
                pdf.setFont("helvetica","normal");
                pdf.text(`${data.atencion}`,75,142);
                // pdf.text(`${convertTMZdate(data.fecha_vence)}`,520,142);
                pdf.setFont("helvetica","bold");
                pdf.text(`Unidad:`,20,156);
                if (data.datos_unidad.length > 0) {
                    pdf.setFont("helvetica","normal");
                    pdf.text(`${data.datos_unidad}`,75,156);
                }
                if (data.unidad_id > 0 && data.datos_unidad.length == 0) {
                    pdf.setFont("helvetica","normal");
                    pdf.text(`${unidad.data.talle_tipo_unidad.tipo_unidad}, ${unidad.data.talle_marca.marca}, ${unidad.data.talle_motor.motor}, Num Serie: ${unidad.data.num_serie}`,75,156);
                }
            },
            didDrawPage: (datos) => {
                const pageSize = pdf.internal.pageSize;
                const pageHeight = (pageSize.getHeight()-35);

                // RECTANGULO IMPORTE CON LETRA, OBSERVACIONES Y TOTALES
                pdf.setFontSize(10);
                pdf.setFont("helvetica","normal");
                pdf.setTextColor(255,255,255);
                pdf.setDrawColor(0);
                pdf.setFillColor(164,22,22); // ROJO
                pdf.roundedRect(14,620,567,84,2,2,'F'); 
                pdf.setFillColor(255,255,255); // BLANCO
                pdf.roundedRect(457,622,122,80,2,2,'F');
                pdf.text('OBSERVACIONES',16,630);
                pdf.setFillColor(255,255,255); // BLANCO
                pdf.roundedRect(16,632,439,70,2,2,'F'); 
                pdf.setTextColor(0);
                pdf.text(data.observaciones,17,642);
                pdf.setTextColor(255,255,255);
                pdf.setTextColor(0);
                pdf.setFontSize(10);
                pdf.text('Subtotal',459,632);
                pdf.text('IVA',459,646);
                pdf.text('Retenciones',459,660);
                pdf.text('TOTAL',459,678);
                pdf.text(formatCurrency(data.subtotal),577,632,{align: 'right'});
                pdf.text(formatCurrency(data.impuestos),577,646,{align: 'right'});
                pdf.text(formatCurrency(data.retenciones),577,660,{align: 'right'});
                pdf.setFont("helvetica","bold");
                pdf.text(formatCurrency(data.total),577,678,{align: 'right'});
                pdf.setFont("helvetica","normal");

                let y = 720;
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Consideraciones Importantes', 14, y);
                y += 10;
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);

                notas.forEach(linea => {
                    const lines = pdf.splitTextToSize(linea, 570);
                    pdf.text(lines, 14, y,{align: 'justify'});
                    y += lines.length * 10;
                });
                pdf.setLineWidth(1);
                pdf.line(20,pageHeight - 20,580,pageHeight - 20);
                pdf.setFontSize(8);
                pdf.text('Página '+datos.doc.internal.getNumberOfPages()+' de '+totalPagesExp.trim(),20,pageHeight - 10);
            }
        });

        // Total page number plugin only available in jspdf v1.0+
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp)
        }

        return pdf.output("dataurlstring");
    }

    return {
        PDFNormal,
    }

}

export default useCotizacionFormatos;