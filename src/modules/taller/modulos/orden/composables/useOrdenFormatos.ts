import { ref } from 'vue';
import type { Orden } from '../interfaces/interfaces';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import JsBarcode from 'jsbarcode';
import { getAssetPath } from "@/core/helpers/assets";
import useUtilerias from '@/core/helpers/utilerias';

const useOrdenFormatos = (  ) => {
    const registro          = ref<Orden>({
        id:                     0,
        fecha_alta:             new Date(),
        folio:                  0,
        fecha_cierre:           null,
        serie:                  '',
        folio_documento_id:     0,
        cliente_id:             0,
        tecnico_id:             0,
        usuario_inicia_id:      0,
        usuario_cierra_id:      null,
        tipo_servicio_id:       0,
        mantenimiento_id:       null,
        unidad_id:              0,
        bahia_id:               0,
        kms:                    0,
        nivel_combustible:      0,
        otros_componentes:      '',
        fallas_reportadas:      '',
        falla_audio1:           '',
        falla_audio2:           '',
        costo_refacciones:      0,
        costo_miscelaneos:      0,
        costo_manoobra:         0,
        costo_otrostalleres:    0,
        estatus:                'Abierta',
        filepdf:                '',
        nota_proceso:           '',
        nota_cerrada:           '',
        nota_cancelada:         '',
        activo:                 true,
    });

    const { formatDateTime,convertTMZdate, convertTMZdatetime, convertTMZtime, formatNumber } = useUtilerias();

    // CONSTRUCCION PDF ORDEN DE SERVICIO VYTECHSERVICES
    const PDFBlanco = (data: Orden ) => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4"
        });
        // CONSTRUCCION PDF ENCABEZADO
        pdf.setLanguage("es-MX");
        pdf.addImage(getAssetPath('media/logos/logo_prodiesel_small.png'),'PNG',20,10,150,0,'LogoVyTech');
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
        pdf.setFontSize(14);
        pdf.setTextColor(0,0,0);
        pdf.setFont("helvetica","bold");
        pdf.text("contacto@vytechservices.com.mx",190,100);
        pdf.setFontSize(16);
        pdf.setTextColor(0,127,222);
        pdf.setFont("helvetica","bold");
        // CONSTRUCCION PDF NUMERO DE ORDEN DE SERVICIO
        pdf.text(`ORDEN DE SERVICIO NO. ${data.serie} - ${data.folio} `,155,130);

        //RECTANGULO ID INTERNO
        pdf.setDrawColor(0);
        pdf.setFillColor(216,216,216);
        pdf.setLineWidth(0.5)
        pdf.roundedRect(510,70,50,16,2,2,'FD'); 
        pdf.setFontSize(8);
        pdf.setFont("helvetica","regular");
        pdf.setTextColor(0,0,0);
        pdf.text("ID INTERNO",513,80);
        // NÚMERO ID
        pdf.setFillColor(255,255,255);
        pdf.setLineWidth(0.5)
        pdf.roundedRect(510,87,50,18,2,2,'FD'); 
        pdf.setFontSize(16);
        pdf.setFont("helvetica","regular");
        pdf.setTextColor(0,0,0);
        pdf.text(`${data.id}`,528,100);
        
        // CODIGO DE BARRA DEL ID
        // Generar el código de barras
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, data.id.toString(), {
            format: 'CODE128',
            displayValue: false,
            fontSize: 8,
        });

        // Convertir el canvas a una imagen
        const imgData = canvas.toDataURL('image/png');

        // Agregar la imagen del código de barras al PDF
        pdf.addImage(imgData, 'PNG', 470, 110, 100, 30);

        // CONSTRUCCION PDF DE CAMPOS DE LA ORDEN DE SERVICIO
        //NOMBRE
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0,0,0);
        pdf.text("NOMBRE:",20,170)
        //LINEA NOMBRE
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(85,170,400,170);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        //FECHA
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0,0,0);
        pdf.text("FECHA:",420,170)
        //LINEA FECHA
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(465,170,560,170);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // PRIMERA LINEA
        //NUM. ECO
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("NUM. ECO.:",20,190);
        // LINEA NUM. ECO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(80,190,200,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //MODELO
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MODELO:",220,190);
        //LINEA MODELO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(270,190,400,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //PLACAS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("PLACAS:",420,190);
        //LINEA PLACAS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(470,190,560,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // SEGUNDA LINEA
        //MARCA
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MARCA:",20,210);
        // LINEA MARCA
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(65,210,200,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //MOTOR
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MOTOR:",220,210);
        //LINEA MOTOR
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(265,210,400,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //KMS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("KMS.:",420,210);
        //LINEA KMS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(452,210,560,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // CHASIS, MOTOR
        //CHASIS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("SERIE DE CHASIS:",20,230);
        // LINEA CHASIS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(115,230,290,230);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //SERIE MOTOR
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("SERIE DE MOTOR:",300,230);
        //LINEA SERIE MOTOR
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(395,230,560,230);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // DESCRIPCION FALLA
        //DESCRIPCION
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("DESCRIPCIÓN DE LA FALLA:",20,250);
        // LINEA CHASIS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(165,250,560,250);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        // LINEAS TEXTO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,270,560,270);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,290,560,290);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,310,560,310);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,330,560,330);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,350,560,350);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,370,560,370);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,390,560,390);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,410,560,410);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // REPARACIONES EFECTUADAS
        //DESCRIPCION
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("REPARACIONES EFECTUADAS:",20,430);
        // LINEA REPARACIONES
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(175,430,560,430);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        // LINEAS TEXTO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,450,560,450);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,470,560,470);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,490,560,490);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,510,560,510);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,530,560,530);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,550,560,550);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // ORDEN, TECNICO
        //ORDEN
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("ABRE ORDEN:",20,590);
        // LINEA ORDEN
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(95,590,290,590);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //TÉCNICO
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("TÉCNICO:",300,590);
        //LINEA TÉCNICO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(355,590,560,590);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        //FIRMA CLIENTE
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("FIRMA DEL CLIENTE:",20,640);
        // LINEA ORDEN
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(130,640,320,640);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        // LOGO MEDIDOR
        pdf.addImage(getAssetPath('media/logos/medi_gas.png'),'jpg',430,595,100,0,'Medidor');

        //OBSERVACIONES
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("OBSERVACIONES:",20,670);
        // LINEA REPARACIONES
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(115,670,560,670);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        // LINEAS TEXTO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,690,560,690);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,710,560,710);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,730,560,730);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,750,560,750);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,770,560,770);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        return pdf.output("dataurlstring");
    }

    const PDFDatos  = (data: Orden ) => {
        let fallas:string[] = [];
        fallas = data.fallas_reportadas!.split('\n');
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4"
        });
        // CONSTRUCCION PDF ENCABEZADO
        pdf.setLanguage("es-MX");
        pdf.addImage(getAssetPath('media/logos/logo_prodiesel_small.png'),'PNG',20,10,150,0,'LogoVyTech');
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
        pdf.setFontSize(14);
        pdf.setTextColor(0,0,0);
        pdf.setFont("helvetica","bold");
        pdf.text("contacto@vytechservices.com.mx",190,100);
        pdf.setFontSize(16);
        pdf.setTextColor(0,127,222);
        pdf.setFont("helvetica","bold");
        // CONSTRUCCION PDF NUMERO DE ORDEN DE SERVICIO
        pdf.text(`ORDEN DE SERVICIO FOLIO. ${data.serie} - ${data.folio} `,155,130);

        //RECTANGULO ID INTERNO
        pdf.setDrawColor(0);
        pdf.setFillColor(216,216,216);
        pdf.setLineWidth(0.5)
        pdf.roundedRect(510,70,50,16,2,2,'FD'); 
        pdf.setFontSize(8);
        pdf.setFont("helvetica","regular");
        pdf.setTextColor(0,0,0);
        pdf.text("ID INTERNO",513,80);
        // NÚMERO ID
        pdf.setFillColor(255,255,255);
        pdf.setLineWidth(0.5)
        pdf.roundedRect(510,87,50,18,2,2,'FD'); 
        pdf.setFontSize(16);
        pdf.setFont("helvetica","regular");
        pdf.setTextColor(0,0,0);
        pdf.text(`${data.id}`,528,100);
        
        // CODIGO DE BARRA DEL ID
        // Generar el código de barras
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, data.id.toString(), {
            format: 'CODE128',
            displayValue: false,
            fontSize: 8,
        });

        // Convertir el canvas a una imagen
        const imgData = canvas.toDataURL('image/png');

        // Agregar la imagen del código de barras al PDF
        pdf.addImage(imgData, 'PNG', 470, 110, 100, 30);



        // CONSTRUCCION PDF DE CAMPOS DE LA ORDEN DE SERVICIO
        //NOMBRE
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0,0,0);
        pdf.text(`NOMBRE:     ${(data.adm_cliente!.tipo_persona == 'Moral' ? data.adm_cliente!.razon_social : (data.adm_cliente!.nombre)).substring(0, 48) }`,20,170)
        //LINEA NOMBRE
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(85,170,400,170);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        //FECHA
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0,0,0);
        pdf.text(`FECHA:`,420,170)
        pdf.text(`${convertTMZdatetime(data.fecha_alta.toString())}`,470,168)
        //LINEA FECHA
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(465,170,560,170);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // PRIMERA LINEA
        //NUM. ECO
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("NUM. ECO.:",20,190);
        pdf.text(`${data.talle_unidad!.unidad}`,80,188)
        // LINEA NUM. ECO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(80,190,200,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //MODELO
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MODELO:",220,190);
        pdf.text(`${data.talle_unidad!.talle_modelo.modelo}`,270,188)
        //LINEA MODELO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(270,190,400,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //PLACAS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("PLACAS:",420,190);
        //LINEA PLACAS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(470,190,560,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // SEGUNDA LINEA
        //MARCA
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MARCA:",20,210);
        pdf.text(`${data.talle_unidad!.talle_marca.marca}`,70,208)
        // LINEA MARCA
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(65,210,200,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //MOTOR
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MOTOR:",220,210);
        pdf.text(`${data.talle_unidad!.talle_motor.motor}`,270,208)
        //LINEA MOTOR
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(265,210,400,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //KMS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("KMS.:",420,210);
        pdf.text(`${formatNumber(data.kms)}`,460,208)
        //LINEA KMS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(452,210,560,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // CHASIS, MOTOR
        //CHASIS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("SERIE DE CHASIS:",20,230);
        // LINEA CHASIS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(115,230,290,230);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //SERIE MOTOR
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("SERIE DE MOTOR:",300,230);
        //LINEA SERIE MOTOR
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(395,230,560,230);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // DESCRIPCION FALLA
        //DESCRIPCION
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("DESCRIPCIÓN DE LA FALLA:",20,250);
        pdf.setFont("helvetica","normal");
        if (fallas?.length > 0) pdf.text(fallas[0],165,248);
        // LINEA CHASIS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(165,250,560,250);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        // LINEAS TEXTO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,270,560,270);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        if (fallas?.length > 1) pdf.text(fallas[1],20,268);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,290,560,290);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        if (fallas?.length > 2) pdf.text(fallas[2],20,288);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,310,560,310);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        if (fallas?.length > 3) pdf.text(fallas[3],20,308);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,330,560,330);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        if (fallas?.length > 4) pdf.text(fallas[4],20,328);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,350,560,350);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        if (fallas?.length > 5) pdf.text(fallas[5],20,348);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,370,560,370);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        if (fallas?.length > 6) pdf.text(fallas[6],20,368);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,390,560,390);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        if (fallas?.length > 7) pdf.text(fallas[7],20,388);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,410,560,410);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        if (fallas?.length > 8) pdf.text(fallas[8],20,408);

        // REPARACIONES EFECTUADAS
        //DESCRIPCION
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("REPARACIONES EFECTUADAS:",20,430);
        // LINEA REPARACIONES
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(175,430,560,430);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        // LINEAS TEXTO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,450,560,450);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,470,560,470);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,490,560,490);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,510,560,510);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,530,560,530);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,550,560,550);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // ORDEN, TECNICO
        //ORDEN
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("ABRE ORDEN:",20,590);
        pdf.text(`${data.conf_usuario!.usuario}`,100,588);
        // LINEA ORDEN
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(95,590,290,590);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //TÉCNICO
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("TÉCNICO:",300,590);
        pdf.text(`${data.talle_tecnico!.tecnico}`,360,588);
        //LINEA TÉCNICO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(355,590,560,590);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        //FIRMA CLIENTE
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("FIRMA DEL CLIENTE:",20,640);
        // LINEA ORDEN
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(130,640,320,640);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        // LOGO MEDIDOR
        pdf.addImage(getAssetPath('media/logos/medi_gas.png'),'jpg',430,595,100,0,'Medidor');

        //OBSERVACIONES
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("OBSERVACIONES:",20,670);
        // LINEA REPARACIONES
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(115,670,560,670);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        // LINEAS TEXTO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,690,560,690);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,710,560,710);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,730,560,730);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,750,560,750);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(20,770,560,770);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        return pdf.output("dataurlstring");
    }

    const PDFDatosInterno = (data: any,refa: any) => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4"
        });
        // CONSTRUCCION PDF ENCABEZADO
        pdf.setLanguage("es-MX");
        pdf.addImage(getAssetPath('media/logos/logo_prodiesel_small.png'),'PNG',20,10,150,0,'LogoVyTech');
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
        pdf.setFontSize(14);
        pdf.setTextColor(0,0,0);
        pdf.setFont("helvetica","bold");
        pdf.text("contacto@vytechservices.com.mx",190,100);
        pdf.setFontSize(16);
        pdf.setTextColor(0,127,222);
        pdf.setFont("helvetica","bold");
        // CONSTRUCCION PDF NUMERO DE ORDEN DE SERVICIO
        pdf.text(`ORDEN DE SERVICIO NO. ${data.serie} - ${data.folio} `,155,130);

        //RECTANGULO ID INTERNO
        pdf.setDrawColor(0);
        pdf.setFillColor(216,216,216);
        pdf.setLineWidth(0.5)
        pdf.roundedRect(510,70,50,16,2,2,'FD'); 
        pdf.setFontSize(8);
        pdf.setFont("helvetica","regular");
        pdf.setTextColor(0,0,0);
        pdf.text("ID INTERNO",513,80);
        // NÚMERO ID
        pdf.setFillColor(255,255,255);
        pdf.setLineWidth(0.5)
        pdf.roundedRect(510,87,50,18,2,2,'FD'); 
        pdf.setFontSize(16);
        pdf.setFont("helvetica","regular");
        pdf.setTextColor(0,0,0);
        pdf.text(`${data.id}`,528,100);
        
        // CODIGO DE BARRA DEL ID
        // Generar el código de barras
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, data.id.toString(), {
            format: 'CODE128',
            displayValue: false,
            fontSize: 8,
        });

        // Convertir el canvas a una imagen
        const imgData = canvas.toDataURL('image/png');

        // Agregar la imagen del código de barras al PDF
        pdf.addImage(imgData, 'PNG', 470, 110, 100, 30);


        // CONSTRUCCION PDF DE CAMPOS DE LA ORDEN DE SERVICIO
        //NOMBRE
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0,0,0);
        pdf.text(`NOMBRE:     ${(data.adm_cliente!.tipo_persona == 'Moral' ? data.adm_cliente!.razon_social : (data.adm_cliente!.nombre)).substring(0, 48)}`,20,170)
        //LINEA NOMBRE
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(85,170,400,170);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        //FECHA
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0,0,0);
        pdf.text(`FECHA:`,420,170)
        pdf.text(`${convertTMZdatetime(data.fecha_alta.toString())}`,470,168)
        //LINEA FECHA
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(465,170,560,170);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // PRIMERA LINEA
        //NUM. ECO
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("NUM. ECO.:",20,190);
        pdf.text(`${data.talle_unidad!.unidad}`,80,188)
        // LINEA NUM. ECO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(80,190,200,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //MODELO
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MODELO:",220,190);
        pdf.text(`${data.talle_unidad!.talle_modelo.modelo}`,270,188)
        //LINEA MODELO
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(270,190,400,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //PLACAS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("PLACAS:",420,190);
        //LINEA PLACAS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(470,190,560,190);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // SEGUNDA LINEA
        //MARCA
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MARCA:",20,210);
        pdf.text(`${data.talle_unidad!.talle_marca.marca}`,70,208)
        // LINEA MARCA
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(65,210,200,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //MOTOR
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("MOTOR:",220,210);
        pdf.text(`${data.talle_unidad!.talle_motor.motor}`,270,208)
        //LINEA MOTOR
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(265,210,400,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //KMS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("KMS.:",420,210);
        pdf.text(`${formatNumber(data.kms)}`,460,208)
        //LINEA KMS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(452,210,560,210);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // CHASIS, MOTOR
        //CHASIS
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("SERIE DE CHASIS:",20,230);
        // LINEA CHASIS
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(115,230,290,230);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        //SERIE MOTOR
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);
        pdf.text("SERIE DE MOTOR:",300,230);
        //LINEA SERIE MOTOR
        pdf.setDrawColor(0);
        pdf.setDrawColor(0,0,0);
        pdf.setLineWidth(1);
        pdf.line(395,230,560,230);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0,0,0);

        // TABLA DE TRABAJOS //
         
        pdf.setDrawColor(0);
        pdf.setFillColor(77,77,77);
        pdf.roundedRect(15, 240, 570, 14,3,3,'F');
        pdf.setFontSize(10);
        pdf.setTextColor(255,255,255);
        pdf.setFont("helvetica","bold");
        pdf.text("TRABAJOS",255,250); 
        const encabezados = [
            {title:'ID',dataKey: 'id'},
            {title:'DIVISIÓN',dataKey: ''},
            {title:'DESCRIPCIÓN',dataKey: `talle_trabajo`},
            {title:'TÉCNICO',dataKey: ''},
            {title:'HORAS',dataKey: 'horas_estandar'},
            {title:'ESTATUS',dataKey: 'estatus'},
        ];

        const trabajos:any[] = [];

        data.talle_orden_trabajos.forEach(item => {
            trabajos.push([
                formatNumber(item.id),
                item.talle_trabajo.talle_division.descripcion,
                item.talle_trabajo.descripcion,
                item.talle_tecnico.nombres,
                formatNumber(item.horas_estandar),
                item.estatus
            ]);
        });

        autoTable(pdf,{
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
                0: {halign: 'center'},
                1: {halign: 'left'},
                2: {halign: 'left'},
                3: {halign: 'left'},
                4: {halign: 'right'},
                5: {halign: 'left'},
            },
            head: [['ID','DIVISIÓN','DESCRIPCIÓN','TÉCNICO','HORAS','ESTATUS']],
            body: trabajos,
            startY: 255,
            pageBreak: 'auto',
            margin: { left: 15, right: 10 },
        });
        
        // TABLA DE REFACCIONES
        const refacciones:any[] = [];
        refa.forEach((item2: any) => {
            refacciones.push([
                formatNumber(item2.id),
                formatNumber(item2.trabajo_id),
                formatNumber(item2.requisicion_id),
                item2.inv_producto.codigo,
                item2.descripcion,
                item2.cantidad,
            ]);
        });
        
        let posY = (pdf as any).lastAutoTable.finalY;
        pdf.setDrawColor(0);
        pdf.setFillColor(77,77,77);
        pdf.roundedRect(15, posY+10, 573, 14,3,3,'F');
        pdf.setFontSize(10);
        pdf.setTextColor(255,255,255);
        pdf.setFont("helvetica","bold");
        pdf.text("REFACCIONES",255, posY+20); 
        autoTable(pdf,{
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
                0: {halign: 'center'},
                1: {halign: 'center'},
                2: {halign: 'center'},
                3: {halign: 'left'},
                4: {halign: 'left'},
                5: {halign: 'right'},
            },
            head: [['ID','ID TRAB','FOLIO REQ','CÓDIGO','DESCRIPCIÓN','CANT.SOLICiTADA']],
            body: refacciones,
            pageBreak: 'auto',
            startY: posY+25,
            margin: { left: 15, right: 7 },
        });

        // TABLA DE MISCELANEOS
        const miscelaneos:any[] = [];
        data.talle_orden_miscelaneos.forEach((item2: any) => {
            miscelaneos.push([
                formatNumber(item2.id),
                item2.descripcion,
                item2.cantidad,
            ]);
        });
        
        posY = (pdf as any).lastAutoTable.finalY;
        pdf.setDrawColor(0);
        pdf.setFillColor(77,77,77);
        pdf.roundedRect(15, posY+10, 573, 14,3,3,'F');
        pdf.setFontSize(10);
        pdf.setTextColor(255,255,255);
        pdf.setFont("helvetica","bold");
        pdf.text("MISCELANEOS / MATERIALES DIVERSOS ",185, posY+20); 

        autoTable(pdf, {
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
                0: {halign: 'center'},
                3: {halign: 'left'},
                5: {halign: 'right'},
            },
            head: [['ID','DESCRIPCIÓN','CANTIDAD']],
            body: miscelaneos,
            pageBreak: 'auto',
            startY: posY+25,
            margin: { left: 15, right: 7 },
        });

        return pdf.output("dataurlstring");
    }

    return {
        PDFBlanco,
        PDFDatos,
        PDFDatosInterno,
    }
}

export default useOrdenFormatos;