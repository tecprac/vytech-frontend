<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import type { Orden } from '@/modules/taller/modulos/orden/interfaces/interfaces';
import useOrden from '../composables/useOrden';
import useUtilerias from '@/core/helpers/utilerias';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import Slider from 'primevue/slider';
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
import Dialog from 'primevue/dialog';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';
import Checkbox from 'primevue/checkbox';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Divider from 'primevue/divider';
import SplitButton from 'primevue/splitbutton';

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const route = useRoute();
const router  = useRouter();
const toast   = useToast();
const auth    = useAuthStore();
const confirm = useConfirm();

const { convertTMZdate,convertTMZdatetime } = useUtilerias();

const { 
    registro,
    isPending,
    isError,
    isAdding,
    isAddingSuccess,
    foliosdoctos,
    selecfoliodocto,
    tiposservicios,
    selectiposervicio,
    selectcliente,
    clientesfiltrados,
    tecnicos,
    selectecnico,
    selectunidad,
    unidadfiltradas,
    bahias,
    selectbahia,
    dialogPDFVisor,
    pdfDocumento,
    pdfViewer,
    botonespdf,
    generandopdf,
    tabActiva,
    trabajo_orden,
    trabajos_orden,
    dialogTrabajo,
    dialogRefaccion,
    dialogRefaccionDet,
    dialogMiscelaneo,
    dialogFacturar,
    selectecnicotrabajo,
    selecttrabajo,
    trabajosfiltrados,
    miscelaenos_orden,
    miscelaneo_orden,
    tipo_operacion_trabajo,
    tipo_operacion_misc,
    tipo_operacion_refaccion,
    selectproducto,
    productosfiltrados,
    refaccion_orden,
    refacciones_orden,
    isLoadingRequi,
    trabajosbitacora,
    dialogEstatus,
    tipo_estatus,
    sPermisos,
    motivos,
    selectmotivo,
    trabajos_orden_fact,
    miscelaneos_orden_fact,
    orden_refacciones,
    orden_refacciones_fact,
    totalRef_facturar,
    totaltra_facturar,
    totalmis_facturar,
    usuario_abre,
    usuario_cierra,
    usuario_cancela,
    motivo_cancela,
    agruparDiversos,
    selectclientefact,
    ordenBitacora,
    documentos,

    newRegistro,
    updateRegistro,
    cambiaDocumento,
    buscarClientes,
    buscarUnidad,
    generaPDF,
    cerrarVisualizarPDF,
    openDialogTrabajo,
    closeDialogTrabajo,
    eliminaTrabajo,
    closeDialogMiscelaneo,
    openDialogMiscelaneo,
    eliminaMiscelaneo,
    openDialogRefaccion,
    openDialogRefaccionDet,
    closeDialogRefaccion,
    closeDialogRefaccionDet,
    eliminaRefaccion,
    buscarTrabajos,
    formatCurrency,
    formatNumber2Dec,
    openDialogEstatus,
    openDialogFacturar,
    closeDialogEstatus,
    closeDialogFacturar,
    onCellEditComplete,
    abrirOrden,
    onCellEditTrabajos,
} = useOrden( +route.params.id);

// watch( isAddingSuccess, () => {
//     setTimeout(() => {
//         dataMutationNew.reset();
//     }, 2000);
// });

watch(isError, () => {
    if(isError.value)
        router.push({name: 'orden'});
});

