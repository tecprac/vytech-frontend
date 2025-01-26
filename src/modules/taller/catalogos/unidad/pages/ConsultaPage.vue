<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useUnidad from '../composables/useUnidad';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Image from 'primevue/image';
import ProgressSpinner from 'primevue/progressspinner';
import VuePdfEmbed from 'vue-pdf-embed'
import useUtilerias from '@/core/helpers/utilerias';

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const route = useRoute();
const router = useRouter();

const { convertTMZdate } = useUtilerias();

const {
        registro, 
        isPending, 
        isError,
        tabActiva,
        pdfDocumento,
        imagenesURL,
        dialogPDFVisor,
        pdfViewer,

        VisualizarPDF,
        cerrarVisualizarPDF,
        
    } = useUnidad( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.replace('/unidad')
})

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consulta Unidad</h2>
    </div>
    <div v-if="registro"> 
        <div class="card-body border-0 pt-0 pb-0">
            <div class="row mb-2">
                    <label for="id" class="col-form-label col-sm-2">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" maxlength="120" disabled fluid
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <label for="id" class="col-form-label col-sm-2">Estatus</label>
                    <div class="col-sm-2">
                        <InputText v-model="registro.estatus" fluid disabled>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="numeroeco" class="required form-label fw-semibold mb-2">
                            Numero Económico
                        </label>
                        <InputText id="numeroeco" v-model="registro.numeroeco" fluid disabled></InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="numserie" class="form-label fw-semibold mb-2">
                            Numero Serie
                        </label>
                        <InputText id="numserie" v-model="registro.num_serie" fluid disabled></InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="placas" class="form-label fw-semibold mb-2">
                            Placas
                        </label>
                        <InputText id="placas" v-model="registro.placas" fluid disabled></InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="tipounidad" class="required form-label">
                            Tipo de Unidad
                        </label>
                        <InputText v-if="registro.talle_tipo_unidad" 
                            v-model="registro.talle_tipo_unidad.tipo_unidad" fluid disabled></InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="marca" class="required form-label">Marca</label>
                        <InputText v-if="registro.talle_marca" 
                            v-model="registro.talle_marca.marca" fluid disabled>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="modelo" class="required form-label">Modelo</label>
                        <InputText v-if="registro.talle_modelo" 
                            v-model="registro.talle_modelo.modelo" fluid disabled></InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="fechacompra" class="form-label">Fecha de Compra</label>
                        <InputText v-if="registro.fecha_compra" :value="convertTMZdate(registro.fecha_compra.toString())" fluid disabled>
                        </InputText>
                        <InputText v-if="!registro.fecha_compra" value="" fluid disabled>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="año" class="form-label">Año</label>
                        <InputText :value="registro.año" fluid disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="color" class="form-label">Color</label>
                        <InputText v-model="registro.color" placeholder="Color de la unidad" fluid disabled>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="motor" class="required form-label">Motor</label>
                        <InputText v-if="registro.talle_motor" 
                            v-model="registro.talle_motor.motor" fluid disabled>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="nsmotor" class="form-label">N/S Motor</label>
                        <InputText v-model="registro.num_motor" fluid disabled>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="kms" class="form-label">Kilometraje</label>
                        <InputNumber v-model="registro.kms" fluid disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>  
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="transmision" class="required form-label">Transmisión</label>
                        <InputText v-if="registro.talle_transmision" 
                            v-model="registro.talle_transmision.transmision" fluid disabled>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="nstransmision" class="form-label">N/S Transmisión</label>
                        <InputText v-model="registro.num_transmision" fluid disabled>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col-sm-4 fv-row">
                        <label for="clase" class="form-label">Clase</label>
                        <InputText v-model="registro.clase" fluid disabled>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="ejes" class="form-label">Numero de Ejes</label>
                        <InputNumber v-model="registro.ejes" fluid :min="1" :max="99" disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="combustible" class="form-label">Tipo de Combustible</label>
                        <InputText v-model="registro.combustible" fluid disabled></InputText>
                    </div>
                </div>
                <Tabs value="0" @update:value="(value: string | number) => { tabActiva = value.toString()}">
                    <TabList>
                        <Tab value="0" as="div" class="flex items-center gap-2" 
                            :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}"
                            >
                            <i class="pi pi-file" style="color: slateblue"></i>
                            Documentos
                        </Tab>
                        <Tab value="1" as="div" class="flex items-center gap-2" 
                            :pt="{root: { class: tabActiva == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}">
                            <i class="pi pi-images" style="color: slateblue"></i>
                            Imagenes
                        </Tab>
                    </TabList>
                    
                     <TabPanels>
                        <!-- Documentos -->
                        <TabPanel value="0">
                            <div class="row mb-2">
                                <div class="col-sm-4 fv-row">
                                    <label for="aseguradora" class="form-label">Aseguradora</label>
                                    <InputText v-model="registro.aseguradora" fluid disabled>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="poliza" class="form-label">N° Póliza</label>
                                    <InputText v-model="registro.polizaseguro" fluid disabled>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="vigencia" class="form-label">Vigencia Póliza</label>
                                    <InputText v-if="registro.vigenciapoliza" 
                                        :value="convertTMZdate(registro.vigenciapoliza.toString())" fluid disabled>
                                    </InputText>
                                    <InputText v-if="!registro.vigenciapoliza" 
                                        value="" fluid disabled>
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-5">
                                <div class="col-sm-4 fv-row">
                                    <label for="tarjeta" class="form-label">Tarjeta Circulación</label>
                                    <InputText v-model="registro.tarjetacircula" fluid disabled>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="permisosct" class="form-label">Permiso SCT</label>
                                    <InputText v-model="registro.permiso_sct" fluid disabled>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="arrendado" class="form-label">Es Arrendado</label>
                                    <div class="col-sm-2">
                                        <Checkbox v-model="registro.arrendado" binary fluid size="large" disabled></Checkbox>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div class="row mb-2">
                                <div class="col-sm-2">
                                    <Button
                                        v-if="registro.pdftcirculacion"
                                        label="Ver PDF Tarjeta"
                                        @click="VisualizarPDF(registro.pdftcirculacion)"
                                        icon="pi pi-file-pdf"
                                        severity="info"
                                        size="small"
                                        raised
                                    >
                                    </Button>
                                </div>
                                <div class="col-sm-2">
                                    <Button
                                        v-if="registro.pdfpolizaseguro"
                                        label="Ver PDF Póliza"
                                        @click="VisualizarPDF(registro.pdfpolizaseguro)"
                                        icon="pi pi-file-pdf"
                                        severity="info"
                                        size="small"
                                        raised
                                    >
                                    </Button>
                                </div>
                                    <Button
                                        v-if="registro.pdfpermisosct"
                                        label="Ver PDF Permiso"
                                        @click="VisualizarPDF(registro.pdfpermisosct)"
                                        icon="pi pi-file-pdf"
                                        severity="info"
                                        size="small"
                                        raised
                                    >
                                    </Button>
                            </div>
                        </TabPanel>
                        <!-- Imagenes -->
                        <TabPanel value="1">
                            <div class="row">
                                <template v-for="imagen of imagenesURL" :key="imagen">
                                    <div class="col-sm-2">
                                        <Image :src="imagen" alt="Imagen Unidad" width="150" preview ></Image>
                                    </div>
                                </template>
                            </div>
                        </TabPanel>
                     </TabPanels>
                </Tabs>
        </div>
        <div class="card-footer">
            <Button
                severity="secondary" label="Regresar"
                class="me-4" raised icon="pi pi-arrow-left"
                @click="() => { router.push({name: 'unidad'})}">
            </Button>
        </div>
    </div>
    <Dialog
        v-model:visible="dialogPDFVisor" 
        modal
        maximizable
        :closable="false"
        header="Visualización del Archivo PDF" 
        :style="{width: '80vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        @maximize="(event:any) => {console.log(event.screenX)}"
        @unmaximize="(event:any) => {console.log(event.screenX)}"
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
                @click="() => { pdfViewer.download(registro.placas) }"
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
    <Toast/>
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
</template>

<style scoped>

</style>