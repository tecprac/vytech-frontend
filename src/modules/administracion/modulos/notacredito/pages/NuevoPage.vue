<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import type { Documento } from '@/modules/administracion/modulos/factura/interfaces/interfaces';
import useDocumento from '../composables/useDocumento';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Checkbox from 'primevue/checkbox';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AutoComplete from 'primevue/autocomplete';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import Toolbar from 'primevue/toolbar';
import ProgressSpinner from 'primevue/progressspinner';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Divider from 'primevue/divider';
import useUtilerias from '@/core/helpers/utilerias';
import VuePdfEmbed from 'vue-pdf-embed'
import { PrettyXml } from 'pretty-xml-vue3';

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import "pretty-xml-vue3/style.css"

const router  = useRouter();
const toast   = useToast();
const auth    = useAuthStore();
const confirm = useConfirm();

const { sumarDias,formatCurrency } = useUtilerias();

const {
    isPending,
    registro,
    tabActiva,
    isError,
    isAdding,
    isAddingSuccess,
    isUpdating,
    isUpdatingSuccess,
    foliosdoctos,
    selecfoliodocto,
    selectcliente,
    agentes,
    selectagente,
    propietarios,
    selectpropietario,
    almacenes,
    selectalmacen,
    clientesfiltrados,
    selecttrabajo,
    trabajosfiltrados,
    monedas,
    selectmoneda,
    documento_detalles,
    documento_detalles2,
    documento_detalle,
    selectproducto,
    productosfiltrados,
    dialogDetalle,
    tipo_detalle,
    tipo_detalle_operacion,
    formaspago,
    metodospago,
    usoscfdi,
    selectformapago,
    selectmetodopago,
    selectusocfdi,
    imp_descuento,
    selectalmacen_det,
    isUpdatingDetalle,
    dialogRelacionados,
    dialogRelacionados_det,
    documento_relacionado,
    documentos_relacionados,
    tipo_docto_relacionado,
    tiporelaciones,
    bTimbrando,
    dialogCancelacion,
    documento_cfdi,
    dialogPDFVisor,
    dialogXMLVisor,
    pdfDocumento,
    pdfViewer,
    
    newRegistro,
    updateRegistro,
    cambiaDocumento,
    cambiaMoneda,
    buscarClientes,
    buscarProductos,
    buscarTrabajos,
    seleccionCliente,
    seleccionDetalle,
    openDialogDetalle,
    closeDialogDetalle,
    eliminaDetalle,
    CalculaImportes,
    openDialogRelacionados,
    openDialogRelacionadosDet,
    closeDialogRelacionadoDet,
    eliminaRelacionado,
    botonRegresar,
    timbrarFactura,
    cancelarFactura,
    VisualizarPDF,
    VisualizarXML,
    RegenerarPDF,
    enviarCFDI,
    cerrarVisualizarPDF,
    cerrarVisualizarXML,
    downloadXML,
} = useDocumento(0);

const validarDatos = async(data: Documento) => {
    if (data.folio == 0) {
        toast.add({ severity:   'error',summary:    'Verificar',
            detail: 'No hay Folio de Documento asignado',life: 3500
        });
        return;
    }
    try {
        if (selectcliente.value.id == 0) {
            toast.add({ severity:   'error',summary:    'Verificar',
                detail: 'Debe seleccionar una Cliente',life: 3500
            });
            return;
        }    
    } catch (error) {
        toast.add({ severity:   'error', summary:    'Verificar',
            detail: 'Debe seleccionar un Cliente ', life: 3500});
        return;
    }
    data.folio_documento_id = selecfoliodocto.value.id
    data.cliente_id         = selectcliente.value.id;
    data.usuario_id         = auth.user.id;
    data.agente_id          = selectagente.value.id;
    data.almacen_id         = selectalmacen.value.id;
    data.formapago_id       = selectformapago.value.id;
    data.metodopago_id      = selectmetodopago.value.id;
    data.usocfdi_id         = selectusocfdi.value.id;
    data.moneda_id          = selectmoneda.value.id;
    data.propietario_id     = selectpropietario.value.id;
    data.lugarexpedicion    = selectpropietario.value.cp;
    data.fecha              = new Date();
    data.fecha_vence        = sumarDias( data.fecha , +selectcliente.value.dias_credito);
    if (data.id == 0)
        newRegistro(data);
    if (data.id > 0)
        updateRegistro(data);
}

