<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import useBitacora from '../composables/useBitacora';
import useUtilerias from '@/core/helpers/utilerias';
//Componentes PRIMEVUE
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import Select from 'primevue/select';
import ConfirmPopup from 'primevue/confirmpopup';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Tag from 'primevue/tag';
import AutoComplete from 'primevue/autocomplete';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import ProgressSpinner from 'primevue/progressspinner';
import InputNumber from 'primevue/inputnumber';

const { convertTMZdate,convertTMZdatetime,
    formatCurrency,formatNumber2Dec } = useUtilerias();

const {
    isPending,
    isLoading,
    selectunidad,
    unidadfiltradas,
    ordenes,
    selectorden,
    tabActiva,
    tabActivaDet,
    trabajos_orden,
    miscelaenos_orden,
    orden_refacciones,
    registro,
    documentos,
    ordenBitacora,
    dialogTrabajo,
    dialogRefaccion,
    dialogMiscelaneo,
    tipo_operacion_trabajo,
    tipo_operacion_misc,
    tipo_operacion_refaccion,
    refaccion_orden,
    refacciones_orden,
    tecnicos,
    selectecnicotrabajo,
    selecttrabajo,
    trabajosfiltrados,
    trabajo_orden,
    trabajosbitacora,
    miscelaneo_orden,
    bittrabajos,
    filters,
    bitrefacciones,
    filtersrefa,

    buscarUnidad,
    consultarUnidad,
    consultarOrden,
    openDialogRefaccion,
    openDialogTrabajo,
    openDialogMiscelaneo,
    closeDialogTrabajo,
    closeDialogMiscelaneo,
} = useBitacora();

