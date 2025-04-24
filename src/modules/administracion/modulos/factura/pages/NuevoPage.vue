<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import type { Documento } from '@/modules/administracion/modulos/factura/interfaces/interfaces';
import useDocumento from '../composables/useDocumento';
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
    isPending,
    registro,

    cambiaDocumento,
    buscarClientes,
    buscarProductos
} = useDocumento(0);


const validarDatos = async(data: Documento) => {

}

</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Nueva Factura</h2>
    </div>
    <div v-if="registro">
        <form @submit.prevent="validarDatos(registro)">
            <div class="card-body border-0 pt-0 pb-0">
                <Toolbar style="border-radius: 1rem; padding: 1rem 1rem 1rem 1.5rem;" class="bg-secondary" size="small">
                    <template #start>
                        <Button
                            severity="secondary" label="Regresar" size="small"
                            class="ms-2" raised icon="pi pi-arrow-left"
                            @click="() => { router.push({name: 'factura'})}">
                        </Button>
                        <!-- <Button v-if="registro.id == 0" raised icon="pi pi-plus" class="ms-2" severity="success" label="Crear"
                            @click="validarDatos(registro)" size="small" :loading="isAdding">
                        </Button> -->
                        <Button v-if="registro.id > 0" raised icon="pi pi-plus" class="ms-2" severity="success" label="Guardar"
                            @click="validarDatos(registro)" size="small">
                        </Button>
                    </template>
                    <template #end>

                    </template>
                </Toolbar>
            </div>
        </form>
    </div>
</template>
