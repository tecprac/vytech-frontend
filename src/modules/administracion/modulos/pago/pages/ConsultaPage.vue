<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import type { Documento } from '../interfaces/interfaces.ts';
import usePago from '../composables/usePago';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
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
import DatePicker from 'primevue/datepicker';
import Divider from 'primevue/divider';
import useUtilerias from '@/core/helpers/utilerias';
import VuePdfEmbed from 'vue-pdf-embed'
import { PrettyXml } from 'pretty-xml-vue3';

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import "pretty-xml-vue3/style.css"

const route   = useRoute();
const router  = useRouter();
const toast   = useToast();
const auth    = useAuthStore();
const confirm = useConfirm();

const { sumarDias,formatCurrency, formatDate, formatDateTime, convertTMZdate } = useUtilerias();

const {
    isPending,
    registro,
    tabActiva,
    isError,
    isUpdating,
    foliosdoctos,
    selecfoliodocto,
    selectcliente,
    propietarios,
    selectpropietario,
    clientesfiltrados,
    monedas,
    selectmoneda,
    documento_detalles,
    documento_relacionado,
    documentos_relacionados,
    tipo_docto_relacionado,
    dialogDetalle,
    formaspago,
    usoscfdi,
    selectformapago,
    selectusocfdi,
    isUpdatingDetalle,
    bTimbrando,
    dialogCancelacion,
    dialogPDFVisor,
    dialogXMLVisor,
    pdfDocumento,
    pdfViewer,
    cuentasbanco,
    selectcuentabanco,
    documento_cfdi,
    dialogRelacionados,
    dialogRelacionados_det,
    tiporelaciones,
    tipo_detalle_operacion,
    documento_detalle,
    selectfactura,
    facturasfiltrados,

    updateRegistro,
    botonRegresar,
    openDialogRelacionados,
    timbrarFactura,
    cancelarFactura,
    cambiaDocumento,
    cambiaMoneda,
    buscarClientes,
    seleccionCliente,
    cerrarVisualizarPDF,
    cerrarVisualizarXML,
    downloadXML,
    VisualizarXML,
    VisualizarPDF,
    RegenerarPDF,
    enviarCFDI,
    openDialogDetalle,
    closeDialogDetalle,
    eliminaDetalle,
    closeDialogRelacionadoDet,
    openDialogRelacionadosDet,
    eliminaRelacionado,
    buscarDocumentos,
    seleccionDetalle,
    desAplicar,
} = usePago( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.push({name: 'pago'});
});

