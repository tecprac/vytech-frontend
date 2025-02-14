<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import type { Orden } from '@/modules/taller/modulos/orden/interfaces/interfaces';
import useOrden from '../composables/useOrden';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Checkbox from 'primevue/checkbox';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DatePicker from 'primevue/datepicker';
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
import Dialog from 'primevue/dialog';
import VuePdfEmbed from 'vue-pdf-embed'

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const route = useRoute();
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

    dataMutationNew,
    newRegistro,
    updateRegistro,
    cambiaDocumento,
    buscarClientes,
    buscarUnidad,
    generaPDF,
    cerrarVisualizarPDF,
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
        <h2>Nueva Orden</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validarDatos(registro)">
            <div class="card-body border-0 pt-0 pb-0">
                <Toolbar style="border-radius: 2rem; padding: 1rem 1rem 1rem 1.5rem;" size="small" >
                    <template #start>
                        <Button
                            severity="secondary" label="Regresar" size="small"
                            class="ms-2" rounded raised icon="pi pi-arrow-left"
                            @click="() => { router.push({name: 'orden'})}">
                        </Button>
                        <Button v-if="registro.id > 0" rounded raised icon="pi pi-file-pdf" class="ms-2" 
                            @click="generaPDF" severity="info" label="PDF Orden" size="small">
                        </Button>
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
            </div>
        </form>    
    </div>
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
    
    <ConfirmDialog />
</template>

<style scoped>

</style>
