<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import type { Orden } from '@/modules/taller/modulos/orden/interfaces/interfaces';
import useOrden from '../composables/useOrden';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
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
import Row from 'primevue/row';
import AutoComplete from 'primevue/autocomplete';
import Select from 'primevue/select';
import Message from 'primevue/message';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import FileUpload from 'primevue/fileupload';
import Toolbar from 'primevue/toolbar';
import ProgressSpinner from 'primevue/progressspinner';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import Dialog from 'primevue/dialog';
import SplitButton from 'primevue/splitbutton';
import Slider from 'primevue/slider';
import Textarea from 'primevue/textarea';
import Badge from 'primevue/badge';


// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const router  = useRouter();
const toast   = useToast();
const auth    = useAuthStore();
const confirm = useConfirm();

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
    tabActiva,
    trabajo_orden,
    trabajos_orden,
    dialogTrabajo,
    dialogRefaccion,
    dialogRefaccionDet,
    dialogMiscelaneo,
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

    dataMutationNew,
    newRegistro,
    updateRegistro,
    cambiaDocumento,
    buscarClientes,
    buscarUnidad,
    buscarTrabajos,
    buscarProductos,
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
    formatCurrency,
    formatNumber2Dec,
} = useOrden(0);

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
        <h2>Nueva Orden</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validarDatos(registro)">
            <div class="card-body border-0 pt-0 pb-0">
                <Toolbar style="border-radius: 1rem; padding: 1rem 1rem 1rem 1.5rem;" class="bg-secondary" size="small" >
                    <template #start>
                        <Button
                            severity="secondary" label="Regresar" size="small"
                            class="ms-2" raised icon="pi pi-arrow-left"
                            @click="() => { router.push({name: 'orden'})}">
                        </Button>
                        <Button v-if="registro.id == 0" raised icon="pi pi-plus" class="ms-2" severity="success" label="Crear"
                            @click="validarDatos(registro)" size="small" :loading="isAdding">
                        </Button>
                        <Button v-if="registro.id > 0" raised icon="pi pi-plus" class="ms-2" severity="success" label="Guardar"
                            @click="validarDatos(registro)" size="small">
                        </Button>
                        <SplitButton v-if="registro.id > 0" raised icon="pi pi-file-pdf" class="ms-2"
                            @click="generaPDF('Blanco')" severity="info" label="PDF Orden" size="small" :model="botonespdf" >

                        </SplitButton>
                    </template>
                    <template #end></template>
                </Toolbar>
                <div class="row mt-4 mb-2">
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
                            option-label="documento" fluid size="small"
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
                                            registro.estatus=='Pausa' ? 'warn' :
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
                            placeholder="Seleccione un Tipo de Servicio"
                            option-label="descripcion" fluid size="small">
                        </Select>
                    </div>
                    <label for="cliente" class="required col-form-label col-form-label-sm col-sm-1">Cliente</label>
                    <div class="col-sm-6">
                        <AutoComplete
                            v-model="selectcliente"
                            :option-label="(data) => {return (data.tipo_persona == 'Moral' ? data.razon_social : data.nombres+' '+data.apaterno+' '+data.amaterno)+' RFC:'+data.rfc}"
                            :suggestions="clientesfiltrados"
                            force-selection :chip-Icon="true"
                            auto-option-focus 
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
                            placeholder="Selecciones un Técnico"
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
                            auto-option-focus
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
                            fluid size="small">
                        </Select>
                    </div>
                </div>
                <Tabs v-if="registro.id > 0" value="0" @update:value="( value:string | number ) => { tabActiva = value.toString() }">
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
                        </Tab>
                        <Tab value="2" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '2' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-wrench" style="color: slateblue"></i>
                            Refacciones
                        </Tab>
                        <Tab value="3" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                            :pt="{root: { class: tabActiva == '3' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                            <i class="pi pi-clipboard" style="color: slateblue"></i>
                            Miscelaneos
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <!-- Generales -->
                        <TabPanel value="0">
                            <div class="row mb-2">
                                <label for="kms" class="col-form-label col-form-label-sm col-sm-2">Kilometraje</label>
                                <div class="col-sm-2">
                                    <InputNumber v-model="registro.kms" :min="0" :max="999999999" fluid
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                                    </InputNumber>
                                </div>
                                <label for="combustible" class="col-form-label col-form-label-sm col-sm-2">Nivel Combustible</label>
                                <div class="col-sm-2">
                                    <InputNumber v-model="registro.nivel_combustible" fluid suffix="%"
                                        :pt="{ pcInputText: { root:{ class: 'text-center'}} }"/>
                                    <Slider v-model="registro.nivel_combustible" :min="0" :max="100" :step="1">
                                    </Slider>
                                </div>
                            </div>
                            <div class="row mb-0">
                                <label for="kms" class="col-form-label col-form-label-sm col-sm-2">Fallas Reportadas</label>
                            </div>
                            <div class="row mb-2">
                                <Textarea v-model="registro.fallas_reportadas" rows="5">
                                </Textarea>
                            </div>
                        </TabPanel>
                        <!-- Trabajos/Servicios -->
                        <TabPanel value="1">
                            <div class="row mb-4">
                                <div class="col-sm-2">
                                    <Button label="Agregar Trabajo" raised icon="pi pi-plus" severity="success" size="small"
                                        @click="openDialogTrabajo(0,'Create')">
                                    </Button>
                                </div>
                            </div>
                            <DataTable :value="trabajos_orden" 
                                show-gridlines  
                                scroll-height="300px" size="small" scrollable
                                >
                                <Column field="id"                          header="ID" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="talle_trabajo.talle_division.descripcion_division"   
                                    header="División" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="talle_trabajo.trabajo"       header="Descripción" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="talle_tecnico.tecnico"       header="Técnico" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="horas_estandar"              header="Horas" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column field="estatus"                     header="Estatus" :pt="{ headerCell: { class: 'bg-secondary'} }"></Column>
                                <Column class="w-24 !text-center"           header="Acciones" :pt="{ headerCell: { class: 'bg-secondary'} }">
                                    <template #body="{ data }">
                                        <SplitButton rounded
                                            :model="[
                                                {
                                                    label: 'Solicitar',
                                                    icon: 'pi pi-pencil',
                                                    command: () => {
                                                        openDialogRefaccion('Solicitar',data.id);
                                                    }
                                                },
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
                                        <Button v-if="data.estatus=='SinIniciar' || data.estatus=='EnProceso' || data.estatus=='Pausa'"
                                            severity="warn"
                                            raised rounded size="small" icon="pi pi-pen-to-square"
                                            v-tooltip.top="{ 
                                                value:      'Edita el trabajo de la orden',
                                                showDelay:  1000,
                                            }" class="me-2"
                                            @click="openDialogTrabajo(data.id,'Update')">
                                        </Button>
                                        <Button
                                            severity="danger"
                                            raised rounded size="small"
                                            icon="pi pi-trash"
                                            v-tooltip.top="{ 
                                                value:      'Elimina o Cancela el trabajo de la orden',
                                                showDelay:  1000,
                                            }"
                                            @click="eliminaTrabajo($event,data)">
                                        </Button>
                                    </template>
                                </Column>
                            </DataTable>
                        </TabPanel>
                        <!-- Refacciones -->
                        <TabPanel value="2">
                            <div class="row mb-2">
                                
                            </div>
                        </TabPanel>
                        <!-- Miscelaneos -->
                        <TabPanel value="3">
                            <div class="row mb-2">
                                <div class="col-sm-2">
                                    <Button label="Agregar Miscelaneo" raised icon="pi pi-plus" size="small" severity="success"
                                        @click="openDialogMiscelaneo(0,'Create')">
                                    </Button>
                                </div>
                            </div>
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
                                            <Button v-if="data.estatus=='SinFacturar'"
                                                severity="warn"
                                                raised rounded size="small" icon="pi pi-pen-to-square"
                                                v-tooltip.top="{ 
                                                    value:      'Edita el miscelaneo de la orden',
                                                    showDelay:  1000,
                                                }" class="me-2"
                                                @click="openDialogMiscelaneo(data.id,'Update')">
                                            </Button>
                                            <Button v-if="data.estatus=='SinFacturar'"
                                                severity="danger"
                                                raised rounded size="small"
                                                icon="pi pi-trash"
                                                v-tooltip.top="{ 
                                                    value: 'Elimina o Cancela el miscelaneo de la orden',
                                                        showDelay: 1000,
                                                    }"
                                                @click="eliminaMiscelaneo($event,data)">
                                            </Button>
                                    </template>
                                </Column>
                            </DataTable>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </form>    
    </div>
    <!-- DIALOGO REFACCIONES DETALLE -->
    <Dialog
        v-model:visible="dialogRefaccionDet"
        modal :closable="false"
        header="Agregar Refacción"
        :style="{width: '70vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }">
        <div class="row mt-2 mb-2">
            <label for="refaccion" class="required col-form-label col-form-label-sm col-sm-2">Refacción</label>
            <div class="col-sm-7">
                <AutoComplete
                    v-model="selectproducto"
                    :option-label="(data) => {return (data.codigo+' '+data.descripcion).trim()}"
                    :suggestions="productosfiltrados"
                    force-selection :chip-Icon="true"
                    auto-option-focus
                    empty-search-message="No existen refacciones que coincidan"
                    empty-selection-message="No se ha seleccionado una refacción"
                    placeholder="Capture una refacción por codigo o descripcion"
                    @complete="buscarProductos" fluid size="small"
                    >
                </AutoComplete>
            </div>
            <label for="cantidad_refaccion" class="required col-form-label col-form-label-sm col-sm-1">Cantidad</label>
            <div class="col-sm-2">
                <InputNumber id="cantidad_refaccion" v-model="refaccion_orden.cantidad" highlight-on-focus
                    :min="0.00" :max="9999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                    :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small">
                </InputNumber>
            </div>
        </div>
        <div class="row mb-2">
            <label for="notas" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
            <div class="col-sm-10">
                <Textarea v-model="refaccion_orden.observaciones" rows="3" fluid>
                </Textarea>
            </div>
        </div>
        <template #footer>
            <Button 
                @click="closeDialogRefaccionDet('cerrar')"
                label="Cerrar" raised
                severity="secondary"
                icon="pi pi-times"
                :pt="{ root: { class: 'mt-2'} }">
            </Button>
            <Button
                label="Guardar" raised
                severity="success"
                @click="closeDialogRefaccionDet('guardar')"
                :pt="{ root: { class: 'mt-2'} }">
            </Button>
        </template>
    </Dialog>
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
            show-gridlines scroll-height="300px" size="small" scrollable>
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
            <Column class="text-center" header="Acciones" :pt="{ headerCell: { class: 'bg-secondary'} }" >
                <template #body="{data}">
                    <Button v-if="tipo_operacion_refaccion == 'Solicitar'"
                        raised roundec size="small"
                        icon="pi pi-trash" severity="danger" 
                        v-tooltip.top="{ 
                        value: 'Elimina la refacción de la solicitud', showDelay: 1000,}"
                        @click="eliminaRefaccion($event,data)">
                    </Button>
                </template>
            </Column>
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
            <Button
                v-if="refacciones_orden.length > 0 && tipo_operacion_refaccion == 'Solicitar'"
                label="Guardar" raised
                :loading="isLoadingRequi"
                @click="closeDialogRefaccion('guardar')"
                severity="success" icon="pi pi-check"
                :pt="{ root: { class: 'mt-2'} }">
            </Button>
        </template>
    </Dialog>
    <!-- DIALOGO TRABAJO -->
    <Dialog
        v-model:visible="dialogTrabajo"
        modal :closable="false"
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
        <div class="row mb-2">
            <label for="notas" class="col-form-label col-form-label-sm col-sm-2">Notas</label>
            <div class="col-sm-10">
                <Textarea v-model="trabajo_orden.notas" rows="3" fluid
                :disabled="tipo_operacion_trabajo == 'Show'"></Textarea>
            </div>
        </div>
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
    <!-- DIALOGO MISCELANEO -->
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
            <Button 
                v-if="tipo_operacion_misc != 'Show'"
                raised
                label="Guardar"
                severity="success"
                @click="closeDialogMiscelaneo('guardar')"
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
    
    <!-- <ConfirmDialog></ConfirmDialog> -->
    <ConfirmPopup></ConfirmPopup>
</template>

<style scoped>

</style>
