<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useUnidad from '../composables/useUnidad';
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
import DatePicker from 'primevue/datepicker';
import AutoComplete from 'primevue/autocomplete';
import Select from 'primevue/select';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import ProgressSpinner from 'primevue/progressspinner';
import Divider from 'primevue/divider';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import VuePdfEmbed from 'vue-pdf-embed'

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const route  = useRoute();
const router = useRouter();
const toast  = useToast();
const auth   = useAuthStore();

const {
    registro,
    isPending,
    isError,
    selectedmarca,
    selectedmodelo,
    selectedtipounidad,
    selectedmotor,
    selectedtransmision,
    marcasfiltradas,
    modelosfiltradas,
    tipounidadfiltradas,
    motoresfiltradas,
    transmisionfiltradas,
    file_img,
    file_pdf_tarjeta,
    file_pdf_poliza,
    file_pdf_permiso,
    file_tarjeta,
    file_poliza,
    file_permiso,
    combustibles,
    tipoestatus,
    tabActiva,
    dialogPDFVisor,
    pdfDocumento,
    pdfViewer,
    imagenesURL,

    dataMutationUpdate,
    updateRegistro,
    isUpdating,
    isUpdatingSuccess,
    buscarMarcas,
    buscarTipoUnidad,
    buscarModelo,
    buscarMotor,
    buscarTransmision,
    subirArchivo,
    subirImagenes,
    selectFile_tarjeta,
    selectFile_permiso,
    selectFile_poliza,
    selectImagenes,
    VisualizarPDF,
    cerrarVisualizarPDF,
} = useUnidad( +route.params.id );

const schema = yup.object({
    numeroeco:          yup.string().required().min(1).max(20).label('Numero Económico'),
    fecha_compra:       yup.date().notRequired().label('Fecha de Compra'),
    año:                yup.number().notRequired().moreThan(1900).lessThan(2500).label('Año'),
    placas:             yup.string().notRequired().max(10).label('Placas'),
    kms:                yup.number().notRequired().moreThan(-1).label('Kilometraje'),
    num_motor:          yup.string().notRequired().max(30).label('Numero de Motor'),
    color:              yup.string().notRequired().max(20).label('Color'),
    num_serie:          yup.string().notRequired().max(30).label('Numero de Serie Motor'),
    ejes:               yup.number().notRequired().moreThan(-1).label('Numero de ejes'),
    combustible:        yup.string().required().max(15).label('Combustible'),
    estatus:            yup.string().required().max(15).label('Estatus'),
    arrendado:          yup.boolean().required().label('Arrendado'),
    marca_id:           yup.object({ id: yup.number().required().min(1) }).required().label('Marca'),
    modelo_id:          yup.object({ id: yup.number().required().min(1) }).required().label('Modelo'),
    tipo_unidad_id:     yup.object({ id: yup.number().required().min(1) }).required().label('Tipo de Unidad'),
    motor_id:           yup.object({ id: yup.number().required().min(1) }).required().label('Motor'),
    transmision_id:     yup.object({ id: yup.number().required().min(1) }).required().label('Transmisión'),
});

const { 
    values,
    defineField,
    setFieldValue,
    handleSubmit,
    resetForm,
    errors,
    meta
} = useForm({ validationSchema: schema, initialValues:{
    numeroeco:          registro.value.numeroeco,
    año:                registro.value.año,
    placas:             registro.value.placas,
    kms:                registro.value.kms,
    num_motor:          registro.value.num_motor,
    color:              registro.value.color,
    num_serie:          registro.value.num_serie,
    ejes:               registro.value.ejes,
    combustible:        registro.value.combustible,
    estatus:            registro.value.estatus,
    arrendado:          registro.value.arrendado,
    marca_id:           {},
    modelo_id:          {},
    tipo_unidad_id:     {},
    motor_id:           {},
    transmision_id:     {},
} });

const [numeroeco]       = defineField('numeroeco');
const [marca_id]        = defineField('marca_id');
const [modelo_id]       = defineField('modelo_id');
const [tipo_unidad_id]  = defineField('tipo_unidad_id');
const [motor_id]        = defineField('motor_id');
const [transmision_id]  = defineField('transmision_id');
const [año]             = defineField('año');
const [placas]          = defineField('placas');
const [kms]             = defineField('kms');
const [num_motor]       = defineField('num_motor');
const [color]           = defineField('color');
const [num_serie]       = defineField('num_serie');
const [ejes]            = defineField('ejes');
const [combustible]     = defineField('combustible');
const [estatus]         = defineField('estatus');
const [arrendado]       = defineField('arrendado');