const validarDatos = async (data: Orden) => {
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
    try {
        if (selectecnico.value.id == 0) {
            toast.add({ severity:   'error',summary:    'Verificar',
                detail: 'Debe seleccionar un Técnico',life: 3500
            });
            return;
        }    
    } catch (error) {
        toast.add({ severity:   'error', summary:    'Verificar',
            detail: 'Debe seleccionar un Técnico ', life: 3500});
        return;
    }
    try {
        if (selectunidad.value.id == 0) {
            toast.add({ severity:   'error',summary:    'Verificar',
                detail: 'Debe seleccionar una Unidad',life: 3500
            });
            return;
        }    
    } catch (error) {
        toast.add({ severity:   'error', summary:    'Verificar',
            detail: 'Debe seleccionar una Unidad ', life: 3500});
        return;
    }
    if (selectbahia.value.id == 0) {
        toast.add({ severity:   'error', summary:    'Verificar',
            detail: 'Debe seleccionar una Bahía ', life: 3500});
        return;
    }
    data.folio_documento_id = selecfoliodocto.value.id
    data.tipo_servicio_id = selectiposervicio.value.id;
    data.cliente_id = selectcliente.value.id;
    data.tecnico_id = selectecnico.value.id;
    data.unidad_id = selectunidad.value.id;
    data.bahia_id = selectbahia.value.id;
    data.usuario_inicia_id = auth.user.id;
    data.fecha_alta = new Date();
    if (data.id == 0)
        newRegistro(data);
    if (data.id > 0)
        updateRegistro(data);
}

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consulta Orden</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validarDatos(registro)">
            <div class="card-body border-0 pt-0 pb-0">
                <Toolbar style="border-radius: 1rem; padding: 1rem 1rem 1rem 1.5rem;" class="bg-secondary" size="small" >
                    <template #start>
                        <div class="flex items-center gap-2">
                            <Button
                                severity="secondary" label="Regresar" size="small"
                                class="ms-2" rounded raised icon="pi pi-arrow-left"
                                @click="() => { router.push({name: 'orden'})}">
                            </Button>
                            <SplitButton v-if="registro.id > 0" raised icon="pi pi-file-pdf" class="ms-2"
                                @click="generaPDF('Blanco')" severity="info" label="PDF Orden" size="small" :model="botonespdf" >
                            </SplitButton>
                            <Button v-if="sPermisos.indexOf('Cerrar') >= 0 && (registro.estatus == 'Abierta' || registro.estatus == 'EnProceso')"
                                severity="contrast" label="Cerrar" size="small"
                                class="ms-2" rounded raised icon="pi pi-lock"
                                @click="openDialogEstatus('Cerrada')">
                            </Button>
                            <Button v-if="sPermisos.indexOf('Cerrar') >= 0 && (registro.estatus == 'Abierta' || registro.estatus == 'EnProceso' || registro.estatus == 'Cerrada')"
                                severity="warn" label="Garantía" size="small"
                                class="ms-2 text-black" rounded raised icon="pi pi-lock"
                                @click="openDialogEstatus('Garantia')">
                            </Button>
                            <Button v-if="sPermisos.indexOf('AbrirOrdenCerrada') >= 0 && (registro.estatus == 'Cerrada' )"
                                severity="success" label="Abrir Orden" size="small"
                                class="ms-2" rounded raised icon="pi pi-lock-open"
                                @click="abrirOrden">
                            </Button>
                            <Button v-if="sPermisos.indexOf('AbrirOrdenFacturada') >= 0 && (registro.estatus == 'ParcialFacturada' || registro.estatus == 'Facturada')"
                                severity="success" label="Abrir Orden" size="small"
                                class="ms-2" rounded raised icon="pi pi-lock-open"
                                @click="abrirOrden">
                            </Button>
                            <Button v-if="sPermisos.indexOf('Eliminar') >= 0 && (registro.estatus != 'Cancelada' && registro.estatus != 'Facturada' && registro.estatus != 'ParcialFacturada')"
                                severity="danger" label="Cancelar" size="small"
                                class="ms-2" rounded raised icon="pi pi-times"
                                @click="openDialogEstatus('Cancelada')">
                            </Button>
                            <Button v-if="sPermisos.indexOf('Facturar') >= 0 &&  (registro.estatus != 'Cancelada' && registro.estatus != 'Facturada' && (registro.estatus == 'Cerrada' || registro.estatus == 'ParcialFacturada'))"
                                severity="success" label="Facturar" size="small"
                                class="ms-2" rounded raised icon="pi pi-dollar"
                                @click="openDialogFacturar">
                            </Button>
                        </div>
                    </template>
                    <template #end></template>
                </Toolbar>
                <div class="row mt-2 mb-2">
                    <label for="id" class="col-form-label col-form-label-sm col-sm-1">ID</label>
                    <div class="col-sm-1">
                        <InputNumber id="id" v-model="registro.id" disabled fluid size="small"
                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <label for="tipo_documento" class="col-form-label col-form-label-sm col-sm-2">Documento</label>
                    <div class="col-sm-2">
                        <Select
                            v-model="selecfoliodocto" :options="foliosdoctos"
                            option-label="documento" fluid size="small" disabled
                            @change="cambiaDocumento" variant="filled">
                        </Select>
                    </div>
                    <label for="folio" class="col-form-label col-form-label-sm col-sm-1">Folio</label>
                    <div class="col-sm-1">
                        <InputNumber v-model="registro.folio" fluid disabled size="small"
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <label for="serie" class="col-form-label col-form-label-sm col-sm-1">Serie</label>
                    <div class="col-sm-1">
                        <InputText v-model="registro.serie" fluid disabled size="small">
                        </InputText>
                    </div>
                    <label for="serie" class="col-form-label col-form-label-sm col-sm-1">Estatus</label>
                    <div class="col-sm-1">
                        <Button
                            :label="registro.estatus"
                            size="small"
                            :severity="registro.estatus=='Abierta' ? 'info' : 
                                            registro.estatus=='EnProceso' ? 'success' :
                                            registro.estatus=='Pausa' || registro.estatus=='Garantia' ? 'warn':
                                            registro.estatus=='Cancelada' ? 'danger' : 'success' "
                            rounded>
                        </Button>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="tipo_servicio" class="required col-form-label col-form-label-sm col-sm-2">Tipo Servicio</label>
                    <div class="col-sm-3">
                        <Select
                            v-model="selectiposervicio" :options="tiposservicios"
                            option-label="descripcion" fluid size="small" disabled>
                        </Select>
                    </div>
                    <label for="cliente" class="required col-form-label col-form-label-sm col-sm-1">Cliente</label>
                    <div class="col-sm-6">
                        <AutoComplete
                            v-model="selectcliente"
                            :option-label="(data) => {return (data.tipo_persona == 'Moral' ? data.razon_social : data.nombres+' '+data.apaterno+' '+data.amaterno)+' RFC:'+data.rfc}"
                            :suggestions="clientesfiltrados"
                            force-selection :chip-Icon="true"
                            auto-option-focus disabled
                            empty-search-message="No existen clientes que coincidan"
                            empty-selection-message="No se ha seleccionado un cliente"
                            placeholder="Capture un cliente por RFC, Nombre o Razón Social"
                            @complete="buscarClientes" fluid size="small"
                        >
                        </AutoComplete>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="tecnico" class="required col-form-label col-form-label-sm col-sm-2">Técnico</label>
                    <div class="col-sm-3">
                        <Select
                            v-model="selectecnico" :options="tecnicos"
                            placeholder="Selecciones un Técnico" disabled
                            :option-label="(data) => {return data.nombres+' '+data.apaterno+' '+data.amaterno}"
                            fluid size="small">
                        </Select>
                    </div>
                    <label for="unidad" class="required col-form-label col-form-label-sm col-sm-1">Unidad</label>
                    <div class="col-sm-6">
                        <AutoComplete
                            v-model="selectunidad"
                            :option-label="(data) => {return data.numeroeco+' PLACAS:'+data.placas+' Tipo: '+data.talle_tipo_unidad.tipo_unidad+' Marca: '+data.talle_marca.marca}"
                            :suggestions="unidadfiltradas"
                            force-selection :chip-Icon="true"
                            auto-option-focus disabled
                            empty-search-message="No existen unidades que coincidan"
                            empty-selection-message="No se ha seleccionado una unidad"
                            placeholder="Capture una unidad por NoEconomico, Placas o Numero de Serie"
                            @complete="buscarUnidad" fluid size="small"
                        >
                        </AutoComplete>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="bahia" class="required col-form-label col-form-label-sm col-sm-2">Bahia</label>
                    <div class="col-sm-3">
                        <Select
                            v-model="selectbahia" :options="bahias"
                            placeholder="Selecciones una Bahía"
                            option-label="descripcion"
                            fluid size="small" disabled>
                        </Select>
                    </div>
                </div>
                <Tabs v-if="registro.id > 0" value="0" scrollable @update:value="( value:string | number ) => { tabActiva = value.toString() }">
                    <TabList>
                        <Tab value="0" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-pen-to-square" style="color: slateblue"></i>
                            Generales
                        </Tab>
                        <Tab value="1" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-user-edit" style="color: slateblue"></i>
                            Trabajos/Servicios
                            <Badge v-if="trabajos_orden.length > 0"
                                    :value="trabajos_orden.length" severity="danger">
                            </Badge>
                        </Tab>
                        <Tab value="2" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '2' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-wrench" style="color: slateblue"></i>
                            Refacciones
                            <Badge v-if="orden_refacciones.length > 0"
                                    :value="orden_refacciones.length" severity="danger">
                            </Badge>
                        </Tab>
                        <Tab value="3" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '3' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-clipboard" style="color: slateblue"></i>
                            Material Diverso
                            <Badge v-if="miscelaenos_orden.length > 0"
                                    :value="miscelaenos_orden.length" severity="danger">
                            </Badge>
                        </Tab>
                        <Tab value="4" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '4' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-list-check" style="color: slateblue"></i>
                            Bitacora
                        </Tab>
                        <Tab v-if="documentos" value="5" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '5' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-folder-plus" style="color: slateblue"></i>
                            Facturas
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <!-- Generales -->
                        <TabPanel value="0">
                            <div class="row mb-2">
                                <label for="kms" class="col-form-label col-form-label-sm col-sm-2">Kilometraje</label>
                                <div class="col-sm-2">
                                    <InputNumber v-model="registro.kms" :min="0" :max="999999999" fluid
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }" disabled>
                                    </InputNumber>
                                </div>
                                <label for="combustible" class="col-form-label col-form-label-sm col-sm-2">Nivel Combustible</label>
                                <div class="col-sm-2">
                                    <InputNumber v-model="registro.nivel_combustible" fluid suffix="%"
                                        :pt="{ pcInputText: { root:{ class: 'text-center'}} }" disabled/>
                                    <Slider v-model="registro.nivel_combustible" :min="0" :max="100" :step="1" disabled>
                                    </Slider>
                                </div>
                            </div>
                            <div class="row mb-0">
                                <label for="kms" class="col-form-label col-form-label-sm col-sm-2">Fallas Reportadas</label>
                            </div>
                            <div class="row mb-2">
                                <Textarea v-model="registro.fallas_reportadas" rows="5" disabled>
                                </Textarea>
                            </div>
                        </TabPanel>
                        <!-- Trabajos/Servicios -->
                        <TabPanel value="1">
                            <DataTable :value="trabajos_orden"
                                show-gridlines  
                                scroll-height="300px" size="small" scrollable
                                >
                                <Column field="id"                          header="ID" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="talle_trabajo.talle_division.descripcion_division"   
                                    header="División" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="talle_trabajo.trabajo"       header="Descripción" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="talle_tecnico.tecnico"       header="Técnico" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="horas_estandar"              header="Hrs.Estandar" class="text-end" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="horas_facturadas"            header="Hrs.Facturadas"  class="text-end" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="estatus"                     header="Estatus" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="{ data }">
                                        <Tag :value="data.estatus"
                                            :severity="data.estatus == 'SinIniciar' ? 'secondary' :
                                                        data.estatus == 'EnProceso' ? 'success' :
                                                        data.estatus == 'Pausa' ? 'warn' :
                                                        data.estatus == 'Cancelado' ? 'danger': 'info'">
                                        </Tag>
                                    </template>
                                </Column>
                                <Column class="w-24 text-center" header="Acciones" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="{ data }">
                                        <SplitButton rounded
                                            :model="[
                                                {
                                                    label: 'Consultar',
                                                    icon: 'pi pi-search',
                                                    command: () => {
                                                        openDialogRefaccion('Consultar',data.id);
                                                    }
                                                },
                                            ]"
                                            severity="success"
                                            raised size="small" class="me-2"
                                            :button-props="{'aria-label': data.id}"
                                            :menuButtonProps="{'aria-label': data.id}"
                                            @click="openDialogRefaccion('Consultar',data.id)"
                                            v-tooltip.top="{ 
                                                value:      'Solicitar o Consultar Refacciones al Trabajo',
                                                showDelay:  1000,
                                            }"
                                        >
                                            <i class="pi pi-wrench"></i>
                                            <Badge v-if="data.talle_requisicion_detalles.length > 0"
                                                :value="data.talle_requisicion_detalles.length" severity="danger">
                                            </Badge>
                                        </SplitButton>
                                        <Button
                                            severity="info"
                                            raised rounded size="small"
                                            icon="pi pi-search"
                                            v-tooltip.top="{ 
                                                value:      'Consulta el trabajo de la orden',
                                                showDelay:  1000,
                                            }" class="me-2"
                                            @click="openDialogTrabajo(data.id,'Show')">
                                        </Button>
                                    </template>
                                </Column>
                            </DataTable>
                        </TabPanel>
                        <!-- Refacciones -->
                        <TabPanel value="2">
                            <div class="row mb-2">
                                <DataTable :value="orden_refacciones"
                                    show-gridlines  
                                    scroll-height="300px" size="small" scrollable>
                                    <Column field="id" header="ID" 
                                        :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                    <Column field="codigo" header="Código" 
                                        :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                    <Column field="descripcion" header="Descripción" 
                                        :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                    <Column field="cantidad" header="Cantidad" class="text-end"
                                        :pt="{ headerCell: { class: 'bg-secondary text-end'} }"></Column>
                                    <Column field="costo" header="Costo" class="text-end"
                                        :pt="{ headerCell: { class: 'bg-secondary text-end'} }">
                                        <template #body="{data}">
                                            {{ formatCurrency(data.costo) }}
                                        </template>
                                    </Column>    
                                    <Column field="precio" header="Precio" class="text-end"
                                        :pt="{ headerCell: { class: 'bg-secondary text-end'} }">
                                        <template #body="{data}">
                                            {{ formatCurrency(data.precio) }}
                                        </template>
                                    </Column>
                                    <Column field="importe" header="Importe" class="text-end"
                                        :pt="{ headerCell: { class: 'bg-secondary text-end'} }">
                                        <template #body="{data}">
                                            {{ formatCurrency(data.importe) }}
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </TabPanel>
                        <!-- Miscelaneos -->
                        <TabPanel value="3">
                            <DataTable :value="miscelaenos_orden" 
                                show-gridlines  
                                scroll-height="300px" size="small" scrollable
                                >
                                <Column field="id" header="ID" 
                                    :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="descripcion" header="Descripción" 
                                    :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="cantidad"    header="Cantidad" 
                                    :pt="{ headerCell: { class: 'bg-secondary'} }" class="text-end">
                                    <template #body="slotProps">
                                        {{ formatNumber2Dec(slotProps.data.cantidad) }}
                                    </template>
                                </Column>
                                <Column field="costo" header="Costo" 
                                    :pt="{ headerCell: { class: 'bg-secondary'} }" class="text-end">
                                        <template #body="slotProps">
                                            {{ formatCurrency(slotProps.data.costo) }}
                                        </template>
                                </Column>
                                <Column field="importe" header="Importe" 
                                    :pt="{ headerCell: { class: 'bg-secondary'} }" class="text-end">
                                    <template #body="slotProps">
                                            {{ formatCurrency(slotProps.data.importe) }}
                                    </template>
                                </Column>
                                <Column field="estatus" header="Estatus" 
                                    :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column class="text-center"   header="Acciones" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="{ data }">
                                            <Button
                                                severity="info"
                                                raised rounded size="small"
                                                icon="pi pi-search"
                                                v-tooltip.top="{ 
                                                    value:      'Consulta el miscelaneo de la orden',
                                                    showDelay:  1000,
                                                }" class="me-2"
                                                @click="openDialogMiscelaneo(data.id,'Show')">
                                            </Button>
                                    </template>
                                </Column>
                            </DataTable>
                        </TabPanel>
                        <!-- Bitacora -->
                         <TabPanel value="4">
                            <div class="row mt-2 mb-2">
                                <label for="fechacreacion" class="col-form-label col-form-label-sm col-sm-2">Fecha Creación</label>
                                <div class="col-sm-2">
                                    <InputText :value="convertTMZdatetime(registro.fecha_alta.toString())"
                                        disabled fluid :pt="{ root: { class: 'text-end fw-bold'} }">
                                    </InputText>
                                </div>
                                <label for="usuario" class="col-form-label col-form-label-sm col-sm-2">Usuario</label>
                                <div class="col-sm-6">
                                    <InputText disabled fluid :value="usuario_abre" class="fw-bold">
                                    </InputText>
                                </div>
                            </div>
                            <Divider></Divider>
                            <div class="row mb-2">
                                <label for="fechacierre" class="col-form-label col-form-label-sm col-sm-2">Fecha Cierre</label>
                                <div class="col-sm-2">
                                    <InputText :value="registro.fecha_cierre ? convertTMZdatetime(registro.fecha_cierre.toString()) : ''"
                                        disabled fluid :pt="{ root: { class: 'text-end fw-bold'} }">
                                    </InputText>
                                </div>
                                <label for="usuario" class="col-form-label col-form-label-sm col-sm-2">Usuario</label>
                                <div class="col-sm-6">
                                    <InputText disabled fluid :value="usuario_cierra" class="fw-bold">
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="nota_cerrada" class="col-form-label col-form-label-sm col-sm-2">Nota Cierre</label>
                                <div class="col-sm-10">
                                    <Textarea :value="registro.nota_cerrada ? registro.nota_cerrada : ''" fluid disabled class="fw-bold">
                                    </Textarea>
                                </div>
                            </div>
                            <Divider></Divider>
                            <div class="row mb-2">
                                <label for="fechacancela" class="col-form-label col-form-label-sm col-sm-2">Fecha Cancelación</label>
                                <div class="col-sm-2">
                                    <InputText :value="registro.fecha_cancela ? convertTMZdatetime(registro.fecha_cancela.toString()) : ''"
                                        disabled fluid :pt="{ root: { class: 'text-end text-primary fw-bold'} }">
                                    </InputText>
                                </div>
                                <label for="usuario" class="col-form-label col-form-label-sm col-sm-2">Usuario</label>
                                <div class="col-sm-6">
                                    <InputText disabled fluid :value="usuario_cancela" class="text-primary fw-bold">
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="motivo" class="col-form-label col-form-label-sm col-sm-2 ">Motivo</label>
                                <div class="col-sm-10">
                                    <InputText disabled fluid :value="motivo_cancela" class="text-primary fw-bold">
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="nota_cancela" class="col-form-label col-form-label-sm col-sm-2 ">Nota Cancelación</label>
                                <div class="col-sm-10">
                                    <Textarea :value="registro.nota_cancelada ? registro.nota_cancelada : ''" fluid disabled
                                        class="text-primary fw-bold">
                                    </Textarea>
                                </div>
                            </div>
                            <DataTable
                                :value="ordenBitacora"
                                show-gridlines scroll-height="flex" size="small" scrollable>
                                <Column field="fecha" header="Fecha" :pt="{ headerCell: { class: 'bg-secondary'} }" >
                                    <template #body="{data}">
                                        {{ convertTMZdatetime(data.fecha) }}
                                    </template>
                                </Column>
                                <Column field="estatus_antes" header="Estatus Anterior" :pt="{ headerCell: { class: 'bg-secondary'} }" />
                                <Column field="estatus_nuevo" header="Estatus Nuevo" :pt="{ headerCell: { class: 'bg-secondary'} }" />
                                <Column header="Usuario" :pt="{ headerCell: { class: 'bg-secondary'} }" >
                                    <template #body="{data}">
                                        {{ data.conf_usuario.usuario + ' | ' + data.conf_usuario.nombre }}
                                    </template>
                                </Column>
                                <Column field="nota" header="Notas" :pt="{ headerCell: { class: 'bg-secondary'} }" />
                            </DataTable>
                         </TabPanel>
                         <!-- Facturas/Documentos -->
                         <TabPanel value="5">
                            <DataTable :value="documentos"
                                show-gridlines  
                                scroll-height="300px" size="small" scrollable>
                                <Column field="tipo_documento" header="Tipo Documento" :pt="{ headerCell: { class: 'bg-secondary'} }" ></Column>
                                <Column field="folio" header="Folio" :pt="{ headerCell: { class: 'bg-secondary'} }" ></Column>
                                <Column field="serie" header="Serie" :pt="{ headerCell: { class: 'bg-secondary'} }" ></Column>
                                <Column field="estatus" header="Estatus" :pt="{ headerCell: { class: 'bg-secondary'} }" ></Column>
                                <Column field="fecha" header="Fecha" :pt="{ headerCell: { class: 'bg-secondary'} }" >
                                    <template #body="{data}">
                                        {{  convertTMZdatetime(data.fecha)  }}
                                    </template>
                                </Column>
                                <Column field="total" header="Total" class="text-end" :pt="{ headerCell: { class: 'bg-secondary'} }" >
                                    <template #body="{data}">
                                        {{  formatCurrency(data.total)  }}
                                    </template>
                                </Column>
                                <Column field="saldo" header="Saldo" class="text-end" :pt="{ headerCell: { class: 'bg-secondary'} }" >
                                    <template #body="{data}">
                                        {{  formatCurrency(data.saldo)  }}
                                    </template>
                                </Column>
                            </DataTable>
                         </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </form>    
    </div>
    <!-- DIALOGO REFACCIONES -->
    <Dialog
        v-model:visible="dialogRefaccion"
        modal :closable="false" maximizable
        :header="tipo_operacion_refaccion == 'Solicitar' ? 'Solicitar Refacciones para el Trabajo'
                                                : 'Consulta Refacciones para el Trabajo'"
        :style="{width: '75vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }"
        >
        <div class="row mt-2 mb-2">
            <Toolbar class="mb-6">
                <template #start>
                    <Button v-if="tipo_operacion_refaccion == 'Solicitar'"
                        label="Agregar Refacción" raised icon="pi pi-plus" severity="success" size="small"
                        @click="openDialogRefaccionDet()">
                    </Button>
                </template>
            </Toolbar>
        </div>
        <DataTable :value="refacciones_orden"
            show-gridlines scroll-height="flex" size="small" scrollable>
            <Column field="id" header="ID" class="text-center" :pt="{ headerCell: { class: 'bg-secondary'} }" />
            <Column header="Folio Req" class="text-center"
                :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{data}">
                    <template v-if="data.talle_requisicion">
                        {{ data.talle_requisicion.folio }}
                    </template>
                </template>
            </Column>
            <Column field="codigo" header="Código" :pt="{ headerCell: { class: 'bg-secondary'} }" />
            <Column field="cantidad" header="Cantidad" class="text-end" :pt="{ headerCell: { class: 'bg-secondary'} }" />
            <Column field="descripcion" header="Descripción" :pt="{ headerCell: { class: 'bg-secondary'} }" />
        </DataTable>
        <template #footer>
            <Button 
                raised
                @click="closeDialogRefaccion('cerrar')"
                label="Cerrar"
                severity="secondary"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
    </Dialog>
    <!-- DIALOGO TRABAJO -->
    <Dialog
        v-model:visible="dialogTrabajo"
        modal :closable="false" maximizable
        :header="tipo_operacion_trabajo == 'Create' ? 'Nuevo un Trabajo' :
                    tipo_operacion_trabajo == 'Update' ? 'Editar Trabajo' : 'Consulta Trabajo'"
        :style="{width: '75rem'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }"
        >
        <div class="row mt-2 mb-2">
            <label for="tecnicotrabajo" class="required col-form-label col-form-label-sm col-sm-2">Técnico</label>
            <div class="col-sm-4">
                <Select
                    v-model="selectecnicotrabajo" :options="tecnicos"
                    placeholder="Seleccione un Técnico"
                    :option-label="(data) => {return data.nombres+' '+data.apaterno+' '+data.amaterno}"
                    fluid size="small"
                    :disabled="tipo_operacion_trabajo == 'Show'">
                </Select>
            </div>
        </div>
        <div class="row mb-2">
            <label for="trabajo" class="required col-form-label col-form-label-sm col-sm-2">Trabajo/Servicio</label>
            <div class="col-sm-7">
                <AutoComplete
                    v-model="selecttrabajo"
                    :option-label="(data) => {return (data.codigo+' '+data.descripcion).trim()}"
                    :suggestions="trabajosfiltrados"
                    force-selection :chip-Icon="true"
                    auto-option-focus
                    empty-search-message="No existen trabajos que coincidan"
                    empty-selection-message="No se ha seleccionado un trabajo"
                    placeholder="Capture un trabajo por codigo o descripcion"
                    @complete="buscarTrabajos" fluid size="small"
                    @option-select="() => {trabajo_orden.horas_estandar = parseFloat(selecttrabajo.horasestandar);
                                            trabajo_orden.descripcion = selecttrabajo.descripcion;
                                        }"
                    :disabled="tipo_operacion_trabajo == 'Show'">
                </AutoComplete>
            </div>
            <label for="horas_estandard" class="required col-form-label col-form-label-sm col-sm-1">Horas</label>
            <div class="col-sm-2">
                <InputNumber id="horas_estandard" v-model="trabajo_orden.horas_estandar" highlight-on-focus
                    :min="0.01" :max="9999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small"
                    :disabled="tipo_operacion_trabajo == 'Show'">
                </InputNumber>
            </div>
        </div>
        <template v-if="selecttrabajo">
            <div v-if="selecttrabajo.descvariable" class="row mb-2">
                <label for="descripcion" class="required col-form-label col-form-label-sm col-sm-2">Descripción</label>
                <div class="col-sm-7">
                    <InputText v-model="trabajo_orden.descripcion"
                        :disabled="tipo_operacion_trabajo == 'Show'">
                    </InputText>
                </div>
            </div>
        </template>
        <div class="row mb-2">
            <label for="notas" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
            <div class="col-sm-10">
                <Textarea v-model="trabajo_orden.notas" rows="3" fluid
                    :disabled="tipo_operacion_trabajo == 'Show'">
                </Textarea>
            </div>
        </div>
        <div class="row mb-2">
            <h2>BITACORA DEL TRABAJO</h2>
        </div>
        <DataTable :value="trabajosbitacora"
            show-gridlines  
            scroll-height="300px" size="small" scrollable>
            <Column field="id" header="ID" :pt="{ headerCell: { class: 'bg-secondary'} }" />
            <Column header="Técnico" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    {{ `${data.talle_tecnico.nombres} ${data.talle_tecnico.apaterno} ${data.talle_tecnico.amaterno}` }}
                </template>
            </Column>
            <Column header="Estatus" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    <Tag :value="data.estatus"
                        :severity="data.estatus == 'Inicio' ? 'success' :
                                    data.estatus == 'Pausa' ? 'warn' :
                                    data.estatus == 'Cancelado' ? 'danger': 'info'">
                    </Tag>
                </template>
            </Column>
            <Column header="Inicio" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    {{ `${convertTMZdatetime(data.fecha_inicio)}` }}
                </template>
            </Column>
            <Column header="Termina" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    {{ data.fecha_fin ? `${convertTMZdatetime(data.fecha_fin)}` : '' }}
                </template>
            </Column>
            <Column field="comentarios" header="Comentario" :pt="{ headerCell: { class: 'bg-secondary'} }" />
        </DataTable>
        <template #footer>
            <Button 
                raised
                @click="closeDialogTrabajo('cerrar')"
                label="Cerrar"
                severity="secondary"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
            <Button v-if="tipo_operacion_trabajo != 'Show'" 
                raised
                label="Guardar"
                severity="success"
                @click="closeDialogTrabajo('guardar')"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
    </Dialog>
    <!-- DIALOGO NUEVO MISCELANEO -->
    <Dialog
        v-model:visible="dialogMiscelaneo"
        modal :closable="false"
        :header="tipo_operacion_misc == 'Create' ? 'Nuevo Miscelaneo' :
                    tipo_operacion_misc == 'Update' ? 'Editar Miscelaneo' : 'Consulta Miscelaneo'"
        :style="{width: '65rem'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }"
        >
        <div class="row mt-2 mb-2">
            <label for="descripcion" class="required col-form-label col-form-label-sm col-sm-2">Descripción</label>
            <div class="col-sm-10">
                <InputText v-model="miscelaneo_orden.descripcion" fluid maxlength="254"
                    :disabled="tipo_operacion_misc == 'Show'">
                </InputText>
            </div>
        </div>
        <div class="row mb-2">
            <label for="cantidad" class="required col-form-label col-form-label-sm col-sm-2">Cantidad</label>
            <div class="col-sm-2">
                <InputNumber v-model="miscelaneo_orden.cantidad" :min="1" :max="999999" fluid highlight-on-focus
                    @blur="() => { miscelaneo_orden.importe = miscelaneo_orden.cantidad * miscelaneo_orden.costo }"
                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                    :disabled="tipo_operacion_misc == 'Show'">
                </InputNumber>
            </div>
            <label for="costo" class="required col-form-label col-form-label-sm col-sm-2">Costo Unitario</label>
            <div class="col-sm-2">
                <InputNumber v-model="miscelaneo_orden.costo" :min="0" :max="99999999.99" 
                    mode="currency" currency="USD" locale="en-US" fluid highlight-on-focus
                    :min-fraction-digits="2" :max-fraction-digits="2"
                    @blur="() => { miscelaneo_orden.importe = miscelaneo_orden.cantidad * miscelaneo_orden.costo }"
                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                    :disabled="tipo_operacion_misc == 'Show'">
                </InputNumber>
            </div>
            <label for="importe" class="col-form-label col-form-label-sm col-sm-2">Importe Total</label>
            <div class="col-sm-2">
                <InputNumber v-model="miscelaneo_orden.importe" :min="1" :max="99999999.99" 
                    mode="currency" currency="USD" locale="en-US"  fluid
                    :min-fraction-digits="2" :max-fraction-digits="2" disabled
                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                </InputNumber>
            </div>
        </div>
        <div class="row mb-2">
            <label for="notas" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
            <div class="col-sm-10">
                <Textarea v-model="miscelaneo_orden.notas" rows="3" maxlength="500" fluid
                :disabled="tipo_operacion_misc == 'Show'"></Textarea>
            </div>
        </div>
        <template #footer>
            <Button 
                raised
                @click="closeDialogMiscelaneo('cerrar')"
                label="Cerrar"
                severity="secondary"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
    </Dialog>
    <!-- DIALOGO VISUALIZACIÓN PDF -->
    <Dialog
        v-model:visible="dialogPDFVisor"
        modal maximizable closable
        :header="`Vista Previa Orden de Servicio ${registro.folio} ${registro.serie}`"
        :style="{width: '80vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    content: { style: 'height: 660px'},
                    footer: { class: 'bg-secondary' } 
                }"
    >
        <!-- <embed id="viewPDF" width="100%" height="100%" style="padding: 5px;" :src="pdfDocumento" type="application/pdf"> -->
        <iframe :src="pdfDocumento" width="100%" height="100%"></iframe>
        <template #footer>
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
    <!-- DIALOGO FACTURAR -->
    <Dialog
        v-model:visible="dialogFacturar"
        modal :closable="false" maximizable
        :style="{width: '80rem'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }"
        >
        <template #header>
            <div class="row col-sm-12">
                <label class="col-form-label col-form-label-sm col-sm-9 fs-2 fw-bold">Facturación de orden (Seleccione los conceptos a facturar)</label>
                <label class="col-form-label col-form-label-sm col-sm-1"></label>
                <label class="col-form-label col-form-label-sm col-sm-2 fs-2 fw-bold text-end text-primary">{{ formatCurrency(totalRef_facturar + totaltra_facturar + totalmis_facturar) }}</label>
            </div>
        </template>
        <div class="row mt-2 mb-2">
            <label for="clientefactura" class="required col-form-label col-form-label col-sm-3">Cliente para facturación</label>
            <div class="col-sm-9">
                <AutoComplete
                    v-model="selectclientefact"
                    :option-label="(data) => {return (data.tipo_persona == 'Moral' ? data.razon_social : data.nombres+' '+data.apaterno+' '+data.amaterno)+' RFC:'+data.rfc}"
                    :suggestions="clientesfiltrados"
                    force-selection :chip-Icon="true"
                    auto-option-focus 
                    empty-search-message="No existen clientes que coincidan"
                    empty-selection-message="No se ha seleccionado un cliente"
                    placeholder="Capture un cliente por RFC, Nombre o Razón Social"
                    @complete="buscarClientes" fluid
                >
                </AutoComplete>
            </div>
        </div>
        <Accordion :value="['0','1','2']" multiple>
            <AccordionPanel value="0">
                <AccordionHeader class="bg-secondary">
                    <div class="row col-sm-12">
                        <label class="col-form-label col-form-label-sm col-sm-3 fs-3 fw-bold">Trabajos/Servicios</label>
                        <label class="col-form-label col-form-label-sm col-sm-7"></label>
                        <label class="col-form-label col-form-label-sm col-sm-2 fs-3 fw-bold text-end text-primary">{{ formatCurrency(totaltra_facturar) }}</label>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <DataTable
                        :value="trabajos_orden" 
                        v-model:selection="trabajos_orden_fact"
                        data-key="id"  
                        class="p-datatable-sm"
                        stripedRows
                        show-gridlines
                        scrollable editMode="cell"
                        @cell-edit-complete="onCellEditTrabajos"
                        :pt="{
                            header: {class: 'bg-primary text-center bg-opacity-50'}
                        }">
                        <Column selectionMode="multiple" headerStyle="width: 3rem" :pt="{ headerCell: { class: 'bg-light-danger'} }"></Column>
                        <Column header="Trabajo" :pt="{ headerCell: { class: 'bg-light-danger'} }">
                            <template #body="{data}">
                                {{ data.talle_trabajo.trabajo }}
                            </template>
                        </Column>
                        <Column field="horas_estandar" header="Horas Estandar" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }"></Column>
                        <Column field="horas_facturadas" header="Horas a Facturar" 
                            body-class="bg-light-warning"
                            :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }">
                            <template #body="{data}">
                                {{  data.horas_facturadas }}
                            </template>
                            <template #editor="{data,field}">
                                <InputNumber
                                    v-model="data[field]" autofocus fluid
                                    highlight-on-focus :min-fraction-digits="2" :max-fraction-digits="2"
                                    :pt="{ pcInputText: { root:{ class: 'text-end text-primary fw-bold'}} }">
                                </InputNumber>
                            </template>
                        </Column>
                        <Column field="importe" header="Importe" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }">
                            <template #body="{data}">
                                {{  formatCurrency(data.importe) }}
                            </template>
                        </Column>
                        <Column field="estatus" header="Estatus" :pt="{ headerCell: { class: 'bg-light-danger text-center'}, root: {class: 'text-center'} }">
                            <template #body="{ data }">
                                <Tag :value="data.estatus"
                                    :severity="data.estatus == 'SinIniciar' ? 'secondary' :
                                                data.estatus == 'EnProceso' ? 'success' :
                                                data.estatus == 'Pausa' ? 'warn' :
                                                data.estatus == 'Cancelado' ? 'danger': 'info'">
                                </Tag>
                            </template>
                        </Column>
                        <Column fiel="documento_detalle_id" header="Facturado" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-center'} }"
                            body-class="fw-bold">
                            <template #body="{ data }">
                                {{ data.documento_detalle_id > 0 ? 'SI' : 'NO' }}
                            </template>
                        </Column>
                    </DataTable>
                </AccordionContent>
            </AccordionPanel>
            <AccordionPanel value="1">
                <AccordionHeader class="bg-secondary">
                    <div class="row col-sm-12">
                        <label class="col-form-label col-form-label-sm col-sm-2 fs-3 fw-bold">Refacciones</label>
                        <label class="col-form-label col-form-label-sm col-sm-8"></label>
                        <label class="col-form-label col-form-label-sm col-sm-2 fs-3 fw-bold text-end text-primary">{{ formatCurrency(totalRef_facturar) }}</label>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <DataTable
                        :value="orden_refacciones" 
                        v-model:selection="orden_refacciones_fact"
                        data-key="id"  
                        class="p-datatable-sm"
                        striped-rows
                        show-gridlines
                        scrollable editMode="cell"
                        @cell-edit-complete="onCellEditComplete"
                        :pt="{
                            header: {class: 'bg-primary text-center bg-opacity-50'}
                        }">
                        <Column selectionMode="multiple" headerStyle="width: 3rem" :pt="{ headerCell: { class: 'bg-light-danger'} }"></Column>
                        <Column header="Codigo" :pt="{ headerCell: { class: 'bg-light-danger'} }">
                            <template #body="{data}">
                                {{ data.codigo }}
                            </template>
                        </Column>
                        <Column field="descripcion" header="Descripción" :pt="{ headerCell: { class: 'bg-light-danger'} }">
                        </Column>
                        <Column field="cantidad" header="Cantidad" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }">
                        </Column>
                        <Column field="costo" header="Costo Unitario" 
                            body-class="bg-light-warning"
                            :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }">
                            <template #body="{data}">
                                {{  formatCurrency(data.costo) }}
                            </template>
                            <template #editor="{data,field}">
                                <InputNumber
                                    v-model="data[field]" mode="currency" currency="USD" locale="en-US" autofocus fluid
                                    highlight-on-focus :min-fraction-digits="2" :max-fraction-digits="2"
                                    :pt="{ pcInputText: { root:{ class: 'text-end text-primary fw-bold'}} }">
                                </InputNumber>
                            </template>
                        </Column>
                        <Column field="precio" header="Precio Unitario" 
                            body-class="bg-light-warning"
                            :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }">
                            <template #body="{data}">
                                {{  formatCurrency(data.precio) }}
                            </template>
                            <template #editor="{data,field}">
                                <InputNumber
                                    v-model="data[field]" mode="currency" currency="USD" locale="en-US" autofocus fluid
                                    highlight-on-focus :min-fraction-digits="2" :max-fraction-digits="2"
                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                                </InputNumber>
                            </template>
                        </Column>
                        <Column field="importe" header="Importe" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }">
                            <template #body="{data}">
                                {{  formatCurrency(data.importe) }}
                            </template>
                        </Column>
                        <Column field="documento_detalle_id" header="Facturado"  :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-center'} }"
                            body-class="fw-bold">
                            <template #body="{data}">
                                {{ data.documento_detalle_id > 0 ? 'SI' : 'NO' }}
                            </template>
                        </Column>
                    </DataTable>
                </AccordionContent>
            </AccordionPanel>
            <AccordionPanel value="2">
                <AccordionHeader class="bg-secondary">
                    <div class="row col-sm-12">
                        <label class="col-form-label col-form-label-sm col-sm-3 fs-3 fw-bold">Material Diverso</label>
                        <label class="col-form-label col-form-label-sm col-sm-7"></label>
                        <label class="col-form-label col-form-label-sm col-sm-2 fs-3 fw-bold text-end text-primary">{{ formatCurrency(totalmis_facturar) }}</label>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <template v-if="miscelaenos_orden.length > 0">
                        <div class="row mt-2 mb-2">
                            <div class="col-sm-6">
                                <label for="agruparDiversos" class="fs-5 fw-bold bg-light-warning">Agrupar los materiales diversos en un solo concepto en la factura </label>
                            </div>
                            <div class="col-sm-1">
                                <Checkbox id="agruparDiversos" class="bg-warming" v-model="agruparDiversos" binary fluid></Checkbox>
                            </div>
                        </div>
                    </template>
                    <DataTable
                        :value="miscelaenos_orden" 
                        v-model:selection="miscelaneos_orden_fact"
                        data-key="id"  
                        class="p-datatable-sm"
                        stripedRows
                        show-gridlines
                        scrollable
                        :pt="{
                            header: {class: 'bg-primary text-center bg-opacity-50'}
                        }">
                        <Column selectionMode="multiple" headerStyle="width: 3rem" :pt="{ headerCell: { class: 'bg-light-danger'} }"></Column>
                        <Column field="descripcion" header="Descripción" :pt="{ headerCell: { class: 'bg-light-danger'} }">
                        </Column>
                        <Column field="cantidad" header="Cantidad" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }"></Column>
                        <Column field="costo" header="Costo" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }">
                            <template #body="{data}">
                                {{  formatCurrency(data.costo) }}
                            </template>
                        </Column>
                        <Column field="importe" header="Importe" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-end'} }">
                            <template #body="{data}">
                                {{  formatCurrency(data.importe) }}
                            </template>
                        </Column>
                        <Column field="estatus" header="Estatus" :pt="{ headerCell: { class: 'bg-light-danger'}, root: {class: 'text-center'} }"
                            body-class="fw-bold">
                        </Column>
                    </DataTable>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
        <template #footer>
            <Button 
                raised
                @click="closeDialogFacturar('cerrar')"
                label="Cerrar"
                severity="secondary"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
            <Button 
                raised
                label="Facturar"
                severity="success"
                icon="pi pi-check"
                @click="closeDialogFacturar('guardar')"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
    </Dialog>
    <!-- DIALOGO CAMBIAR ESTATUS -->
    <Dialog
        v-model:visible="dialogEstatus"
        modal :closable="false"
        :header="tipo_estatus == 'Cerrada' ? 'Cerrar Orden' :
                    tipo_estatus == 'Garantia' ? 'Cerrar como Garantía la orden' : 'Cancelar Orden'"
        :style="{width: '75rem'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }"
        >
        <div class="row mt-2 mb-2">
            <label for="fecha" class="required col-form-label col-form-label-sm col-sm-2">Fecha</label>
            <div class="col-sm-2"> 
                <DatePicker :defaultValue="new Date()"
                    disabled fluid>
                </DatePicker>
            </div>
        </div>
        <template v-if="tipo_estatus=='Cancelada' || tipo_estatus=='Garantia'">
            <div class="row mb-2">
                <label for="motivos" class="required col-form-label col-form-label-sm col-sm-2">Motivo</label>
                <div class="col-sm-6">
                    <Select
                        v-model="selectmotivo" :options="motivos"
                        placeholder="Seleccione un Motivo"
                        option-label="descripcion"
                        fluid 
                        :disabled="tipo_operacion_trabajo == 'Show'">
                    </Select>
                </div>
            </div>
        </template>
        <template v-if="tipo_estatus=='Cancelada' || tipo_estatus=='Garantia'">
            <div class="row mb-2">
                <label for="nota" class="required col-form-label col-form-label-sm col-sm-2">Nota</label>
                <div class="col-sm-10">
                    <Textarea v-model="registro.nota_cancelada" rows="2" fluid size="large">
                    </Textarea>
                </div>
            </div>
        </template>
        <template v-if="tipo_estatus=='Cerrada'">
            <div class="row mb-2">
                <label for="nota" class="required col-form-label col-form-label-sm col-sm-2">Nota</label>
                <div class="col-sm-10">
                    <Textarea v-model="registro.nota_cerrada" rows="2" fluid size="large">
                    </Textarea>
                </div>
            </div>
        </template>
        <template #footer>
            <Button 
                raised
                @click="closeDialogEstatus('cerrar')"
                label="Cerrar"
                severity="secondary"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
            <Button 
                raised
                label="Aceptar"
                severity="success"
                icon="pi pi-check"
                @click="closeDialogEstatus('guardar')"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
    </Dialog>
    <Toast />
    <Toast group="uploadfile">
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
    
    <ConfirmDialog />
</template>

<style scoped>

</style>
