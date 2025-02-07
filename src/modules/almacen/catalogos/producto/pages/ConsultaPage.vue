<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Producto, Permisos } from '../interfaces/interfaces';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useProducto from '../composables/useProducto';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Checkbox from 'primevue/checkbox';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import VuePdfEmbed from 'vue-pdf-embed'
import { useAuthStore } from '@/stores/auth';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const route = useRoute();
const router = useRouter();
const auth   = useAuthStore();
const confirm   = useConfirm();

const permisos = ref<Permisos[]>([]);
const sPermisos = ref<string>('');
permisos.value = auth.permisos.filter((element: any) => element.codigo == '044'); // Modulo Almacén Producto
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

const {
    registro, 
    isPending, 
    isError,
    dataMutationUpdate,
    isUpdatingSuccess,
    imgURL,
    tabActiva,
    dialogPDFVisor,
    pdfViewer,
    pdfDocumento,

    VisualizarPDF,
    cerrarVisualizarPDF,
    deleteRegistro
} = useProducto( +route.params.id );

watch( isUpdatingSuccess, () => {
    setTimeout(() => {
        dataMutationUpdate.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.push({name: 'producto'})
})

const Eliminar = (data: Producto) => {
    confirm.require({
        header: 'Estas seguro de eliminar el registro ?',
        message: 'Esta acción no se podra revertir!',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Si, Eliminar',
            severity: 'danger'
        },
        accept: () => {
            deleteRegistro(data!);
        }
    });
}
</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consulta Producto</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="Eliminar(registro!)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="row mb-2">
                    <label for="id" class="col-form-label col-sm-1">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" maxlength="120" disabled
                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }" fluid>
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            Codigo
                        </label>
                        <InputText v-model="registro.codigo" disabled
                            class="form-control" maxlength="60" fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="form-label fs-6 fw-semibold mb-2">
                            Código Alterno
                        </label>
                        <InputText v-model="registro.codigo_alterno" disabled
                            class="form-control" maxlength="60" fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="form-label fs-6 fw-semibold mb-2">
                            Código de Barras
                        </label>
                        <InputText v-model="registro.codigo_barras" disabled
                            class="form-control" maxlength="60" fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col-sm-12 fv-row">
                        <label for="descripcion" class="required form-label fw-semibold">
                            Descripción
                        </label>
                        <InputText id="descripcion" disabled
                            v-model="registro.descripcion" maxlength="200" fluid>
                        </InputText>
                    </div>
                </div>
                <Tabs value="0" @update:value="(value:string | number) => { tabActiva = value.toString() }">
                    <TabList>
                        <Tab value="0" as="div" class="flex items-center gap-2" 
                            :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}"
                            >
                            <i class="pi pi-home" style="color: slateblue"></i>
                            Generales
                        </Tab>
                        <Tab value="1" as="div" class="flex items-center gap-2" 
                            :pt="{root: { class: tabActiva == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}">
                            <i class="pi pi-users" style="color: slateblue"></i>
                            CFDI / Impuestos
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <!-- Gemerales -->
                        <TabPanel value="0"> 
                            <div class="row mb-2">
                                <label for="tipoinventario" class="col-form-label col-sm-2">Tipo Inventario</label>
                                <div class="col-sm-2">
                                    <InputText v-if="registro.inv_tipo_inventario" 
                                        v-model="registro.inv_tipo_inventario.tipo_inventario"
                                        fluid disabled>
                                    </InputText>
                                </div>
                                <label for="unidadmedida" class="col-form-label col-sm-2">Unidad Medida</label>
                                <div class="col-sm-2">
                                    <InputText v-if="registro.adm_unidad_medida"
                                        v-model="registro.adm_unidad_medida.unidad_medida"
                                        fluid disabled>
                                    </InputText>
                                </div>
                                <label for="marca" class="col-form-label col-sm-2">Marca</label>
                                <div class="col-sm-2">
                                    <InputText v-if="registro.talle_marca"
                                        v-model="registro.talle_marca.marca"
                                        fluid disabled>
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="costorepo" class="col-form-label col-form-label-sm col-sm-2">
                                    Costo Reposición
                                    <i class="pi pi-info-circle" 
                                        v-tooltip.top="'Costo de reposición del producto'"
                                    style="font-size: 1rem;"></i>
                                </label>
                                <div class="col-sm-2">
                                    <InputNumber id="costo" v-model="registro.costo_reposicion" 
                                        :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                                        mode="currency" currency="MXN" locale="es-MX" highlight-on-focus disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small">
                                    </InputNumber>
                                </div>
                                <label for="margen" class="col-form-label col-form-label-sm col-sm-2">
                                    Margen Utilidad
                                    <i class="pi pi-info-circle" 
                                        v-tooltip.top="'Porcentaje(%) de incremento con respecto al costo para calcular el precio al cliente'"
                                    style="font-size: 1rem;"></i>
                                </label>
                                <div class="col-sm-2">
                                    <InputNumber id="margen" v-model="registro.margen_utilidad" 
                                        :min="0.00" :max="100.00" :max-fraction-digits="2" :min-fraction-digits="2" 
                                        locale="es-MX" highlight-on-focus fluid prefix="%" disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small">
                                    </InputNumber>
                                </div>
                                <label for="precio" class="col-form-label col-form-label-sm col-sm-2">
                                    Precio 
                                    <i class="pi pi-info-circle" 
                                        v-tooltip.top="'Precio unitario al cliente'"
                                    style="font-size: 1rem;"></i>
                                </label>
                                <div class="col-sm-2">
                                    <InputNumber id="precio" v-model="registro.precio" 
                                        :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                                        mode="currency" currency="MXN" locale="es-MX" highlight-on-focus disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small">
                                    </InputNumber>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="tipocosteo" class="col-form-label col-form-label-sm col-sm-2">
                                    Tipo de Costeo
                                </label>
                                <div class="col-sm-2">
                                    <InputText
                                        v-model="registro.metodo_costeo"
                                        disabled fluid>
                                    </InputText>
                                </div>
                                <label for="inventariable" class="col-form-label col-form-label-sm col-sm-2">
                                    Inventariable
                                    <i class="pi pi-info-circle" 
                                        v-tooltip.top="'Indica si el producto llevará control de cantidades en existencia para comprar o vender'"
                                    style="font-size: 1rem;"></i>
                                </label>
                                <div class="col-sm-2">
                                    <Checkbox
                                        v-model="registro.inventariable" binary
                                        input-id="inventariable" fluid disabled
                                    ></Checkbox>
                                </div>
                                <label for="desceditable" class="col-form-label col-form-label-sm col-sm-2">
                                    Desc. Editable
                                    <i class="pi pi-info-circle" 
                                        v-tooltip.top="'Indica si al momento de la venta se le puede editar o modificar la descripción'"
                                    style="font-size: 1rem;"></i>
                                </label>
                                <div class="col-sm-2">
                                    <Checkbox
                                        v-model="registro.descvariable" binary
                                        input-id="inventariable" fluid disabled
                                    ></Checkbox>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="ficha" class="col-form-label col-sm-2" >
                                    Ficha Técnica
                                    <i class="pi pi-info-circle" 
                                        v-tooltip.top="'Descripción adicional caracteristicas del producto'"
                                    style="font-size: 1rem;"></i>
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
                            <div class="row mb-3">
                                <div class="col-sm-2">
                                    <Image :src="imgURL" alt="Imagen Producto" width="250" preview />
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
                            </div>
                        </TabPanel>
                        <!-- CFDI / Impuestos -->
                        <TabPanel value="1">
                            <div class="row mt-2 mb-2">
                                <label for="iva" class="col-form-label col-form-label-sm col-sm-2">
                                    I.V.A %
                                </label>
                                <div class="col-sm-2">
                                    <InputNumber
                                        v-model="registro.impiva"
                                        :min-fraction-digits="2"
                                        :max-fraction-digits="2"
                                        :max="100.00"
                                        :min="0.00"
                                        fluid size="small" disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                    >
                                    </InputNumber>
                                </div>
                                <label for="ieps" class="col-form-label col-form-label-sm col-sm-2">
                                    I.E.P.S %
                                </label>
                                <div class="col-sm-2">
                                    <InputNumber
                                        v-model="registro.impiesps"
                                        :max="100.00"
                                        :min="0.00"
                                        :min-fraction-digits="2"
                                        :max-fraction-digits="2"
                                        fluid size="small" disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                    >
                                    </InputNumber>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="retiva" class="col-form-label col-form-label-sm col-sm-2">
                                    Retención I.V.A %
                                </label>
                                <div class="col-sm-2">
                                    <InputNumber
                                        v-model="registro.retencion_iva"
                                        :max="100.00"
                                        :min="0.00"
                                        :min-fraction-digits="2"
                                        :max-fraction-digits="2"
                                        fluid size="small" disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                    >
                                    </InputNumber>
                                </div>
                                <label for="retieps" class="col-form-label col-form-label-sm col-sm-2">
                                    Retención I.E.P.S %
                                </label>
                                <div class="col-sm-2">
                                    <InputNumber
                                        v-model="registro.retencion_isr"
                                        :max="100.00"
                                        :min="0.00"
                                        :min-fraction-digits="2"
                                        :max-fraction-digits="2"
                                        fluid size="small" disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                    >
                                    </InputNumber>
                                </div>
                            </div>
                            <div class="row mt-2 mb-2">
                                <label for="claveprodserv" class="required col-form-label col-form-label-sm col-sm-2">
                                    Clave Prod / Serv
                                </label>
                                <div class="col-sm-10">
                                    <InputText v-if="registro.sat_claveprodserv" disabled fluid
                                        :value="registro.sat_claveprodserv.c_claveprodserv+' '+registro.sat_claveprodserv!.claveprodserv">
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="claveunidad" class="required col-form-label col-form-label-sm col-sm-2">
                                    Unidad Medida
                                </label>
                                <div class="col-sm-4">
                                    <InputText v-if="registro.sat_claveunidad" disabled fluid
                                        :value="registro.sat_claveunidad.c_claveunidad+' '+registro.sat_claveunidad!.claveunidad">
                                    </InputText>
                                </div>
                                <label for="objetoimp" class="required col-form-label col-form-label-sm col-sm-2">
                                    Objeto de Impuesto
                                </label>
                                <div class="col-sm-4">
                                    <InputText v-if="registro.sat_objetoimpuesto" disabled fluid
                                        :value="registro.sat_objetoimpuesto.c_objetoimp+' '+registro.sat_objetoimpuesto!.objetoimpuesto">
                                    </InputText>
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
                    @click="() => { router.push({name: 'producto'})}">
                </Button>
                <Button 
                    v-if="sPermisos.indexOf('Eliminar') >= 0 "
                    label="Eliminar" type="submit"
                    severity="danger" icon="pi pi-times" raised
                    v-tooltip.top="{ value: 'Eliminar', showDelay: 1000, hideDelay: 300}"
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
                @click="() => { pdfViewer.download(registro.codigo) }"
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
    <ConfirmDialog :pt="{ header: { class: 'bg-secondary mb-2'} }" />
</template>

<style scoped>

</style>