const onSubmit = handleSubmit( async (values) => {
    registro.value = {
        id:                 registro.value.id,
        numeroeco:          values.numeroeco,
        marca_id:           selectedmarca.value.id,
        modelo_id:          selectedmodelo.value.id,
        tipo_unidad_id:     selectedtipounidad.value.id,
        fecha_compra:       registro.value.fecha_compra,
        año:                values.año,
        placas:             values.placas,
        kms:                values.kms,
        niv:                registro.value.niv,
        num_motor:          values.num_motor,
        motor_id:           selectedmotor.value.id,
        transmision_id:     selectedtransmision.value.id,
        color:              values.color,
        num_serie:          values.num_serie,
        clase:              registro.value.clase,
        ejes:               values.ejes,
        num_transmision:    registro.value.num_transmision,
        combustible:        values.combustible,
        tarjetacircula:     registro.value.tarjetacircula,
        pdftcirculacion:    registro.value.pdftcirculacion,
        pdfpermisosct:      registro.value.pdfpermisosct,
        estatus:            values.estatus,
        permiso_sct:        registro.value.permiso_sct,
        polizaseguro:       registro.value.polizaseguro,
        aseguradora:        registro.value.aseguradora,
        vigenciapoliza:     registro.value.vigenciapoliza,
        arrendado:          values.arrendado,
        pdfpolizaseguro:    registro.value.pdfpolizaseguro,
        activo: true
    };
    registro.value.pdftcirculacion  = await subirArchivo(file_tarjeta.value,'Tarjeta Circulación');
    registro.value.pdfpolizaseguro  = await subirArchivo(file_poliza.value,'Póliza Seguro');
    registro.value.pdfpermisosct    = await subirArchivo(file_permiso.value,'Permiso SCT');
    registro.value.imagenes         = await subirImagenes();
    updateRegistro(registro.value);
})

watch(registro, () => {
    if(registro.value.id > 0) {
        resetForm({
            values: {
                numeroeco:          registro.value.numeroeco,
                año:                registro.value.año,
                placas:             !registro.value.placas ? '' : registro.value.placas,
                kms:                registro.value.kms,
                num_motor:          !registro.value.num_motor ? '' : registro.value.num_motor,
                color:              !registro.value.color ? '' : registro.value.color,
                num_serie:          !registro.value.num_serie ? '' : registro.value.num_serie,
                ejes:               registro.value.ejes,
                combustible:        registro.value.combustible,
                estatus:            registro.value.estatus,
                arrendado:          registro.value.arrendado,
                tipo_unidad_id:     selectedtipounidad.value,
            }
        });
    }
}, {deep: true});

watch( selectedtipounidad, () => {
    setFieldValue('tipo_unidad_id',selectedtipounidad.value);
});

watch( selectedmarca, () => {
    setFieldValue('marca_id',selectedmarca.value);
});

watch( selectedmodelo, () =>{
    setFieldValue('modelo_id',selectedmodelo.value);
});

watch( selectedmotor, () => {
    setFieldValue('motor_id',selectedmotor.value);
});

watch( selectedtransmision, () => {
    setFieldValue('transmision_id',selectedtransmision.value);
});

watch( isUpdatingSuccess, () => {
    setTimeout(() => {
        dataMutationUpdate.reset();
    }, 2000);
    resetForm();
})

watch(isError, () => {
    if(isError.value)
        router.replace('/unidades')
})