</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consultar Pago</h2>
    </div>
    <div v-if="registro">
        <div class="card-body border-0 pt-0 pb-0">
            <Toolbar style="border-radius: 1rem; padding: 1rem 1rem 1rem 1.5rem;" class="bg-secondary" size="small">
                <template #start>
                    <Button
                        severity="secondary" label="Regresar" size="small"
                        class="ms-2" raised icon="pi pi-arrow-left"
                        @click="botonRegresar">
                    </Button>
                    <Button v-if="registro.id > 0" raised icon="pi-sort-alt-slash" class="ms-2" severity="info" label="Relacionar CFDI's"
                        size="small" @click="openDialogRelacionados"
                        :badge="documentos_relacionados.length.toString()"
                        :badge-severity="(documentos_relacionados.length == 0 ? 'info': 'danger')">
                    </Button>
                    <Button v-if="registro.id > 0 && (registro.estatus == 'Aplicado')" raised icon="pi-qrcode" class="ms-2 text-black" severity="success" label="Des-Aplicar"
                        size="small" @click="desAplicar" :loading="bTimbrando">
                    </Button>
                    <Button v-if="registro.id > 0" raised icon="pi-qrcode" class="ms-2 text-black" severity="warn" label="Timbrar"
                        size="small" @click="timbrarFactura" :loading="bTimbrando"
                        :disabled="registro.estatus == 'Timbrado' || registro.estatus == 'Cancelado'">
                    </Button>
                    <Button v-if="registro.id > 0 && (registro.estatus == 'SinAplicar' || registro.estatus == 'Timbrado') " raised icon="pi pi-times-circle" class="ms-2" severity="danger" label="Cancelar"
                        size="small" @click="cancelarFactura" :loading="bTimbrando">
                    </Button>
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
            <div class="row mt-4 mb-2">
                <label for="fechapago" class="col-form-label col-sm-1">Fecha Pago</label>
                <div class="col-sm-2">
                    <DatePicker v-model="registro.fecha_pago" disabled
                        show-icon :show-on-focus="false" fluid>
                    </DatePicker>
                </div>
                <label for="formapago" class="required col-form-label col-sm-1">
                    Forma Pago
                </label>
                <div class="col-sm-3">
                    <Select
                        v-model="selectformapago"
                        fluid 
                        :options="formaspago" variant="filled"
                        :option-label="(data) => data.c_formapago+' '+data.descripcion"
                        placeholder="Seleccione una Forma de Pago" disabled>
                    </Select>                                                
                </div>
                <label for="moneda" class="col-form-label col-sm-1">Moneda</label>
                <div class="col-sm-2">
                    <Select
                        v-model="selectmoneda" :options="monedas"
                        option-label="descripcion" fluid disabled
                        variant="filled">
                    </Select>
                </div>
                <label for="tipocambio" class="col-form-label col-sm-1">TC</label>
                <div class="col-sm-1">
                    <InputNumber v-model="registro.tipocambio" :min="0.0000" :max="99.9999" 
                        mode="currency" currency="USD" locale="en-US" fluid 
                        :min-fraction-digits="4" :max-fraction-digits="4" disabled
                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                    </InputNumber>
                </div>
            </div>
            <div class="row mb-2">
                <label for="emisor" class="required col-form-label col-sm-2">
                    Emisor
                </label>
                <div class="col-sm-4">
                    <Select
                        v-model="selectpropietario" fluid 
                        :options="propietarios" variant="filled"
                        :option-label="(data) => {return (data.tipo_persona == 'Moral' ? data.razon_social : data.nombres+' '+data.apaterno+' '+data.amaterno)+' RFC:'+data.rfc}"
                        placeholder="Seleccione un Emisor" disabled>
                    </Select>
                </div>
                <label for="cliente" class="required col-form-label col-sm-2">Cliente</label>
                <div class="col-sm-4">
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
            </div>
            <div class="row mb-2">
                <label for="cuenta_banco" class="col-form-label col-sm-2">Cuenta Bancaria</label>
                <div class="col-sm-2">
                    <Select
                        v-model="selectcuentabanco" :options="cuentasbanco"
                        option-label="descripcion" fluid :disabled="registro.id > 0" 
                        variant="filled">
                    </Select>
                </div>
                <label for="importe" class="required col-form-label col-sm-2">
                    Importe
                </label>
                <div class="col-sm-2">
                    <InputNumber id="importe" v-model="registro.importe" 
                        :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                        mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                        :pt="{ pcInputText: { root:{ class: 'text-end text-primary'}}}"
                        :disabled="registro.id > 0">
                    </InputNumber>
                </div>
                <label for="resta" class="col-form-label col-sm-2">
                    Resta
                </label>
                <div class="col-sm-2">
                    <InputNumber id="resta" v-model="registro.saldo" 
                        :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                        mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                        :pt="{ pcInputText: { root:{ class: 'text-end text-primary'}}}"
                        disabled>
                    </InputNumber>
                </div>
            </div>
            <Tabs value="0" @update:value="( value:string | number) => { tabActiva = value.toString() } ">
                <TabList>
                    <Tab :disabled="registro.id == 0" value="0" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                        :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                        <i class="pi pi-list" style="color: slateblue"></i>
                        Documentos
                    </Tab>
                    <Tab v-if="(registro.estatus == 'Aplicado' || registro.estatus == 'Timbrado') && documento_cfdi" :disabled="registro.id == 0" value="1" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                        :pt="{root: { class: tabActiva == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                        <i class="pi pi-qrcode" style="color: slateblue"></i>
                        Timbrado
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel v-if="registro.id > 0" value="0">
                        <DataTable :value="documento_detalles"
                            show-gridlines scroll-height="300px" size="small" scrollable>
                            <Column header="ID" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                <template #body="slotProps">
                                    {{ slotProps.data.id }}
                                </template>
                            </Column>
                            <Column header="Documento" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                <template #body="slotProps">
                                    {{ slotProps.data.adm_documentos[0].tipo_documento+' '+slotProps.data.adm_documentos[0].folio+' '+slotProps.data.adm_documentos[0].serie }}
                                </template>
                            </Column>
                            <Column header="Fecha.Docto" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                <template #body="slotProps">
                                    {{ convertTMZdate(slotProps.data.adm_documentos[0].fecha) }}
                                </template>
                            </Column>
                            <Column header="Cliente" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                <template #body="slotProps">
                                    {{ 
                                        slotProps.data.adm_documentos[0].adm_cliente.tipo_persona == 'Moral' ?
                                        slotProps.data.adm_documentos[0].adm_cliente.razon_social :
                                        slotProps.data.adm_documentos[0].adm_cliente.nombres + ' ' +slotProps.data.adm_documentos[0].adm_cliente.apaterno+ ' ' + slotProps.data.adm_documentos[0].adm_cliente.amaterno
                                    }}
                                </template>
                            </Column>
                            <Column header="Total" :pt="{ headerCell: { class: 'bg-secondary text-end'}, root: { class: 'text-end'} }">
                                <template #body="slotProps">
                                    {{ formatCurrency(slotProps.data.adm_documentos[0].total) }}
                                </template>
                            </Column>
                            <Column header="Saldo" :pt="{ headerCell: { class: 'bg-secondary text-end'}, root: { class: 'text-end'} }">
                                <template #body="slotProps">
                                    {{ formatCurrency(slotProps.data.adm_documentos[0].saldo) }}
                                </template>
                            </Column>
                            <Column header="Pago" :pt="{ headerCell: { class: 'bg-secondary text-end'}, root: { class: 'text-end'} }">
                                <template #body="slotProps">
                                    {{ formatCurrency(slotProps.data.importe) }}
                                </template>
                            </Column>
                            <Column header="ACCIONES" :pt="{ headerCell: { class: 'bg-secondary text-center'}, root: { class: 'text-center'} }">
                                <template #body="{ data }">
                                    <Button
                                        severity="info"
                                        raised rounded size="small"
                                        icon="pi pi-search"
                                        v-tooltip.top="{ 
                                            value:      'Consulta el documento del pago',
                                            showDelay:  1000,
                                        }" class="me-2"
                                        @click="openDialogDetalle(data.id,'Show')">
                                    </Button>
                                </template>
                            </Column>                                
                        </DataTable>
                    </TabPanel>
                    <TabPanel v-if="registro.estatus == 'Aplicado' || registro.estatus == 'Timbrado'" value="1">
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
            <div class="row mb-2">
                <div class="col-sm-8">
                    <div class="row">
                        <label for="observaciones" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
                        <div class="col-sm-12">
                            <Textarea v-model="registro.observaciones" rows="3" fluid disabled>
                            </Textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
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
                    tipo_detalle_operacion == 'Update' ? 'Editar ' : 'Consulta ')"
        :style="{width: '70vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }">
        <div class="row mt-2 mb-2">
            <label for="documento" class="required col-form-label col-form-label-sm col-sm-2">Documento</label>
            <div class="col-sm-2">
                <AutoComplete
                    v-model="selectfactura"
                    :option-label="(data) => {return ('Folio:'+data.folio.toString()+' Total: '+formatCurrency(data.total)+' Saldo: '+formatCurrency(data.saldo))}"
                    :suggestions="facturasfiltrados"
                    force-selection :chip-Icon="true"
                    auto-option-focus
                    empty-search-message="No existen documentos que coincidan"
                    empty-selection-message="No se ha seleccionado un documento para pagar"
                    placeholder="Capture el folio de documento a pagar"
                    @complete="buscarDocumentos" fluid 
                    @option-select="seleccionDetalle"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </AutoComplete>
            </div>
            <label for="fecha_docto" class="col-form-label col-form-label-sm col-sm-2">Fecha Docto</label>
            <div class="col-sm-2">
                <InputText fluid disabled
                    :model-value="selectfactura ? convertTMZdate(selectfactura.fecha) : '' ">
                </InputText>
            </div>
            <label for="fecha_vence" class="col-form-label col-form-label-sm col-sm-2">Fecha Vence</label>
            <div class="col-sm-2">
                <InputText fluid disabled
                    :model-value="selectfactura ? convertTMZdate(selectfactura.fecha_vence) : '' ">
                </InputText>
            </div>
        </div>
        <div class="row mb-2">
            <label for="cliente" class="col-form-label col-form-label-sm col-sm-2">Cliente</label>
            <div class="col-sm-10">
                <InputText fluid disabled 
                    :model-value="!selectfactura || !selectfactura.adm_cliente ? '' :
                         selectfactura.adm_cliente.tipo_persona == 'Moral' ? 
                            ( selectfactura != null ? selectfactura.adm_cliente != null ? selectfactura.adm_cliente.razon_social : '': '') :
                            ( selectfactura != null ? selectfactura.adm_cliente != null ? selectfactura.adm_cliente.nombres+''+selectfactura.adm_cliente.apaterno+' '+selectfactura.adm_cliente.amaterno : '' : '' )">
                </InputText>
            </div>
        </div>
        <div class="row mb-2">
            <label for="total" class=" col-form-label col-form-label-sm col-sm-2">Total</label>
            <div class="col-sm-2">
                <InputNumber id="total" 
                    :model-value="!selectfactura ? 0.00 : selectfactura.total"
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                    :pt="{ pcInputText: { root:{ class: 'text-end fw-bold'}}}"
                    disabled>
                </InputNumber>
            </div>
            <label for="saldo" class="col-form-label col-form-label-sm col-sm-2">Saldo</label>
            <div class="col-sm-2">
                <InputNumber id="saldo" 
                    :model-value="!selectfactura ? 0.00 : selectfactura.saldo"
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                    :pt="{ pcInputText: { root:{ class: 'text-end fw-bold'}}}"
                    disabled>
                </InputNumber>
            </div>
            <label for="importe" class="required col-form-label col-form-label-sm col-sm-2 text-primary">Pago</label>
            <div class="col-sm-2">
                <InputNumber id="importe" v-model="documento_detalle.importe" 
                    :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                    :pt="{ pcInputText: { root:{ class: 'text-end fw-bold'}}}"
                    :disabled="tipo_detalle_operacion == 'Show'">
                </InputNumber>
            </div>
        </div>
        <div class="row mb-2">
            <label for="notas" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
            <div class="col-sm-10">
                <Textarea v-model="documento_detalle.notas" rows="3" fluid
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