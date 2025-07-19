<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import type { Cotizacion } from '@/modules/taller/modulos/cotizacion/interfaces/interfaces';
import useCotizacion from '../composables/useCotizacion';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Toast from 'primevue/toast';
import Checkbox from 'primevue/checkbox';
import DatePicker from 'primevue/datepicker';
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

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const route   = useRoute();
const router  = useRouter();
const toast   = useToast();
const auth    = useAuthStore();

const { sumarDias,formatCurrency,convertTMZdatetime, convertTMZdate } = useUtilerias();

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
    clientesfiltrados,
    selecttrabajo,
    trabajosfiltrados,
    monedas,
    selectmoneda,
    documento_detalle,
    documento_detalles,
    imp_descuento,
    selectproducto,
    productosfiltrados,
    dialogDetalle,
    tipo_detalle,
    tipo_detalle_operacion,
    isUpdatingDetalle,
    dialogPDFVisor,
    pdfDocumento,
    pdfViewer,
    botonespdf,
    selectunidad,
    unidadfiltradas,
    fecha,
    fecha_vence,
    
    updateRegistro,
    cambiaDocumento,
    cambiaMoneda,
    buscarClientes,
    buscarProductos,
    buscarTrabajos,
    buscarUnidad,
    seleccionCliente,
    seleccionDetalle,
    openDialogDetalle,
    closeDialogDetalle,
    eliminaDetalle,
    CalculaImportes,
    botonRegresar,
    generaPDF,
    VisualizarPDF,
    RegenerarPDF,
    enviarCFDI,
    cerrarVisualizarPDF,
    
} = useCotizacion( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.push({name: 'cotizacion'});
});

const validarDatos = async(data: Cotizacion) => {
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
    data.moneda_id          = selectmoneda.value.id;
    data.propietario_id     = selectpropietario.value.id;
    data.fecha              = fecha.value;
    data.fecha_vence        = fecha_vence.value;
    data.unidad_id          = selectunidad.value ? selectunidad.value.id : 0 ;
    updateRegistro(data);
}

</script>
<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consultar Cotización</h2>
    </div>
    <div v-if="registro">
        <form @submit.prevent="validarDatos(registro)">
            <div class="card-body border-0 pt-0 pb-0">
                <Toolbar style="border-radius: 1rem; padding: 1rem 1rem 1rem 1.5rem;" class="bg-secondary" size="small">
                    <template #start>
                        <div class="flex items-center gap-2">
                            <Button
                                severity="secondary" label="Regresar" size="small"
                                class="ms-2" raised icon="pi pi-arrow-left"
                                @click="botonRegresar">
                            </Button>
                            <SplitButton v-if="registro.id > 0" raised icon="pi pi-file-pdf" class="ms-2"
                                @click="generaPDF('Normal')" severity="info"  label="PDF Cotización" size="small" :model="botonespdf">
                            </SplitButton>
                        </div>
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
                            :severity="registro.estatus=='SinAutorizar' ? 'info' : 
                                            registro.estatus=='Autorizado' ? 'success' :
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
                            option-label="descripcion" fluid disabled
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
                <div class="row mb-2">
                    <label for="nombrecliente" class="col-form-label col-sm-1">
                        Cliente
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Captura del nombre del cliente no registrado previamente en el catálogo'" />
                    </label>
                    <div class="col-sm-5">
                        <InputText
                            v-model="registro.nombre_cliente" fluid disabled>
                        </InputText>
                    </div>
                    <label for="atencion" class="col-form-label col-sm-1">
                        Atención
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Nombre de la persona o departamento a quien va dirigida la cotización'" />
                    </label>
                    <div class="col-sm-5">
                        <InputText
                            v-model="registro.atencion" fluid disabled>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="unidad" class="required col-form-label col-sm-1">Unidad</label>
                    <div class="col-sm-5">
                        <AutoComplete
                            v-model="selectunidad"
                            :option-label="(data) => {return data.numeroeco+' PLACAS:'+data.placas+' Tipo: '+data.talle_tipo_unidad.tipo_unidad+' Marca: '+data.talle_marca.marca}"
                            :suggestions="unidadfiltradas"
                            force-selection :chip-Icon="true"
                            auto-option-focus
                            empty-search-message="No existen unidades que coincidan"
                            empty-selection-message="No se ha seleccionado una unidad"
                            placeholder="Capture una unidad por NoEconomico, Placas o Numero de Serie"
                            @complete="buscarUnidad" fluid disabled>
                        </AutoComplete>
                    </div>
                    <label for="datos_unidad" class="col-form-label col-sm-1">
                        Unidad
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Datos de la unidad no registrada en el catálogo'" />
                    </label>
                    <div class="col-sm-5">
                        <InputText
                            v-model="registro.datos_unidad" fluid disabled>
                        </InputText>
                    </div>
                </div>
                <Tabs value="0" @update:value="( value:string | number) => { tabActiva = value.toString() }" scrollable>
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
                    </TabList>
                    <TabPanels>
                        <TabPanel v-if="registro.id > 0" value="0">
                            <DataTable :value="documento_detalles"
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
                                <Column header="CLAVE SAT" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="{data}">
                                        {{  data[1].sat_claveprodserv.c_claveprodserv }}
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
                                                value:      'Consulta el concepto de la cotización',
                                                showDelay:  1000,
                                            }" class="me-2"
                                            @click="openDialogDetalle(data[0].id,data[0].tipo_partida,'Show')">
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
                                        disabled>
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
                                    Agente/Vendedor
                                </label>
                                <div class="col-sm-4">
                                    <Select
                                        v-model="selectagente"
                                        fluid 
                                        :options="agentes" variant="filled"
                                        option-label="nombre"
                                        placeholder="Seleccione un Agente"
                                        disabled>
                                    </Select>
                                </div>
                                <label for="emisor" class="required col-form-label col-sm-1">
                                    Fecha
                                </label>
                                <div class="col-sm-2">
                                    <DatePicker
                                        v-model="fecha" input-id="icondisplay" date-format="dd/mm/yy"
                                        showIcon fluid :show-on-focus="false"  disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                                    </DatePicker>
                                </div>
                                <label for="emisor" class="col-form-label col-sm-1">
                                    Vence
                                </label>
                                <div class="col-sm-2">
                                    <DatePicker
                                        v-model="fecha_vence" input-id="icondisplay" date-format="dd/mm/yy"
                                        showIcon fluid :show-on-focus="false" disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                                    </DatePicker>
                                </div>
                            </div>                            
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <Divider></Divider>
                <!-- TOTALES Y NOTAS DE LA FACTURA -->
                <div class="row mb-2">
                    <div class="col-sm-8">
                        <div class="row">
                            <label for="observaciones" class="col-form-label col-form-label-sm col-sm-7"></label>
                        </div>
                        <div class="row">
                            <label for="observaciones" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
                            <div class="col-sm-12">
                                <Textarea v-model="registro.observaciones" rows="5" fluid
                                disabled>
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
                @click="() => { pdfViewer.download(`COT_${registro.folio}${registro.serie}_${convertTMZdate(String(fecha))}`) }"
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