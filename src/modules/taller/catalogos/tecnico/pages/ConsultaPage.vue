<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useTecnico from '../composables/useTecnico';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import DatePicker from 'primevue/datepicker';
import InputMask from 'primevue/inputmask';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import VuePdfEmbed from 'vue-pdf-embed'

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const route = useRoute();
const router = useRouter();

const {
    registro, 
    isPending, 
    isError,
    dataMutationUpdate,
    isUpdatingSuccess,
    imgURL,
    selectedestado,
    estadosfiltrados,
    tabActiva,
    dialogPDFVisor,
    pdfViewer,
    pdfDocumento,

    buscarEstados,
    VisualizarPDF,
    cerrarVisualizarPDF,
} = useTecnico( +route.params.id );

watch( isUpdatingSuccess, () => {
    setTimeout(() => {
        dataMutationUpdate.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/tecnicos')
})

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consulta Técnico</h2>
    </div>
    <div v-if="registro"> 
        <div class="card-body border-0 pt-0 pb-0">
            <div class="row mb-2">
                <label for="id" class="col-form-label col-sm-2">ID</label>
                <div class="col-sm-2">
                    <InputNumber id="id" v-model="registro.id" maxlength="120" disabled
                    :pt="{  root: { class: 'col-sm-12'}, 
                            pcInputText: { root:{ class: 'text-end'}}
                        }">
                    </InputNumber>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-sm-4 fv-row">
                    <label class="required form-label fs-6 fw-semibold mb-2">
                        Nombre(s)
                    </label>
                    <InputText v-model="registro.nombres" disabled
                        class="form-control">
                    </InputText>
                </div>
                <div class="col-sm-4 fv-row">
                    <label class="required form-label fs-6 fw-semibold mb-2">
                        Apellido Paterno
                    </label>
                    <InputText v-model="registro.apaterno" disabled
                        class="form-control">
                    </InputText>
                </div>
                <div class="col-sm-4 fv-row">
                    <label class="required form-label fs-6 fw-semibold mb-2">
                        Apellido Materno
                    </label>
                    <InputText v-model="registro.amaterno" disabled
                        class="form-control">
                    </InputText>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-sm-4 fv-row">
                    <label class="required form-label fs-6 fw-semibold mb-2">
                        Fecha Nacimiento
                    </label>
                    <DatePicker v-model="registro.fecha_nacimiento" disabled
                        show-icon :show-on-focus="false" fluid>
                    </DatePicker>
                </div>
                <div class="col-sm-4 fv-row">
                    <label class="required form-label fs-6 fw-semibold mb-2">
                        RFC
                    </label>
                    <InputMask v-model="registro.rfc" mask="aaaa-999999-***"
                        placeholder="????-000000-???" :unmask="true"
                        class="form-control" disabled>
                    </InputMask>
                </div>
                <div class="col-sm-4 fv-row">
                    <label class="required form-label fs-6 fw-semibold mb-2">
                        CURP
                    </label>
                    <InputText v-model="registro.curp" maxlength="18"
                        class="form-control" disabled>
                    </InputText>
                </div>
            </div>
            <div class="row mb-5">
                    <div class="col-sm-4 fv-row">
                        <label class="form-label fs-6 fw-semibold mb-2">
                            NSS
                            <i class="pi pi-info-circle" style="font-size: 1rem;"
                                v-tooltip.top="'Numero de Seguridad Social'" />
                        </label>
                        <InputText v-model="registro.nss" maxlength="20" fluid disabled>
                        </InputText>
                    </div>
                </div>
            <Tabs value="0" @update:value="(value:string | number) => { tabActiva = value.toString() }">
                <TabList>
                    <Tab value="0" as="div" class="flex items-center gap-2" 
                        :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}"
                        >
                        <i class="pi pi-home" style="color: slateblue"></i>
                        Dirección
                    </Tab>
                    <Tab value="1" as="div" class="flex items-center gap-2" 
                        :pt="{root: { class: tabActiva == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}">
                        <i class="pi pi-users" style="color: slateblue"></i>
                        Contacto
                    </Tab>
                    <Tab value="2" as="div" class="flex items-center gap-2" 
                        :pt="{root: { class: tabActiva == '2' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}">
                        <i class="pi pi-wrench" style="color: slateblue"></i>
                        Operativos
                    </Tab>
                </TabList>
                <TabPanels>
                    <!-- Dirección -->
                    <TabPanel value="0"> 
                        <div class="row mb-2">
                            <label for="calle" class="col-form-label col-sm-2">Calle y numero</label>
                            <div class="col-sm-10">
                                <InputText id="calle" v-model="registro.calle" maxlength="120"
                                    disabled fluid>
                                </InputText>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <label for="colonia" class="col-form-label col-sm-2">Colonia</label>
                            <div class="col-sm-7">
                                <InputText id="colonia" v-model="registro.colonia" maxlength="120"
                                    disabled fluid>
                                </InputText>
                            </div>
                            <label for="cp" class="col-form-label col-sm-1">CP</label>
                            <div class="col-sm-2">
                                <InputText id="cp" v-model="registro.cp" maxlength="120"
                                    disabled fluid>
                                </InputText>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <label for="municipio" class="col-form-label col-sm-2">Municipio</label>
                            <div class="col-sm-5">
                                <InputText id="municipio" v-model="registro.municipio" maxlength="120" 
                                    disabled fluid>
                                </InputText>
                            </div>
                            <label for="estado" class="required col-form-label col-sm-2">Estado</label>
                            <div class="col-sm-3">
                                <AutoComplete
                                    v-model="selectedestado"
                                    option-label="descripcion"
                                    :suggestions="estadosfiltrados"
                                    empty-search-message="No existen estados que coincidan"
                                    empty-selection-message="No se ha se leccionado un estado"
                                    placeholder="Capture un estado"
                                    @complete="buscarEstados"
                                    fluid  disabled
                                >
                                </AutoComplete>
                            </div>
                        </div>
                    </TabPanel>
                    <!-- Contacto -->
                    <TabPanel value="1">
                        <div class="row mb-2">
                            <div class="col-sm-4 fv-row">
                                <label class="form-label fs-6 fw-semibold mb-2">
                                    Telefono Fijo
                                </label>
                                <InputMask v-model="registro.telefonocasa" mask="(999) 999-9999"
                                    placeholder="(999) 999-9999" :unmask="true"
                                    class="form-control" disabled>
                                </InputMask>
                            </div>
                            <div class="col-sm-4 fv-row">
                                <label class="required form-label fs-6 fw-semibold mb-2">
                                    Telefono Celular
                                </label>
                                <InputMask v-model="registro.celular" mask="(999) 999-9999"
                                    placeholder="(999) 999-9999" :unmask="true"
                                    class="form-control" disabled>
                                </InputMask>
                            </div>
                            <div class="col-sm-4 fv-row">
                                <label class="required form-label fs-6 fw-semibold mb-2">
                                    Correo electrónico
                                </label>
                                <InputText v-model="registro.email" type="email"
                                    pattern="[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}"
                                    class="form-control" disabled>
                                </InputText>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4 fv-row">
                                <label class="form-label fs-6 fw-semibold mb-2">
                                    Nombre Contacto
                                </label>
                                <InputText v-model="registro.nombrecontacto"
                                    class="form-control" disabled>
                                </InputText>
                            </div>
                            <div class="col-sm-4 fv-row">
                                <label class="required form-label fs-6 fw-semibold mb-2">
                                    Parentesto
                                </label>
                                <InputText v-model="registro.parentesco"
                                    class="form-control" disabled>
                                </InputText>
                            </div>
                            <div class="col-sm-4 fv-row">
                                <label class="required form-label fs-6 fw-semibold mb-2">
                                    Telefono Contacto
                                </label>
                                <InputMask v-model="registro.telefonocontacto" mask="(999) 999-9999"
                                    placeholder="(999) 999-9999" :unmask="true"
                                    class="form-control" disabled>
                                </InputMask>
                            </div>
                        </div>
                    </TabPanel>
                    <!-- Operativo -->
                    <TabPanel value="2">
                        <div class="row mb-4">
                            <div class="col-sm-4 fv-row">
                                <label class="form-label fs-6 fw-semibold mb-2">
                                    Especialidad
                                </label>
                                <InputText v-model="registro.especialidad"
                                    class="form-control" disabled>
                                </InputText>
                            </div>
                            <div class="col-sm-4 fv-row">
                                <label class="required form-label fs-6 fw-semibold mb-2">
                                    Costo Hora
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                        v-tooltip.top="'Indica el costo por hora que se le paga al técnico'" />
                                </label>
                                <InputNumber id="costo" v-model="registro.costo_hora" mode="currency" currency="USD" locale="en-US"
                                    :min="0" :max="9999999.99"  disabled
                                    :min-fraction-digits="2" fluid highlight-on-focus
                                    :pt="{root: { class: 'col-sm-10'},
                                    pcInputText: { root:{ class: 'text-end'}}}">
                                </InputNumber>
                            </div>
                            <div class="col-sm-2 fv-row">
                                <label class="form-label fs-6 fw-semibold mb-2">
                                    Categoria
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                        v-tooltip.top="'Clasificación del nivel de experiencia del técnico'" />
                                </label>
                                <InputText v-model="registro.categoria" maxlength="3"
                                    class="form-control" disabled>
                                </InputText>
                            </div>
                            <div class="col-sm-2 fv-row">
                                <label class="form-label fs-6 fw-semibold mb-2">
                                    PIN
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                        v-tooltip.top="'PIN secreto para validar la identidad del técnico '" />
                                </label>
                                <Password v-model="registro.pin" maxlength="4" toggle-mask  disabled
                                    fluid>
                                </Password>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="ficha" class="col-form-label col-sm-2" >
                                Comentarios
                                <i class="pi pi-info-circle" 
                                    v-tooltip.top="'Descripción adicional de habilidades del técnico'"
                                style="font-size: 1rem;"></i>
                            </label>
                            <div class="col-sm-10">
                                <Textarea
                                    v-model="registro.comentarios"
                                    rows="3"  disabled
                                    :pt="{ root: { class: 'col-sm-12' }}"
                                >
                                </Textarea>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-sm-2">
                                <Image :src="imgURL" alt="Imagen Técnico" width="250" preview />
                            </div>
                        </div>
                        <Divider />
                        <div class="row mb-2">
                            <div class="col-sm-2">
                                <Button
                                    v-if="registro.file_pdf"
                                    label="Ver PDF 1"
                                    @click="VisualizarPDF(registro.file_pdf)"
                                    icon="pi pi-file-pdf"
                                    severity="info"
                                    size="small"
                                    raised
                                >
                                </Button>
                            </div>
                            <div class="col-sm-2">
                                <Button
                                    v-if="registro.file_pdf2"
                                    label="Ver PDF 2"
                                    @click="VisualizarPDF(registro.file_pdf2)"
                                    icon="pi pi-file-pdf"
                                    severity="info"
                                    size="small"
                                    raised
                                >
                                </Button>
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
        <div class="card-footer">
            <Button
                severity="secondary" label="Regresar"
                class="me-4" raised icon="pi pi-arrow-left"
                @click="() => { router.push({name: 'tecnicos'})}">
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
                @click="() => { pdfViewer.download(registro.rfc) }"
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