</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Nueva Nota de Crédito</h2>
    </div>
    <div v-if="registro">
        <form @submit.prevent="validarDatos(registro)">
            <div class="card-body border-0 pt-0 pb-0">
                <Toolbar style="border-radius: 1rem; padding: 1rem 1rem 1rem 1.5rem;" class="bg-secondary" size="small">
                    <template #start>
                        <Button
                            severity="secondary" label="Regresar" size="small"
                            class="ms-2" raised icon="pi pi-arrow-left"
                            @click="botonRegresar">
                        </Button>
                        <Button v-if="registro.id == 0" raised icon="pi pi-plus" class="ms-2" severity="success" label="Crear"
                            @click="validarDatos(registro)" size="small" :loading="isAdding || isUpdating"
                            :disabled="registro.estatus != 'SinAplicar'">
                        </Button>
                        <Button v-if="registro.id > 0" raised icon="pi pi-plus" class="ms-2" severity="success" label="Guardar"
                            @click="validarDatos(registro)" size="small"
                            :disabled="registro.estatus != 'SinAplicar'">
                        </Button>
                        <Button v-if="registro.id > 0" raised icon="pi-sort-alt-slash" class="ms-2" severity="info" label="Relacionar CFDI's"
                            size="small" @click="openDialogRelacionados"
                            :badge="documentos_relacionados.length.toString()"
                            :disabled="registro.estatus != 'SinAplicar'">
                        </Button>
                        <Button v-if="registro.id > 0" raised icon="pi-qrcode" class="ms-2 text-black" severity="warn" label="Timbrar"
                            size="small" @click="timbrarFactura" :loading="bTimbrando"
                            :disabled="registro.estatus != 'SinAplicar'">
                        </Button>
                    </template>
                    <template #end>

                    </template>
                </Toolbar>
                <div class="row mt-4 mb-2">
                    <label for="id" class="col-form-label col-sm-1">ID</label>
                    <div class="col-sm-1">
                        <InputNumber id="id" v-model="registro.id" disabled fluid 
                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <label for="tipo_documento" class="col-form-label col-sm-2">Documento</label>
                    <div class="col-sm-2">
                        <Select
                            v-model="selecfoliodocto" :options="foliosdoctos"
                            option-label="documento" fluid :disabled="registro.id > 0" 
                            @change="cambiaDocumento" variant="filled">
                        </Select>
                    </div>
                    <label for="folio" class="col-form-label col-sm-1">Folio</label>
                    <div class="col-sm-1">
                        <InputNumber v-model="registro.folio" fluid disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <label for="serie" class="col-form-label col-sm-1">Serie</label>
                    <div class="col-sm-1">
                        <InputText v-model="registro.serie" fluid disabled>
                        </InputText>
                    </div>
                    <label for="serie" class="col-form-label col-sm-1">Estatus</label>
                    <div class="col-sm-1">
                        <Button
                            :label="registro.estatus" raised size="small"
                            :severity="registro.estatus=='SinAplicar' ? 'info' : 
                                            registro.estatus=='Timbrado' ? 'success' :
                                            registro.estatus=='Aplicado' ? 'warn' :
                                            registro.estatus=='Cancelado' ? 'danger' : 'success' ">
                        </Button>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="cliente" class="required col-form-label col-sm-1">Cliente</label>
                    <div class="col-sm-5">
                        <AutoComplete
                            v-model="selectcliente"
                            :option-label="(data) => {return (data.tipo_persona == 'Moral' ? data.razon_social : data.nombres+' '+data.apaterno+' '+data.amaterno)+' RFC:'+data.rfc}"
                            :suggestions="clientesfiltrados"
                            force-selection :chip-Icon="true"
                            auto-option-focus 
                            empty-search-message="No existen clientes que coincidan"
                            empty-selection-message="No se ha seleccionado un cliente"
                            placeholder="Capture un cliente por RFC, Nombre o Razón Social"
                            @complete="buscarClientes" fluid
                            @option-select="seleccionCliente"
                            :disabled="registro.id > 0" >
                        </AutoComplete>
                    </div>
                    <label for="moneda" class="col-form-label col-sm-1">Moneda</label>
                    <div class="col-sm-2">
                        <Select
                            v-model="selectmoneda" :options="monedas"
                            option-label="descripcion" fluid 
                            @change="cambiaMoneda" variant="filled">
                        </Select>
                    </div>
                    <label for="tipocambio" class="col-form-label col-sm-1">TC</label>
                    <div class="col-sm-2">
                        <InputNumber v-model="registro.tipocambio" :min="0.0000" :max="99.9999" 
                            mode="currency" currency="USD" locale="en-US" fluid 
                            :min-fraction-digits="4" :max-fraction-digits="4" disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                </div>
                <Tabs  value="0" @update:value="( value:string | number) => { tabActiva = value.toString() }">
                    <TabList>
                        <Tab :disabled="registro.id == 0" value="0" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-list" style="color: slateblue"></i>
                            Refacciones/Servicios
                        </Tab>
                        <Tab :disabled="registro.id == 0" value="1" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-user-plus" style="color: slateblue"></i>
                            Generales
                        </Tab>
                        <Tab :disabled="registro.id == 0" value="2" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '2' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-id-card" style="color: slateblue"></i>
                            Información Adicional
                        </Tab>
                        <Tab :disabled="registro.id == 0" value="3" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '3' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-user-plus" style="color: slateblue"></i>
                            Cliente
                        </Tab>
                        <Tab v-if="registro.estatus == 'Timbrado'" :disabled="registro.id == 0" value="4" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '4' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-qrcode" style="color: slateblue"></i>
                            Timbrado
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel v-if="registro.id > 0" value="0">
                            <div class="row mb-4">
                                <div class="col-sm-2">
                                    <Button label="Productos/Refacciones" raised icon="pi pi-plus" severity="success" size="small"
                                        class="ms-2" fluid
                                        @click="openDialogDetalle(0,'Producto','Create')"
                                        :disabled="registro.estatus != 'SinAplicar'">
                                    </Button>
                                </div>
                                <div class="col-sm-2">
                                    <Button label="Servicios/Trabajos" raised icon="pi pi-plus" severity="success" size="small" fluid
                                        @click="openDialogDetalle(0,'Servicio','Create')"
                                        :disabled="registro.estatus != 'SinAplicar'">
                                    </Button>
                                </div>
                            </div>
                            <DataTable :value="documento_detalles2"
                                show-gridlines scroll-height="300px" size="small" scrollable>
                                <Column header="ID" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="slotProps">
                                        {{ slotProps.data[0].id }}
                                    </template>
                                </Column>
                                <Column header="TIPO" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="slotProps">
                                        {{ slotProps.data[0].tipo_partida }}
                                    </template>
                                </Column>
                                <Column header="CODIGO" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="slotProps">
                                        {{ slotProps.data[1].codigo }}
                                    </template>
                                </Column>
                                <Column header="DESCRIPCIÓN" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="slotProps">
                                        {{ slotProps.data[0].descripcion }}
                                    </template>
                                </Column>
                                <Column header="CANTIDAD" class="text-end" :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                                    <template #body="slotProps">
                                        {{ slotProps.data[0].cantidad }}
                                    </template>
                                </Column>
                                <Column header="PRECIO" class="text-end" :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                                    <template #body="slotProps">
                                        {{ formatCurrency(+slotProps.data[0].precio) }}
                                    </template>
                                </Column>
                                <Column header="DESCUENTOS" class="text-end" :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                                    <template #body="slotProps">
                                        {{ formatCurrency(+slotProps.data[0].descuento) }}
                                    </template>
                                </Column>
                                <Column header="IMPORTE" class="text-end" :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                                    <template #body="slotProps">
                                        {{ formatCurrency(+slotProps.data[0].importe_final) }}
                                    </template>
                                </Column>
                                <Column header="ACCIONES" :pt="{ headerCell: { class: 'bg-secondary text-center'}, root: { class: 'text-center'} }">
                                    <template #body="{ data }">
                                        <Button
                                            severity="info"
                                            raised rounded size="small"
                                            icon="pi pi-search"
                                            v-tooltip.top="{ 
                                                value:      'Consulta el concepto de la factura',
                                                showDelay:  1000,
                                            }" class="me-2"
                                            @click="openDialogDetalle(data[0].id,data[0].tipo_partida,'Show')">
                                        </Button>
                                        <Button v-if="registro.estatus=='SinAplicar'"
                                            severity="warn"
                                            raised rounded size="small" icon="pi pi-pen-to-square"
                                            v-tooltip.top="{ 
                                                value:      'Edita el concepto de la factura',
                                                showDelay:  1000,
                                            }" class="me-2"
                                            @click="openDialogDetalle(data[0].id,data[0].tipo_partida,'Update')">
                                        </Button>
                                        <Button v-if="registro.estatus=='SinAplicar'"
                                            severity="danger"
                                            raised rounded size="small"
                                            icon="pi pi-trash"
                                            v-tooltip.top="{ 
                                                value:      'Eliminar el concepto de la factura',
                                                showDelay:  1000,
                                            }"
                                            @click="eliminaDetalle($event,data)">
                                        </Button>
                                    </template>
                                </Column>
                            </DataTable>
                        </TabPanel>
                        <TabPanel value="1">
                            <div class="row mt-2 mb-2">
                                <label for="emisor" class="required col-form-label col-sm-2">
                                    Emisor
                                </label>
                                <div class="col-sm-4">
                                    <Select
                                        v-model="selectpropietario" fluid 
                                        :options="propietarios" variant="filled"
                                        :option-label="(data) => {return (data.tipo_persona == 'Moral' ? data.razon_social : data.nombres+' '+data.apaterno+' '+data.amaterno)+' RFC:'+data.rfc}"
                                        placeholder="Seleccione un Emisor"
                                        :disabled="registro.estatus != 'SinAplicar'">
                                    </Select>
                                </div>
                                <label for="expedicion" class="required col-form-label col-sm-2">
                                    Lugar de Expedición
                                </label>
                                <div class="col-sm-1">
                                    <InputText v-model:model-value="selectpropietario.cp" disabled fluid>
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="emisor" class="required col-form-label col-sm-2">
                                    Almacén
                                </label>
                                <div class="col-sm-4">
                                    <Select
                                        v-model="selectalmacen"
                                        fluid 
                                        :options="almacenes" variant="filled"
                                        option-label="nombre"
                                        placeholder="Seleccione un Almacén"
                                        :disabled="registro.estatus != 'SinAplicar'">
                                    </Select>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="emisor" class="required col-form-label col-sm-2">
                                    Agente/Vendedor
                                </label>
                                <div class="col-sm-4">
                                    <Select
                                        v-model="selectagente"
                                        fluid 
                                        :options="agentes" variant="filled"
                                        option-label="nombre"
                                        placeholder="Seleccione un Almacén"
                                        :disabled="registro.estatus != 'SinAplicar'">
                                    </Select>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">
                            <Accordion :value="['0']" multiple>
                                <AccordionPanel value="0">
                                    <AccordionHeader class="bg-secondary">Anexo 20 CFDI</AccordionHeader>
                                    <AccordionContent>
                                        <div class="row mt-2 mb-2">
                                                <label for="formapago" class="required col-form-label col-sm-2">
                                                    Forma de Pago
                                                </label>
                                                <div class="col-sm-4">
                                                    <Select
                                                        v-model="selectformapago"
                                                        fluid 
                                                        :options="formaspago" variant="filled"
                                                        :option-label="(data) => data.c_formapago+' '+data.descripcion"
                                                        placeholder="Seleccione una Forma de Pago"
                                                        :disabled="registro.estatus != 'SinAplicar'">
                                                    </Select>                                                
                                                </div>
                                                <label for="complementocp" class="col-form-label col-sm-3">
                                                    Complemento Carta Porte
                                                </label>
                                                <div class="col-sm-1">
                                                    <Checkbox
                                                        v-model="registro.carta_porte" binary
                                                        input-id="complementocp" fluid :disabled="registro.estatus != 'SinAplicar'">
                                                    </Checkbox>
                                                </div>
                                            </div>
                                            <div class="row mb-2">
                                                <label for="metodopago" class="required col-form-label col-sm-2">
                                                    Metodo Pago
                                                </label>
                                                <div class="col-sm-4">
                                                    <Select
                                                        v-model="selectmetodopago"
                                                        fluid variant="filled"
                                                        :options="metodospago"
                                                        :option-label="(data) => data.c_metodopago+' '+data.descripcion"
                                                        placeholder="Seleccione un Metodo de Pago"
                                                        :disabled="registro.estatus != 'SinAplicar'">
                                                    </Select>                                                
                                                </div>
                                            </div>
                                            <div class="row mb-2">
                                                <label for="usocfdi" class="required col-form-label col-sm-2">
                                                    Uso de CFDI
                                                </label>
                                                <div class="col-sm-4">
                                                    <Select
                                                        v-model="selectusocfdi"
                                                        fluid variant="filled"
                                                        :options="usoscfdi"
                                                        :option-label="(data) => data.c_usocfdi+' '+data.descripcion"
                                                        placeholder="Seleccione un Uso del CFDI"
                                                        :disabled="registro.estatus != 'SinAplicar'">
                                                    </Select>                                                
                                                </div>
                                            </div>
                                    </AccordionContent>
                                </AccordionPanel>
                            </Accordion>
                        </TabPanel>
                        <TabPanel value="3">
                            <div class="row mb-2">
                                <div class="col-sm-4 fv-row">
                                    <label for="pais" class="required form-label fw-semibold">
                                        País
                                    </label>
                                    <InputText v-if="selectcliente && selectcliente.sat_pai" 
                                        v-model="selectcliente.sat_pai.pais" fluid disabled>
                                    </InputText>
                                </div>
                                <div class="col-sm-2 fv-row">
                                    <label for="cp" class="required form-label fw-semibold">
                                        C.P:
                                    </label>
                                    <InputText v-if="selectcliente"
                                        v-model="selectcliente.cp" fluid size="small" disabled>
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4 fv-row">
                                    <label for="estado" class="required form-label fw-semibold">
                                        Estado
                                    </label>
                                    <InputText v-if="selectcliente && selectcliente.sat_estado"
                                        v-model="selectcliente.sat_estado.estado" fluid size="small" disabled>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="municipio" class="form-label fw-semibold">
                                        Municipio
                                    </label>
                                    <InputText v-if="selectcliente"
                                        v-model="selectcliente.municipio" fluid size="small" disabled>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="ciudad" class="form-label fw-semibold">
                                        Ciudad
                                    </label>
                                    <InputText v-if="selectcliente"
                                        v-model="selectcliente.ciudad" fluid size="small" disabled>
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-6 fv-row">
                                    <label for="colonia" class="form-label fw-semibold">
                                        Colonia
                                    </label>
                                    <InputText v-if="selectcliente"
                                        v-model="selectcliente.colonia" fluid size="small" disabled>
                                    </InputText>
                                </div>
                                <div class="col-sm-6 fv-row">
                                    <label for="calle" class="form-label fw-semibold">
                                        Calle y Numero
                                    </label>
                                    <InputText v-if="selectcliente"
                                        v-model="selectcliente.calle" size="small" fluid disabled>
                                    </InputText>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="4">
                            <template v-if="documento_cfdi">
                                <div class="row mb-2">
                                    <div class="col-sm-4 fv-row">
                                        <label for="UUID" class="form-label fw-semibold">
                                            UUID
                                        </label>
                                        <InputText v-model="documento_cfdi.uuid" fluid disabled>
                                        </InputText>
                                    </div>
                                    <div class="col-sm-2 fv-row">
                                        <label for="fechatimbrado" class="form-label fw-semibold">
                                            Fecha Timbrado:
                                        </label>
                                        <InputText v-model="documento_cfdi.fechatimbrado" fluid disabled>
                                        </InputText>
                                    </div>
                                    <div class="col-sm-2 fv-row">
                                        <label for="Estado" class="form-label fw-semibold">
                                            Estado
                                        </label>
                                        <InputText v-model="documento_cfdi.estatus" fluid disabled>
                                        </InputText>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-sm-2">
                                        <Button
                                            label="Ver PDF"
                                            @click="VisualizarPDF(documento_cfdi.filepdf)"
                                            icon="pi pi-file-pdf"
                                            severity="primary" size="small" raised>
                                        </Button>
                                    </div>
                                    <div class="col-sm-2">
                                        <Button
                                            label="Ver XML"
                                            @click="VisualizarXML(documento_cfdi.filexml)"
                                            icon="pi pi-code"
                                            severity="primary" size="small" raised>
                                        </Button>
                                    </div>
                                    <div class="col-sm-2">
                                        <Button
                                            label="Regenerar PDF"
                                            @click="RegenerarPDF"
                                            icon="pi pi-file-pdf"
                                            severity="success" size="small" raised>
                                        </Button>
                                    </div>
                                    <div class="col-sm-2">
                                        <Button
                                            label="Enviar CFDI"
                                            @click="enviarCFDI"
                                            icon="pi pi-envelope"
                                            severity="info" size="small" raised>
                                        </Button>
                                    </div>
                                </div>
                            </template>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <Divider></Divider>
                <!-- TOTALES Y NOTAS DE LA FACTURA -->
                <div class="row mb-2">
                    <div class="col-sm-8">
                        <div class="row">
                            <label for="observaciones" class="col-form-label col-form-label-sm col-sm-7"></label>
                            <label for="observaciones" class="col-form-label col-sm-2">Descuento</label>
                            <div class="col-sm-3">
                                <InputNumber v-model="registro.descuentos" :min="0.00" :max="99999999.99" 
                                    mode="currency" currency="USD" locale="en-US" fluid 
                                    :min-fraction-digits="2" :max-fraction-digits="2" disabled
                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                                </InputNumber>
                            </div>
                        </div>
                        <div class="row">
                            <label for="observaciones" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
                            <div class="col-sm-12">
                                <Textarea v-model="registro.observaciones" rows="3" fluid
                                :disabled="registro.estatus != 'SinAplicar'">
                                </Textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="row">
                            <label for="subtotal" class="col-form-label col-sm-6">Subtotal</label>
                            <div class="col-sm-6">
                                <InputNumber v-model="registro.subtotal" :min="0.00" :max="99999999.99" 
                                    mode="currency" currency="USD" locale="en-US" fluid 
                                    :min-fraction-digits="2" :max-fraction-digits="2" disabled
                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                                </InputNumber>
                            </div>
                        </div>
                        <div class="row">
                            <label for="impuestos" class="col-form-label col-sm-6">Impuestos</label>
                            <div class="col-sm-6">
                                <InputNumber v-model="registro.impuestos" :min="0.00" :max="99999999.99" 
                                    mode="currency" currency="USD" locale="en-US" fluid 
                                    :min-fraction-digits="2" :max-fraction-digits="2" disabled
                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                                </InputNumber>
                            </div>
                        </div>
                        <div class="row">
                            <label for="retenciones" class="col-form-label col-sm-6">Retenciones</label>
                            <div class="col-sm-6">
                                <InputNumber v-model="registro.retenciones" :min="0.00" :max="99999999.99" 
                                    mode="currency" currency="USD" locale="en-US" fluid 
                                    :min-fraction-digits="2" :max-fraction-digits="2" disabled
                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                                </InputNumber>
                            </div>
                        </div>
                        <div class="row">
                            <label for="total" class="col-form-label col-sm-6">TOTAL</label>
                            <div class="col-sm-6">
                                <InputNumber v-model="registro.total" :min="0.00" :max="99999999.99" 
                                    mode="currency" currency="USD" locale="en-US" fluid 
                                    :min-fraction-digits="2" :max-fraction-digits="2" disabled
                                    :pt="{ pcInputText: { root:{ class: 'text-end fw-bold text-primary'}} }">
                                </InputNumber>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- DIALOGO DOCUMENTOS RELACIONADOS DETALLE -->
    <Dialog
        v-model:visible="dialogRelacionados_det"
        modal :closable="false"
        header="Agregar Documento Relacionado"
        :style="{width: '60vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }">
        <div class="row mt-2 mb-2">
            <label for="origen" class="required col-form-label col-form-label-sm col-sm-2">Origen</label>
            <div class="col-sm-2">
                <Select
                    v-model="documento_relacionado.origen" :options="tipo_docto_relacionado"
                    fluid :disabled="documento_relacionado.origen.trim().length > 0" 
                    variant="filled" id="origen">
                </Select>
            </div>
        </div>
        <div class="row mb-2">
            <label for="tiporelacion" class="required col-form-label col-form-label-sm col-sm-2">Tipo de Relación</label>
            <div class="col-sm-6">
                <Select
                    v-model="documento_relacionado.tiporelacion_id" :options="tiporelaciones"
                    :option-label="(data) => {return (data.c_tiporelacion + ' '+ data.descripcion) }"
                    option-value="id" fluid  
                    variant="filled" id="tiporelacion">
                </Select>
            </div>
        </div>
        <div class="row mb-2">
            <label for="tiporelacion" class="required col-form-label col-form-label-sm col-sm-2">UUID</label>
            <div class="col-sm-6">
                <InputMask
                    v-model="documento_relacionado.uuid" fluid
                    mask="********-****-****-****-************"
                    placeholder="????????-????-????-????-????????????">
                </InputMask>
            </div>
        </div>
        <template #footer>
            <Button 
                label="Cerrar" raised
                severity="secondary"
                icon="pi pi-times"
                @click="closeDialogRelacionadoDet('cerrar')"
                :pt="{ root: { class: 'mt-2'} }">
            </Button>
            <Button v-if="tipo_detalle_operacion != 'Show'"
                label="Guardar" raised
                severity="success"
                :loading="isUpdatingDetalle"
                @click="closeDialogRelacionadoDet('guardar')"
                :pt="{ root: { class: 'mt-2'} }">
            </Button>
        </template>
    </Dialog>     
    <!-- DIALOGO DOCUMENTOS RELACIONADOS -->
    <Dialog
        v-model:visible="dialogRelacionados"
        modal :closable="false" position="top"
        header="Documentos Relacionados"
        :style="{width: '70vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }">
        <div class="row mt-2 mb-2">
            <div class="col-sm-3">
                <Button v-if="registro.estatus != 'Timbrado' && registro.estatus != 'Cancelado'"
                    label="Agregar Documento" raised icon="pi pi-plus" severity="success"
                    class="ms-2" fluid
                    @click="openDialogRelacionadosDet">
                </Button>
            </div>
        </div>
        <div class="row mb-2">
            <DataTable :value="documentos_relacionados"
            >
                <Column field="id" header="ID"
                    :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                </Column>
                <Column field="origen" header="ORIGEN"
                    :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                </Column>
                <Column header="TIPO RELACIÓN"
                    :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                    <template #body="{data}">
                        {{ data.sat_tiporelacion.c_tiporelacion+' '+data.sat_tiporelacion.descripcion }}
                    </template>
                </Column>
                <Column field="uuid" header="UUID"
                    :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                </Column>
                <Column header="ACCIONES" v-if="registro.estatus != 'Timbrado' && registro.estatus != 'Cancelado'"
                    :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                        <template #body="{ data }">
                            <Button v-if="registro.estatus=='SinAplicar'"
                                severity="danger"
                                raised rounded size="small"
                                icon="pi pi-trash"
                                v-tooltip.top="{ 
                                    value:      'Eliminar el documento relacionado de la factura',
                                    showDelay:  1000,
                                }"
                                @click="eliminaRelacionado($event,data)">
                            </Button>
                        </template>
                </Column>
            </DataTable>
        </div>
        <template #footer>
            <Button 
                label="Cerrar" raised
                severity="secondary"
                icon="pi pi-times"
                @click="() => { dialogRelacionados = false }"
                :pt="{ root: { class: 'mt-2'} }">
            </Button>
        </template>
    </Dialog>    
    <!-- DIALOGO DOCUMENTO DETALLE -->
    <Dialog
        v-model:visible="dialogDetalle"
        modal :closable="false"
        :header="(tipo_detalle_operacion== 'Create' ? 'Agregar ' :
                    tipo_detalle_operacion == 'Update' ? 'Editar ' : 'Consulta ')+tipo_detalle"
        :style="{width: '70vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }">
        <div class="row mt-2 mb-2">
            <label for="refaccion" class="required col-form-label col-form-label-sm col-sm-2">{{ tipo_detalle }}</label>
            <div class="col-sm-7">
                <AutoComplete
                    v-if="tipo_detalle == 'Producto'"
                    v-model="selectproducto"
                    :option-label="(data) => {return (data.codigo+' '+data.descripcion.trim()).trim()}"
                    :suggestions="productosfiltrados"
                    force-selection :chip-Icon="true"
                    auto-option-focus
                    empty-search-message="No existen refacciones que coincidan"
                    empty-selection-message="No se ha seleccionado una refacción"
                    placeholder="Capture una refacción por codigo o descripcion"
                    @complete="buscarProductos" fluid 
                    @option-select="seleccionDetalle"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </AutoComplete>
                <AutoComplete
                    v-if="tipo_detalle == 'Servicio'"
                    v-model="selecttrabajo"
                    :option-label="(data) => {return (data.codigo+' '+data.descripcion.trim()).trim()}"
                    :suggestions="trabajosfiltrados"
                    force-selection :chip-Icon="true"
                    auto-option-focus
                    empty-search-message="No existen trabajos que coincidan"
                    empty-selection-message="No se ha seleccionado un trabajo"
                    placeholder="Capture un trabajo por codigo o descripcion"
                    @complete="buscarTrabajos" fluid 
                    @option-select="seleccionDetalle"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </AutoComplete>
            </div>
            <label for="cantidad_refaccion" class="required col-form-label col-form-label-sm col-sm-1">Cantidad</label>
            <div class="col-sm-2">
                <InputNumber id="cantidad_refaccion" v-model="documento_detalle.cantidad" highlight-on-focus
                    :min="0.00" :max="9999.9999" :max-fraction-digits="4" :min-fraction-digits="4" fluid
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}"
                    @blur="CalculaImportes"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </InputNumber>
            </div>
        </div>
        <div class="row mb-2">
            <label for="clavesat" class="col-form-label col-form-label-sm col-sm-2">ClaveSAT</label>
            <div class="col-sm-2">
                <InputText fluid disabled 
                    :model-value="tipo_detalle == 'Servicio' ? 
                        ( selecttrabajo != null ? selecttrabajo.sat_claveprodserv != null ?  selecttrabajo.sat_claveprodserv.c_claveprodserv : '' : '' ) :
                        ( selectproducto != null ? selectproducto.sat_claveprodserv != null ?  selectproducto.sat_claveprodserv.c_claveprodserv : '' : '' )">
                </InputText>
            </div>
            <div class="col-sm-5">
                <InputText fluid disabled
                    :model-value="tipo_detalle == 'Servicio' ? 
                    ( selecttrabajo != null ? selecttrabajo.sat_claveprodserv != null ?  selecttrabajo.sat_claveprodserv.claveprodserv : '' : '' ) :
                    ( selectproducto != null ? selectproducto.sat_claveprodserv != null ?  selectproducto.sat_claveprodserv.claveprodserv : '' : '' )">
                </InputText>
            </div>
            <label for="precio" class="required col-form-label col-form-label-sm col-sm-1">Precio</label>
            <div class="col-sm-2">
                <InputNumber id="precio" v-model="documento_detalle.precio" 
                    :min="0" :max="9999999.9999" :max-fraction-digits="4" :min-fraction-digits="4" fluid
                    mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}"
                    @blur="CalculaImportes"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </InputNumber>
            </div>
            
        </div>
        <div class="row mb-2">
            <label for="descto%" class="col-form-label col-form-label-sm col-sm-2">
                Descuento %
                <i class="pi pi-info-circle" 
                        v-tooltip.top="'Descuento al Producto o Servicio en Porcentaje'"
                    style="font-size: 1rem;"></i>
            </label>
            <div class="col-sm-2">
                <InputNumber id="descto%" v-model="documento_detalle.porcdescuento" 
                    :min="0" :max="100.00" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}" highlight-on-focus
                    @blur="CalculaImportes"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </InputNumber>
            </div>
            <label for="descto$" class="col-form-label col-form-label-sm col-sm-2">
                Descuento $
                <i class="pi pi-info-circle" 
                        v-tooltip.top="'Descuento al Producto o Servicio en Importe'"
                    style="font-size: 1rem;"></i>
            </label>
            <div class="col-sm-2">
                <InputNumber id="descto$" v-model="imp_descuento" 
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}" 
                    @blur="CalculaImportes"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </InputNumber>
            </div>
            <label for="subtotal" class="col-form-label col-form-label-sm col-sm-1"></label>
            <label for="subtotal" class="col-form-label col-form-label-sm col-sm-1">Subtotal</label>
            <div class="col-sm-2">
                <InputNumber id="descto$" v-model="documento_detalle.importe" 
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX"
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}" disabled
                    @blur="CalculaImportes">
                </InputNumber>
            </div>
        </div>
        <div class="row mb-2">
            <label for="descuento" class="col-form-label col-form-label-sm col-sm-2">
                Descuento Final
            </label>
            <div class="col-sm-2">
                <InputNumber id="descuento" v-model="documento_detalle.descuento" 
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX"
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}" disabled>
                </InputNumber>
            </div>
            <label for="impuestos" class="col-form-label col-form-label-sm col-sm-2">
                Impuesto
            </label>
            <div class="col-sm-2">
                <InputNumber id="impuestos" v-model="documento_detalle.impuesto" 
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX"
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}" disabled>
                </InputNumber>
            </div>
            <label for="retenciones" class="col-form-label col-form-label-sm col-sm-2">
                Retención
            </label>
            <div class="col-sm-2">
                <InputNumber id="retenciones" v-model="documento_detalle.retencion" 
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX"
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}" disabled>
                </InputNumber>
            </div>
        </div>
        <div class="row mb-2">
            <label v-if="tipo_detalle == 'Producto'" for="almacen_det" class="required col-form-label col-sm-2">
                Almacén
            </label>
            <div class="col-sm-6">
                <Select v-if="tipo_detalle == 'Producto'"
                    v-model="selectalmacen_det"
                    fluid id="almacen_det"
                    :options="almacenes" variant="filled"
                    option-label="nombre"
                    placeholder="Seleccione un Almacén"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </Select>
            </div>
            <label v-if="tipo_detalle == 'Servicio'" for="importe_final" class="col-form-label col-form-label-sm col-sm-8">
            </label>
            <label for="importe_final" class="col-form-label col-form-label-sm col-sm-2">
                Importe Final
            </label>
            <div class="col-sm-2">
                <InputNumber id="importe_final" v-model="documento_detalle.importe_final" 
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX"
                    :pt="{ pcInputText: { root:{ class: 'text-end fw-bold text-primary'}}}" disabled>
                </InputNumber>
            </div>
        </div>
        <div class="row mb-2">
            <label for="descripcion" class="required col-form-label col-form-label-sm col-sm-2">
                Descripción
                <i class="pi pi-info-circle" 
                        v-tooltip.top="'Es la descripción que se guardará en el CFDI/XML'"
                    style="font-size: 1rem;"></i>
            </label>
            <div class="col-sm-10">
                <Textarea id="descripcion" maxlength="1000" fluid
                    v-model="documento_detalle.descripcion" highlight-on-focus rows="2"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </Textarea>
            </div>
        </div>
        <div class="row mb-2">
            <label for="notas" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
            <div class="col-sm-10">
                <Textarea v-model="documento_detalle.observaciones" rows="3" fluid
                    :disabled="tipo_detalle_operacion == 'Show'">
                </Textarea>
            </div>
        </div>
        <template #footer>
            <Button 
                @click="closeDialogDetalle('cerrar')"
                label="Cerrar" raised
                severity="secondary"
                icon="pi pi-times"
                :pt="{ root: { class: 'mt-2'} }">
            </Button>
            <Button v-if="tipo_detalle_operacion != 'Show'"
                label="Guardar" raised
                severity="success"
                :loading="isUpdatingDetalle"
                @click="closeDialogDetalle('guardar')"
                :pt="{ root: { class: 'mt-2'} }">
            </Button>
        </template>
    </Dialog>
    <!-- DIALOGO DOCUMENTO PDF -->
    <Dialog
        v-model:visible="dialogPDFVisor" 
        modal
        maximizable
        :closable="false"
        header="Visualización del Archivo PDF" 
        :style="{width: '80vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        @show="() => {console.log('Test')}"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    content: { style: 'height: 660px'},
                    footer: { class: 'bg-secondary' } 
                }"
    >
        <VuePdfEmbed ref="pdfViewer" 
            :annotation-layer="true" 
            :text-layer="true" 
            :source="pdfDocumento"
            >
        </VuePdfEmbed>
        <template #footer>
            <Button
                raised
                @click="() => { pdfViewer.download(documento_cfdi?.filepdf) }"
                severity="info"
                label="Descargar PDF"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >

            </Button>
            <Button 
                raised
                @click="cerrarVisualizarPDF"
                label="Cerrar"
                severity="success"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
    </Dialog>
    <!-- DIALOGO DOCUMENTO XML -->
    <Dialog
        v-model:visible="dialogXMLVisor" 
        modal
        maximizable
        :closable="false"
        header="Visualización del Archivo XML" 
        :style="{width: '80vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    content: { style: 'height: 660px'},
                    footer: { class: 'bg-secondary' } 
                }">

        <PrettyXml ref="pdfViewer" :xml="pdfDocumento" :options="{shortRecord:true}">
        </PrettyXml>

        <!-- <pre v-if="pdfDocumento">{{ pdfDocumento }}</pre> -->
        
        <template #footer>
            <Button
                raised
                @click="downloadXML"
                severity="info"
                label="Descargar XML"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >

            </Button>
            <Button 
                raised
                @click="cerrarVisualizarXML"
                label="Cerrar"
                severity="success"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
    </Dialog>
    <Toast />
    <Toast group="waiting">
        <template #message="slotProps">
            <div class="font-medium text-lg my-4">{{ slotProps.message.summary }}</div>
            <ProgressSpinner
                style="width: 25px; height: 25px" strokeWidth="8"
                fill="transparent"
                animation-duration=".5s"
            >

            </ProgressSpinner>
        </template>
    </Toast>
    <ConfirmPopup></ConfirmPopup>
</template>

<style scoped>

</style>