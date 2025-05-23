<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useParametro from '../composables/useParametro';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Tree from 'primevue/tree';
import Toast from 'primevue/toast';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';

const {
    isPending,
    grupos,
    tabActiva,
    parametros,
    valorboleano,

    onCellEditComplete,

} = useParametro();


</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-6">
        <div class="card-title">
            <strong>Configuración de Parametros del Sistema</strong>
        </div>
    </div>
    <div class="card-body border-0 pt-0 pb-0">
        <Tabs value="0" @update:value="( value:string | number) => { tabActiva = value.toString() }">
            <TabList>
                <Tab v-for="grupo in grupos" :key="grupo.id"
                    :value="grupo.id.toString()" as="div"
                    class="flex items-center gap-2" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                    :pt="{root: { class: tabActiva == grupo.id.toString() ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}" >
                    <i class="pi pi-list" style="color: slateblue"></i>
                    {{ grupo.grupo }}
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="grupo in grupos" :key="grupo.id"
                    :value="grupo.id.toString()">
                        <DataTable
                            :value="parametros.filter(item => item.grupo == grupo.grupo)"
                            edit-mode="cell" @cell-edit-complete="onCellEditComplete"
                            :pt="{ column: {
                                    bodycell: ({ state }) => ({
                                        class: [{ '!py-0': state['d_editing'] }]
                                    })
                                }}">
                            <Column header="ID" field="id" :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                                <template #body="{data}">
                                    {{ data.id }}
                                </template>
                            </Column>
                            <Column header="PARAMETRO" field="nombre" :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                                <template #body="{data}">
                                    {{ data.nombre }}
                                </template>
                            </Column>
                            <Column header="VALOR" field="valor" :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                                <template #body="{data}">
                                    {{ data.valor }}
                                </template>
                                <template #editor="{data }">
                                    <template v-if="data.tipodato == 'string'">
                                        <InputText v-model="data.valor" autofocus fluid></InputText>
                                    </template>
                                    <template v-if="data.tipodato == 'number'">
                                        <InputNumber v-model="data.valor" autofocus fluid highlight-on-focus
                                            :min-fraction-digits="2" :max-fraction-digits="2"
                                            :pt="{ pcInputText: { root: { class: 'text-end'}} }">
                                        </InputNumber>
                                    </template>
                                    <template v-if="data.tipodato == 'currency'">
                                        <InputNumber v-model="data.valor" autofocus fluid highlight-on-focus
                                            :min="0.00" mode="currency" currency="USD" locale="en-US"
                                            :min-fraction-digits="2" :max-fraction-digits="2"
                                            :pt="{ pcInputText: { root: { class: 'text-end'}} }">
                                        </InputNumber>
                                    </template>
                                    <template v-if="data.tipodato == 'boolean'">
                                        <Select v-model="data.valor" :options="valorboleano">
                                        </Select>
                                    </template>
                                </template>
                            </Column>
                            <Column header="USO" field="descripcion" :pt="{ headerCell: { class: 'bg-secondary text-center'} }">
                                <template #body="{data}">
                                    {{ data.descripcion }}
                                </template>
                            </Column>
                        </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
    <Toast/>
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