<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import type { Producto } from '../interfaces/interfaces';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useProducto from '../composables/useProducto';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressSpinner from 'primevue/progressspinner';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const router = useRouter();
const toast  = useToast();

const {
    registro,
    isPending,
    isError,
    tabActiva,
    file_img,
    file_pdf,
    file_pdf_pdf,
    selectedmarca,
    marcasfiltradas,
    tipos_inventario,
    selecttipo_inventario,
    satprodservfiltrados,
    selectedprodserv,
    satclaveunidadfiltradas,
    selectedclaveunidad,
    satobjetosimpuestos,
    selectobjetoimpuesto,
    unidades_medida,
    selectunidad_medida,
    
    dataMutationNew,
    newRegistro,
    isAdding,
    isAddingSuccess,
    subirArchivo,
    selectFile,
    subirArchivoPDF,
    selectFile_pdf,
    buscarMarca,
    buscarClaveProdServ,
    buscarClaveUnidad,
    CalculaPrecios,
} = useProducto( 0 );

watch( isAddingSuccess, () => {
    setTimeout(() => {
        dataMutationNew.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.push({name: 'producto'});
})

const validarDatos = async (data:Producto ) => {
    if (data.codigo.trim().length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El campo codigo no puede estar vacío',
            life:       3000
        });
        return;
    } else if (data.descripcion.trim().length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El campo Descripción no puede estar vacío',
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
    try {
        if (selectedprodserv.value.id == 0) {
            toast.add({ severity: 'error',summary: 'Verificar',
                detail: 'Debe seleccionar una Clave de Producto/Servicio',life: 3000
            });
            return;
        }    
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Verificar',
            detail: 'Debe seleccionar una Clave de Producto/Servicio', life: 3000});
        return;
    }
    try {
        if (selectedclaveunidad.value.id == 0) {
            toast.add({ severity: 'error',summary: 'Verificar',
                detail: 'Debe seleccionar una Clave de Unidad',life: 3000
            });
            return;
        }    
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Verificar',
            detail: 'Debe seleccionar una Clave de Unidad', life: 3000});
        return;
    }
    try {
        if (selectobjetoimpuesto.value.id == 0) {
            toast.add({ severity: 'error',summary: 'Verificar',
                detail: 'Debe seleccionar un Objeto de Impuesto',life: 3000
            });
            return;
        }    
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Verificar',
            detail: 'Debe seleccionar un Objeto de Impuesto', life: 3000});
        return;
    }
    data.marca_id           = selectedmarca.value.id;
    data.claveprodserv_id   = selectedprodserv.value.id;
    data.claveunidad_id     = selectedclaveunidad.value.id;
    data.objetoimpuesto_id  = selectobjetoimpuesto.value.id;
    data.tipo_inventario_id = selecttipo_inventario.value.id;
    data.unidad_medida_id   = selectunidad_medida.value.id;
    await subirArchivo();
    data.file_imagen = registro.value.file_imagen;
    data.file_pdf = await subirArchivoPDF(file_pdf.value,'pdf1');
    newRegistro(data);
}