</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-0">
        <h2 class="card-title">BITACORA DE UNIDAD</h2>
    </div>
    <div class="card-body border-0 pt-0 pb-0">
        <div class="row mb-2">
            <label for="unidad" class="required col-form-label col-sm-1">Unidad</label>
            <div class="col-sm-8">
                <AutoComplete
                    v-model="selectunidad"
                    :option-label="(data) => {return data.numeroeco+' PLACAS:'+data.placas+' Tipo: '+data.talle_tipo_unidad.tipo_unidad+' Marca: '+data.talle_marca.marca}"
                    :suggestions="unidadfiltradas"
                    force-selection :chip-Icon="true"
                    auto-option-focus
                    empty-search-message="No existen unidades que coincidan"
                    empty-selection-message="No se ha seleccionado una unidad"
                    placeholder="Capture una unidad por NoEconomico, Placas o Numero de Serie"
                    @complete="buscarUnidad" fluid  @item-select="consultarUnidad">
                </AutoComplete>
            </div>
            <div class="col-sm-1">
                <Button
                    label="Consultar" raised
                    :loading="isLoading"
                    icon="pi pi-search-plus"
                    @click="consultarUnidad">
                </Button>
            </div>
        </div>
        <Tabs value="0" scrollable @update:value="( value:string | number ) => { tabActiva = value.toString() }">
            <TabList>
                <Tab value="0" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                    :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                    <i class="pi pi-pen-to-square" style="color: slateblue"></i>
                    Ordenes
                </Tab>
                <Tab value="1" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                    :pt="{root: { class: tabActiva == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                    <i class="pi pi-user-edit" style="color: slateblue"></i>
                    Trabajos/Servicios
                    <!-- <Badge v-if="trabajos_orden.length > 0"
                            :value="trabajos_orden.length" severity="danger">
                    </Badge> -->
                </Tab>
                <Tab value="2" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                    :pt="{root: { class: tabActiva == '2' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                    <i class="pi pi-wrench" style="color: slateblue"></i>
                    Refacciones
                    <!-- <Badge v-if="orden_refacciones.length > 0"
                            :value="orden_refacciones.length" severity="danger">
                    </Badge> -->
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <DataTable
                        :value="ordenes" v-model:selection="selectorden" selection-mode="single" data-key="id"
                        show-gridlines scroll-height="300px" size="small" scrollable
                        tableStyle="min-width: 50rem" @row-select="consultarOrden">
                        <Column field="fecha_alta" header="Fecha Alta" sortable 
                            :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #body="{data}">
                                {{ convertTMZdatetime(data.fecha_alta) }}
                            </template>
                        </Column>
                        <Column field="folio" header="Orden" sortable 
                            :pt="{ headerCell: { class: 'bg-secondary'} }">
                        </Column>
                        <Column field="talle_tipo_servicio" header="Tipo Servicio"
                            :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #body="{data}">
                                {{ data.talle_tipo_servicio.tipo_servicio }}
                            </template>
                        </Column>
                        <Column field="estatus" header="Estatus" sortable 
                            :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #body="{data}">
                                <Tag
                                    :value="data.estatus"
                                    :severity="data.estatus=='Abierta' ? 'info' : 
                                                    data.estatus=='EnProceso' ? 'success' :
                                                    data.estatus=='Pausa' || data.estatus=='Garantia' ? 'warn':
                                                    data.estatus=='Cancelada' ? 'danger' : 'success' "
                                    >
                                </Tag>
                            </template>
                        </Column>
                        <Column field="fecha_cierre" header="Fecha Cierre" sortable 
                            :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #body="{data}">
                                {{ convertTMZdatetime(data.fecha_cierre) }}
                            </template>
                        </Column>
                        <Column field="talle_tecnico" header="Técnico"
                            :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #body="{data}">
                                {{ data.talle_tecnico.tecnico }}
                            </template>
                        </Column>
                        <Column field="kms" header="Kilometraje" class="text-end" sortable 
                            :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #body="{data}">
                                {{ formatNumber2Dec(data.kms) }}
                            </template>
                        </Column>
                    </DataTable>
                    <Divider></Divider>
                    <Tabs v-if="registro.id > 0" value="0" scrollable @update:value="( value:string | number ) => { tabActivaDet = value.toString() }">
                        <TabList>
                            <Tab value="0" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                                :pt="{root: { class: tabActivaDet == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                                <i class="pi pi-pen-to-square" style="color: slateblue"></i>
                                Generales
                            </Tab>
                            <Tab value="1" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                                :pt="{root: { class: tabActivaDet == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                                <i class="pi pi-user-edit" style="color: slateblue"></i>
                                Trabajos/Servicios
                                <Badge v-if="trabajos_orden.length > 0"
                                        :value="trabajos_orden.length" severity="danger">
                                </Badge>
                            </Tab>
                            <Tab value="2" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                                :pt="{root: { class: tabActivaDet == '2' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                                <i class="pi pi-wrench" style="color: slateblue"></i>
                                Refacciones
                                <Badge v-if="orden_refacciones.length > 0"
                                        :value="orden_refacciones.length" severity="danger">
                                </Badge>
                            </Tab>
                            <Tab value="3" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                                :pt="{root: { class: tabActivaDet == '3' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                                <i class="pi pi-clipboard" style="color: slateblue"></i>
                                Material Diverso
                                <Badge v-if="miscelaenos_orden.length > 0"
                                        :value="miscelaenos_orden.length" severity="danger">
                                </Badge>
                            </Tab>
                            <Tab value="4" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                                :pt="{root: { class: tabActivaDet == '4' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                                <i class="pi pi-list-check" style="color: slateblue"></i>
                                Bitacora
                            </Tab>
                            <Tab v-if="documentos" value="5" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                                :pt="{root: { class: tabActivaDet == '5' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
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
                                                    value:      'Consultar Refacciones al Trabajo',
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
                </TabPanel>
                <TabPanel value="1">
                    <DataTable v-model:filters="filters"
                        :value="bittrabajos" dataKey="id" filter-display="row"
                        show-gridlines scroll-height="600px" size="small" scrollable
                        tableStyle="min-width: 50rem">
                        <Column field="folio" header="Orden" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                        </Column>
                        <Column field="fecha_orden" header="Fecha Orden" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #body="{data}">
                                {{  convertTMZdatetime(data.fecha_orden)  }}
                            </template>
                        </Column>
                        <Column field="estatus_orden" header="Estatus Orden" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                        </Column>
                        <Column field="trabajo" header="Trabajo/Servicio" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" size="small"/>
                            </template>
                        </Column>
                        <Column field="notas" header="Notas" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                        </Column>
                        <Column field="tecnico" header="Técnico" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" size="small"/>
                            </template>
                        </Column>
                    </DataTable>
                </TabPanel>
                <TabPanel value="2">
                    <DataTable v-model:filters="filtersrefa"
                        :value="bitrefacciones" data-key="id" filter-display="row"
                        show-gridlines scroll-height="600px" size="small" scrollable
                        table-style="min-width: 50rem">
                        <Column field="folio" header="Orden" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                        </Column>
                        <Column field="fecha_alta" header="Fecha Orden" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #body="{data}">
                                {{  convertTMZdatetime(data.fecha_orden)  }}
                            </template>
                        </Column>
                        <Column field="codigo" header="Código" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" size="small"/>
                            </template>
                        </Column>
                        <Column field="descripcion" header="Descripcion" sortable :pt="{ headerCell: { class: 'bg-secondary'} }">
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" size="small"/>
                            </template>
                        </Column>
                        <Column field="cantidad" header="Cantidad" sortable class="text-end"
                            :pt="{ headerCell: { class: 'bg-secondary'} }">
                        </Column>
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>
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
                @click="() => { 
                                refacciones_orden.splice(0);
                                dialogRefaccion = false; 
                            }"
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
                    fluid size="small"
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
    <Toast/>
    <Toast group="waiting">
        <template #message="slotProps">
            <div class="font-medium text-lg my-4">{{ slotProps.message.summary }}</div>
            <ProgressSpinner
                style="width: 25px; height: 25px" strokeWidth="8"
                fill="transparent"
                animation-duration=".5s">
            </ProgressSpinner>
        </template>
    </Toast>
    <ConfirmPopup></ConfirmPopup>
</template>

<style scoped>

</style>