</script>
<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Editar Unidad</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="onSubmit">
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
                        <Select v-model="estatus" :options="tipoestatus" fluid>
                        </Select>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="numeroeco" class="required form-label fw-semibold mb-2">
                            Numero Económico
                        </label>
                        <InputText id="numeroeco" v-model="numeroeco" fluid></InputText>
                        <Message v-if="errors.numeroeco" severity="error" variant="simple" size="small">{{ errors.numeroeco }}</Message>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="numserie" class="form-label fw-semibold mb-2">
                            Numero Serie
                        </label>
                        <InputText id="numserie" v-model="num_serie" fluid></InputText>
                        <Message v-if="errors.num_serie" severity="error" variant="simple" size="small">{{ errors.num_serie }}</Message>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="placas" class="form-label fw-semibold mb-2">
                            Placas
                        </label>
                        <InputText id="placas" v-model="placas" fluid></InputText>
                        <Message v-if="errors.placas" severity="error" variant="simple" size="small">{{ errors.placas }}</Message>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="tipounidad" class="required form-label">
                            Tipo de Unidad
                        </label>
                        <AutoComplete
                            v-model="selectedtipounidad"
                            option-label="descripcion"
                            :suggestions="tipounidadfiltradas"
                            empty-search-message="No existen tipo de unidad que coincidan"
                            empty-selection-message="No se ha se leccionado un tipo de unidad"
                            placeholder="Capture un tipo de unidad"
                            @item-select="() => { setFieldValue('tipo_unidad_id',selectedtipounidad); }"
                            fluid
                            @complete="buscarTipoUnidad"
                        >
                        </AutoComplete>
                        <Message v-if="errors.tipo_unidad_id" severity="error" variant="simple" size="small">{{ errors.tipo_unidad_id }}</Message>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="marca" class="required form-label">Marca</label>
                        <AutoComplete
                            v-model="selectedmarca"
                            option-label="descripcion"
                            :suggestions="marcasfiltradas"
                            empty-search-message="No existen marcas que coincidan"
                            empty-selection-message="No se ha se leccionado una marca"
                            placeholder="Capture una marca"
                            @item-select="() => { setFieldValue('marca_id',selectedmarca); }"
                            fluid
                            @complete="buscarMarcas"
                        >
                        </AutoComplete>
                        <Message v-if="errors.marca_id" severity="error" variant="simple" size="small">{{ errors.marca_id }}</Message>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="modelo" class="required form-label">Modelo</label>
                        <AutoComplete
                            v-model="selectedmodelo"
                            option-label="descripcion"
                            :suggestions="modelosfiltradas"
                            empty-search-message="No existen modelos que coincidan"
                            empty-selection-message="No se ha se leccionado un modelo"
                            placeholder="Capture un modelo"
                            @item-select="() => { setFieldValue('modelo_id',selectedmodelo); }"
                            fluid
                            @complete="buscarModelo"
                        >
                        </AutoComplete>
                        <Message v-if="errors.modelo_id" severity="error" variant="simple" size="small">{{ errors.modelo_id }}</Message>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="fechacompra" class="form-label">Fecha de Compra</label>
                        <DatePicker v-model="registro.fecha_compra"
                            show-icon :show-on-focus="false" fluid>
                        </DatePicker>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="año" class="form-label">Año</label>
                        <InputNumber v-model="año" placeholder="0000" fluid
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="color" class="form-label">Color</label>
                        <InputText v-model="color" placeholder="Color de la unidad" fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="motor" class="required form-label">Motor</label>
                        <AutoComplete
                            v-model="selectedmotor"
                            option-label="descripcion"
                            :suggestions="motoresfiltradas"
                            empty-search-message="No existen motores que coincidan"
                            empty-selection-message="No se ha se leccionado un motor"
                            placeholder="Capture un tipo de motor"
                            @item-select="() => { setFieldValue('motor_id',selectedmotor); }"
                            fluid
                            @complete="buscarMotor"
                        >
                        </AutoComplete>
                        <Message v-if="errors.motor_id" severity="error" variant="simple" size="small">{{ errors.motor_id }}</Message>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="nsmotor" class="form-label">N/S Motor</label>
                        <InputText v-model="num_motor" fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="kms" class="form-label">Kilometraje</label>
                        <InputNumber v-model="kms" fluid :max="999999999" :min="0"
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>  
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="transmision" class="required form-label">Transmisión</label>
                        <AutoComplete
                            v-model="selectedtransmision"
                            option-label="descripcion"
                            :suggestions="transmisionfiltradas"
                            empty-search-message="No existen transmisiones que coincidan"
                            empty-selection-message="No se ha se leccionado una transmisión"
                            placeholder="Capture una transmisión"
                            @item-select="() => { setFieldValue('transmision_id',selectedtransmision); }"
                            fluid
                            @complete="buscarTransmision"
                            >
                        </AutoComplete>
                        <Message v-if="errors.transmision_id" severity="error" variant="simple" size="small">{{ errors.transmision_id }}</Message>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="nstransmision" class="form-label">N/S Transmisión</label>
                        <InputText v-model="registro.num_transmision" fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col-sm-4 fv-row">
                        <label for="clase" class="form-label">Clase</label>
                        <InputText v-model="registro.clase" fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="ejes" class="form-label">Numero de Ejes</label>
                        <InputNumber v-model="ejes" fluid :min="1" :max="99"
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="combustible" class="form-label">Tipo de Combustible</label>
                        <Select v-model="combustible" :options="combustibles" fluid>
                        </Select>
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
                                    <InputText v-model="registro.aseguradora" fluid>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="poliza" class="form-label">N° Póliza</label>
                                    <InputText v-model="registro.polizaseguro" fluid>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="vigencia" class="form-label">Vigencia Póliza</label>
                                    <DatePicker v-model="registro.vigenciapoliza" fluid show-icon :show-on-focus="false">
                                    </DatePicker>
                                </div>
                            </div>
                            <div class="row mb-5">
                                <div class="col-sm-4 fv-row">
                                    <label for="tarjeta" class="form-label">Tarjeta Circulación</label>
                                    <InputText v-model="registro.tarjetacircula" fluid>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="permisosct" class="form-label">Permiso SCT</label>
                                    <InputText v-model="registro.permiso_sct" fluid>
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label for="arrendado" class="form-label">Es Arrendado</label>
                                    <div class="col-sm-2">
                                        <Checkbox v-model="arrendado" binary fluid size="large"></Checkbox>
                                    </div>
                                </div>
                            </div>
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
                            <Divider />
                            <div class="row mb-5">
                                <label for="file" class="col-form-label col-sm-3">
                                    Tarjeta Circulación (PDF)
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Puede adjuntar un archivo pdf con los datos de la tarjeta de Circulación'" />
                                </label>
                                <div class="col-sm-8">
                                    <FileUpload
                                        ref="file_pdf_tarjeta"
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
                                        @select="selectFile_tarjeta"
                                    >
                                        <template #empty>
                                            <span>Arrastre y suelte aqui el archivo.</span>
                                        </template>
                                    </FileUpload>
                                </div>
                            </div>
                            <div class="row mb-5">
                                <label for="file" class="col-form-label col-sm-3">
                                    Póliza de Seguro (PDF)
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Puede adjuntar un archivo pdf de la Póliza del seguro'" />
                                </label>
                                <div class="col-sm-8">
                                    <FileUpload
                                        ref="file_pdf_poliza"
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
                                        @select="selectFile_poliza"
                                    >
                                        <template #empty>
                                            <span>Arrastre y suelte aqui el archivo.</span>
                                        </template>
                                    </FileUpload>
                                </div>
                            </div>
                            <div class="row mb-5">
                                <label for="file" class="col-form-label col-sm-3">
                                    Permiso SCT (PDF)
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Puede adjuntar un archivo pdf del permiso de la SCT'" />
                                </label>
                                <div class="col-sm-8">
                                    <FileUpload
                                        ref="file_pdf_permiso"
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
                                        @select="selectFile_permiso"
                                    >
                                        <template #empty>
                                            <span>Arrastre y suelte aqui el archivo.</span>
                                        </template>
                                    </FileUpload>
                                </div>
                            </div>
                        </TabPanel>
                        <!-- Imagenes -->
                        <TabPanel value="1">
                            <div class="row mb-3">
                                <template v-for="imagen of imagenesURL" :key="imagen">
                                    <div class="col-sm-2">
                                        <Image :src="imagen" alt="Imagen Unidad" width="150" preview ></Image>
                                    </div>
                                </template>
                            </div>
                            <Divider />                            
                            <div class="row mb-5">
                                <label for="imagenes" class="col-form-label col-sm-3">
                                    Imagenes o Fotografías
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Puede adjuntar hasta 6 imagenes o fotografias por unidad.\n\n En caso de existir imagenes ya guardadas se actualizaran con las nuevas imagenes.'" />
                                </label>
                                <div class="col-sm-8">
                                    <FileUpload
                                        ref="file_img"
                                        :multiple="true"
                                        name="img[]"
                                        accept="image/png, image/gif, image/jpeg"
                                        :max-file-size="5000000"
                                        :file-limit="6"
                                        invalid-file-size-message="El archivo no puede se mayor a 5Mb"
                                        invalid-file-type-message="Solo puede subir archivo en formato compatible con imagenes"
                                        invalid-file-limit-message="El numero máximo de archivos a subir son 6"
                                        fluid
                                        :show-upload-button="false"
                                        custom-upload
                                        @select="selectImagenes"
                                    >
                                        <template #empty>
                                            <span>Arrastre y suelte aqui las imágen.</span>
                                        </template>
                                    </FileUpload>
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
                    @click="() => { router.push({name: 'unidad'})}">
                </Button>
                <Button
                    severity="success" label="Guardar"
                    class="me-4" raised icon="pi pi-check" :loading="isUpdating"
                    @click="onSubmit"
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