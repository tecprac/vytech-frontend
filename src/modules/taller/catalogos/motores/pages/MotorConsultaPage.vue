<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useMotor from '../composables/useMotor';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { watch } from 'vue';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
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
        pdfDocumento,
        dialogPDFVisor,
        pdfViewer,

        VisualizarPDF,
        cerrarVisualizarPDF,
        
    } = useMotor( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.replace('/motores')
})

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consulta Motor</h2>
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
                    <label for="descripcion" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="descripcion" v-model="registro.descripcion" 
                            maxlength="120" disabled
                            :pt="{root: { class: 'col-sm-12'}}">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="marca" class="required col-form-label col-sm-2">Marca</label>
                    <div class="col-sm-4">
                        <InputText v-if="registro.talle_marca" v-model="registro.talle_marca.marca" disabled
                            :pt="{root: { class: 'col-sm-12'}}">
                        >
                        </InputText>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="ficha" class="col-form-label col-sm-2" v-tooltip.top="'Especificaciones y/o observaciones detalladas del motor'">
                        Ficha Técnica
                        <i class="pi pi-info-circle" style="font-size: 1rem;"></i>
                    </label>
                    <div class="col-sm-10">
                        <Textarea
                            v-model="registro.ficha_tecnica"
                            rows="3" disabled
                            :pt="{ root: { class: 'col-sm-12' }}"
                        >
                        </Textarea>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col-sm-2">
                        <Button
                            v-if="registro.file_name"
                            label="Ver Archivo PDF"
                            @click="VisualizarPDF"
                            icon="pi pi-file-pdf"
                        >
                        </Button>
                    </div>
                </div>
        </div>
        <div class="card-footer">
            <Button
                severity="secondary" label="Regresar"
                class="me-4" raised icon="pi pi-arrow-left"
                @click="() => { router.push({name: 'motores'})}">
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
        <!-- <embed id="viewPDF" width="100%" height="100%" style="padding: 5px;" :src="pdfDocumento" type="application/pdf"> -->
        <!-- <iframe :src="pdfDocumento" width="100%" height="100%"></iframe> -->
        <VuePdfEmbed ref="pdfViewer" 
            :annotation-layer="true" 
            :text-layer="true" 
            :source="pdfDocumento"
            >
        </VuePdfEmbed>
        <template #footer>
            <Button
                raised
                @click="() => { pdfViewer.download(registro.descripcion) }"
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