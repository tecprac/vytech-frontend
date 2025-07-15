<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import useRepFacturaClientes from '../composables/useRepFacturaClientes';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DatePicker from 'primevue/datepicker';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import RadioButton from 'primevue/radiobutton';
import AutoComplete from 'primevue/autocomplete';
import Select from 'primevue/select';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart,LineChart} from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';

import { 
    ToolboxComponent,
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    DataZoomComponent, 
} from 'echarts/components';

import VChart, { THEME_KEY } from 'vue-echarts';

use([
    ToolboxComponent,
    TooltipComponent,
    TitleComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
    BarChart,
    LineChart,
    CanvasRenderer,
    UniversalTransition
]);

provide(THEME_KEY,'light');

const {
    // Propiedades
    loading,
    fechaini,
    fechafin,
    dtdatos,
    selectcliente,
    clientesfiltrados,
    filtro_saldo,
    filtros_saldo,
    tabActiva,
    registros,
    columnas,

    //Metodos
    GenerarReporte,
    formatNumber,
    exportarCSV,
    exportarExcel,
    formatDateTime,
    formatNumber2Dec,
    formatCurrency,
    buscarClientes

} = useRepFacturaClientes();

</script>

<template>
    <div class="card-header border-0 pt-2 bg-secondary">
        <h2 class="card-title">REPORTE DE FACTURAS POR CLIENTE</h2>
    </div>
    <div class="card-body pt-2 py-0">
        <Accordion value="0" class="mb-2">
            <AccordionPanel value="0" >
                <AccordionHeader class="bg-primary text-white fw-bold">FILTROS DEL REPORTE</AccordionHeader>
                <AccordionContent>
                    <div class="row mt-2 mb-2">
                        <label for="cliente" class="col-form-label col-sm-2">Cliente</label>
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
                                @complete="buscarClientes" fluid>
                            </AutoComplete>
                        </div>
                        <div class="col-sm-2 fv-row">
                            <Button 
                                severity="success" raised
                                :loading="loading"
                                @click="GenerarReporte()"
                                label="Generar Reporte"
                                icon="pi pi-filter-fill">
                            </Button>
                        </div>
                    </div>
                    <div class="row">
                        <label for="cliente" class="col-form-label col-sm-2">Filtrar Saldo</label>
                        <div class="col-sm-2">
                            <Select v-model="filtro_saldo" :options="filtros_saldo" 
                                option-value="valor" option-label="name"
                            fluid>
                            </Select>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
        <Tabs value="0" @update:value="(value: string | number) => { tabActiva = value.toString()}">
            <TabList>
                <Tab value="0" as="div" class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                        :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                        <i class="pi pi-list" style="color: slateblue"></i>
                        Datos
                </Tab>
            </TabList>
            <TabPanels>
                <!-- Datos -->
                <TabPanel value="0">
                    <DataTable
                        :value="registros"
                        ref="dtdatos"
                        striped-rows
                        scrollable
                        show-gridlines
                        scroll-height="400px">
                        <template #header>
                            <div style="text-align: left">
                                <Button severity="success" icon="pi pi-file-excel"
                                @click="exportarExcel" :disabled="registros.length == 0"
                                size="small" raised label="Exportar">
                                </Button>
                            </div>
                        </template>
                        <template #empty> No existen registros con los filtros seleccionados. </template>
                        <Column v-for="col of columnas" :key="col.field" :field="col.field" :header="col.header" sortable>
                            <template #body="{data}">
                                <template v-if="col.field == 'subtotal'">
                                    <div class="text-end">
                                    $ {{ formatNumber2Dec(+data[col.field]) }}
                                    </div>
                                </template>
                                <template v-else-if="col.field == 'impuestos'">
                                        {{ formatCurrency(+data[col.field]) }}
                                </template>
                                <template v-else-if="col.field == 'total'">
                                        {{ formatCurrency(+data[col.field]) }}
                                </template>
                                <template v-else-if="col.field == 'saldo'">
                                        {{ formatCurrency(+data[col.field]) }}
                                </template>
                                <template v-else-if="col.field == 'fecha'">
                                        {{ formatDateTime(data[col.field]) }}
                                </template>
                                <template v-else-if="col.field == 'fecha_vende'">
                                        {{ formatDateTime(data[col.field],'SHOWNOTIME') }}
                                </template>
                                <template v-else-if="col.field == 'adm_cliente'">
                                        {{ data[col.field]['tipo_persona'] == 'Moral' ?  data[col.field]['razon_social'] : data[col.field]['nombre'] }}
                                </template>
                                <template v-else-if="col.field == 'adm_propietario'">
                                        {{ data[col.field]['tipo_persona'] == 'Moral' ?  data[col.field]['razon_social'] : data[col.field]['nombre'] }}
                                </template>
                                <template v-else-if="col.field == 'conf_usuario'">
                                        {{ data[col.field]['usuario'] }}
                                </template>
                                <template v-else-if="col.field == 'sat_metodopago'">
                                        {{ data[col.field]['c_metodopago'] }}
                                </template>
                                <template v-else-if="col.field == 'sat_formapago'">
                                        {{ data[col.field]['c_formapago'] }}
                                </template>
                                <template v-else>
                                    {{ data[col.field] }}
                                </template>
                            </template>
                    </Column>                        
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
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
</template>