<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';
import type { Motor } from '../interfaces/interfaces';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useMotor from '../composables/useMotor';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const {
    registro, 
    isPending, 
    isError,
    dataMutationUpdate,
    isUpdating,
    isUpdatingSuccess,
    pdfDocumento,
    dialogPDFVisor,
    selectedmarca,
    marcasfiltradas,
    file_pdf,

    updateRegistro,
    VisualizarPDF,
    buscarMarcas,
    subirArchivo,
    selectFile
} = useMotor( +route.params.id );

watch( isUpdatingSuccess, () => {
    setTimeout(() => {
        dataMutationUpdate.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/motores')
})

const validarDatos = async (data:Motor ) => {
    if (data.descripcion.trim().length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'La descripción del Motor no puede estar vacía',
            life:       3000
        });
        return;
    }
    try {
        if (selectedmarca.value.id == 0) {
            toast.add({ severity:   'error',summary:    'Verificar',
                detail:     'Debe seleccionar una marca',life:       3000
            });
            return;
        }    
    } catch (error) {
        toast.add({ severity:   'error', summary:    'Verificar',
            detail:     'Debe seleccionar una marca', life: 3000});
        return;
    }
    data.marca_id = selectedmarca.value.id;
    await subirArchivo();
    data.file_name = registro.value.file_name;
    updateRegistro(data);
}

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Edita Motor</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validarDatos(registro!)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="row mb-2">
                    <label for="id" class="col-form-label col-sm-2">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" maxlength="120" disabled
                        :pt="{  root: { class: 'col-sm-2'}, 
                                pcInputText: { root:{ class: 'text-end'}}
                            }">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-5">
                    <label for="descripcion" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="descripcion" v-model="registro.descripcion" maxlength="120"
                            :pt="{root: { class: 'col-sm-12'}}">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="marca" class="required col-form-label col-sm-2">Marca</label>
                    <div class="col-sm-4">
                        <AutoComplete
                            v-model="selectedmarca"
                            option-label="descripcion"
                            :suggestions="marcasfiltradas"
                            force-selection
                            auto-option-focus
                            empty-search-message="No existen marcas que coincidan"
                            empty-selection-message="No se ha se leccionado una marca"
                            placeholder="Capture una marca"
                            @complete="buscarMarcas"
                            select-on-focus
                        >
                            <!-- <template #footer>
                                <div class="px-3 py-3">
                                    <Button label="Nueva Marca" fluid severity="secondary"
                                        text size="small" icon="pi pi-plus"
                                        @click="() => { dialogMarca = true; }"
                                    >
                                    </Button>
                                </div>
                            </template> -->
                        </AutoComplete>
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
                            rows="3"
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
                <div class="row mb-5">
                    <label for="file" class="col-form-label col-sm-2" 
                        v-tooltip.top="registro.file_name ? 'Ya existe un archivo adjunto, si sube un nuevo archivo se elimina el actual' :'Puede adjuntar un archivo pdf con información del motor'">
                        Subir Archivo (PDF)
                        <i class="pi pi-info-circle" style="font-size: 1rem;"></i>
                    </label>
                    <div class="col-sm-10">
                        <FileUpload
                            ref="file_pdf"
                            :multiple="true"
                            name="pdf[]"
                            accept="application/pdf"
                            :max-file-size="5000000"
                            :file-limit="1"
                            invalid-file-size-message="El archivo no puede se mayor a 5Mb"
                            invalid-file-type-message="Solo puede subir archivo en formato PDF"
                            :pt="{ root: { class: 'col-sm-12' }}"
                            :show-upload-button="false"
                            custom-upload
                            @select="selectFile"
                        >
                            <template #empty>
                                <span>Arrastre y suelte aqui el archivo.</span>
                            </template>
                        </FileUpload>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'motores'})}">
                </Button>
                <Button
                    severity="success" label="Guardar" type="submit"
                    class="me-4" raised icon="pi pi-check" :loading="isUpdating"
                >
                </Button>
            </div>
        </form>
    </div>
    <Dialog
        v-model:visible="dialogPDFVisor" 
        modal
        maximizable
        :closable="false"
        header="Visualización del Archivo PDF" 
        :style="{width: '70vw'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    content: { style: 'height: 660px'},
                    footer: { class: 'bg-secondary' } 
                }"
    >
        <embed id="viewPDF" width="100%" height="100%" style="padding: 5px;" :src="pdfDocumento" type="application/pdf">
        <template #footer>
            <Button 
                raised
                @click="() => { dialogPDFVisor = false; pdfDocumento = null}"
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