</script>
<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Nuevo Producto</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validarDatos(registro)">
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
                        <InputText v-model="registro.codigo"
                            class="form-control" maxlength="60" fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="form-label fs-6 fw-semibold mb-2">
                            Código Alterno
                        </label>
                        <InputText v-model="registro.codigo_alterno"
                            class="form-control" maxlength="60" fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="form-label fs-6 fw-semibold mb-2">
                            Código de Barras
                        </label>
                        <InputText v-model="registro.codigo_barras"
                            class="form-control" maxlength="60" fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col-sm-12 fv-row">
                        <label for="descripcion" class="required form-label fw-semibold">
                            Descripción
                        </label>
                        <InputText id="descripcion" 
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
                                    <Select v-model="selecttipo_inventario" 
                                        option-label="descripcion" variant="filled"
                                        :options="tipos_inventario" fluid>
                                    </Select>
                                </div>
                                <label for="unidadmedida" class="col-form-label col-sm-2">Unidad Medida</label>
                                <div class="col-sm-2">
                                    <Select v-model="selectunidad_medida" 
                                        option-label="descripcion" variant="filled"
                                        :options="unidades_medida" fluid>
                                    </Select>
                                </div>
                                <label for="marca" class="col-form-label col-sm-2">Marca</label>
                                <div class="col-sm-2">
                                    <AutoComplete
                                        v-model="selectedmarca"
                                        option-label="descripcion"
                                        :suggestions="marcasfiltradas"
                                        force-selection fluid
                                        auto-option-focus
                                        empty-search-message="No existen marcas que coincidan"
                                        empty-selection-message="No se ha se leccionado una marca"
                                        placeholder="Capture una marca"
                                        @complete="buscarMarca"
                                    >

                                    </AutoComplete>
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
                                        mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small"
                                        @blur="CalculaPrecios" @input="CalculaPrecios">
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
                                        locale="es-MX" highlight-on-focus fluid prefix="%" 
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small"
                                        @blur="CalculaPrecios" @input="CalculaPrecios">
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
                                        mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small"
                                        @blur="CalculaPrecios" @input="CalculaPrecios">
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
                                        input-id="inventariable" fluid
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
                                        input-id="inventariable" fluid
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
                                        rows="3"
                                        :pt="{ root: { class: 'col-sm-12' }}"
                                    >
                                    </Textarea>
                                </div>
                            </div>
                            <div class="row mb-5">
                                <label for="file" class="col-form-label col-sm-2">
                                    Subir Imagen (png,jpg,gif)
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Puede adjuntar una imagen o fotografia del producto'" />
                                </label>
                                <div class="col-sm-4">
                                    <FileUpload
                                        ref="file_img"
                                        :multiple="true"
                                        name="pdf[]"
                                        accept="image/png, image/gif, image/jpeg"
                                        :max-file-size="5000000"
                                        :file-limit="1"
                                        invalid-file-size-message="El archivo no puede se mayor a 5Mb"
                                        invalid-file-type-message="Solo puede subir archivo en formato compatible con imagenes"
                                        :pt="{ root: { class: 'col-sm-12' }}"
                                        :show-upload-button="false"
                                        custom-upload
                                        @select="selectFile"
                                    >
                                        <template #empty>
                                            <span>Arrastre y suelte aqui la imágen.</span>
                                        </template>
                                    </FileUpload>
                                </div>
                                
                                <label for="file" class="col-form-label col-sm-2">
                                    PDF
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Puede adjuntar un archivo pdf'" />
                                </label>
                                <div class="col-sm-4">
                                    <FileUpload
                                        ref="file_pdf_pdf"
                                        :multiple="true"
                                        name="pdf[]"
                                        accept="application/pdf"
                                        :max-file-size="5000000"
                                        :file-limit="1"
                                        invalid-file-size-message="El archivo no puede se mayor a 5Mb"
                                        invalid-file-type-message="Solo puede subir archivo en formato PDF"
                                        fluid
                                        :show-upload-button="false"
                                        custom-upload
                                        @select="selectFile_pdf"
                                    >
                                        <template #empty>
                                            <span>Arrastre y suelte aqui el archivo.</span>
                                        </template>
                                    </FileUpload>
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
                                        fluid size="small"
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
                                        fluid size="small"
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
                                        fluid size="small"
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
                                        fluid size="small"
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
                                    <AutoComplete v-model="selectedprodserv"
                                        :option-label="(data) => data.c_claveprodserv+' '+data.descripcion"
                                        force-selection auto-option-focus size="small"
                                        :suggestions="satprodservfiltrados"
                                        empty-search-message="No existen Clave de Producto/Servicio que coincidan"
                                        empty-selection-message="No se ha se leccionado un Clave de Producto/Servicio"
                                        placeholder="Capture una Clave de Producto/Servicio" fluid
                                        @complete="buscarClaveProdServ">
                                    </AutoComplete>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="claveunidad" class="required col-form-label col-form-label-sm col-sm-2">
                                    Unidad Medida
                                </label>
                                <div class="col-sm-4">
                                    <AutoComplete v-model="selectedclaveunidad"
                                        :option-label="(data) => data.c_claveunidad+' '+data.nombre"
                                        force-selection auto-option-focus size="small"
                                        :suggestions="satclaveunidadfiltradas"
                                        empty-search-message="No existen Clave de Unidad que coincidan"
                                        empty-selection-message="No se ha se leccionado un Clave de Unidad"
                                        placeholder="Capture una Clave de Unidad" fluid
                                        @complete="buscarClaveUnidad">
                                    </AutoComplete>
                                </div>
                                <label for="objetoimp" class="required col-form-label col-form-label-sm col-sm-2">
                                    Objeto de Impuesto
                                </label>
                                <div class="col-sm-4">
                                    <Select
                                        v-model="selectobjetoimpuesto"
                                        :options="satobjetosimpuestos" size="small"
                                        :option-label="(data) => data.c_objetoimp+' '+data.descripcion" fluid
                                        placeholder="Seleccione un Tipo de Objeto para el Trabajo/Servicio">
                                    </Select>
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
                    severity="success" label="Guardar" type="submit"
                    class="me-4" raised icon="pi pi-check" :loading="isAdding"
                >
                </Button>
            </div>
        </form>
    </div>
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
</template>

<style scoped>

</style>