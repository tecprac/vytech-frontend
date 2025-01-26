<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';
import type { Tecnico } from '../interfaces/interfaces';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useTecnico from '../composables/useTecnico';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressSpinner from 'primevue/progressspinner';
import DatePicker from 'primevue/datepicker';
import InputMask from 'primevue/inputmask';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Image from 'primevue/image';


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
    imgURL,
    selectedestado,
    estadosfiltrados,
    file_img,
    tabActiva,

    updateRegistro,
    buscarEstados,
    subirArchivo,
    selectFile
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

const validarDatos = async (data:Tecnico ) => {
    if (selectedestado.value.id == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'Debe seleccionar un estado',
            life:       3000
        });
        return;
    } else if (data.nombres.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El campo nombre no puede estar vacío',
            life:       3000
        });
        return;
    } else if (data.apaterno.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El campo Apellido Paterno no puede estar vacío',
            life:       3000
        });
        return;
    } else if (data.amaterno.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El campo Apellido Materno no puede estar vacío',
            life:       3000
        });
        return;
    } else if (data.rfc.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El campo RFC no puede estar vacío',
            life:       3000
        });
        return;
    } else if (data.curp.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El campo RFC no puede estar vacío',
            life:       3000
        });
        return;
    }
    data.estado_id = selectedestado.value.id;
    await subirArchivo();
    data.imagen = registro.value.imagen;
    updateRegistro(data);
}

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Edita Técnico</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validarDatos(registro!)">
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
                        <InputText v-model="registro.nombres"
                            class="form-control">
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            Apellido Paterno
                        </label>
                        <InputText v-model="registro.apaterno"
                            class="form-control">
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            Apellido Materno
                        </label>
                        <InputText v-model="registro.amaterno"
                            class="form-control">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            Fecha Nacimiento
                        </label>
                        <DatePicker v-model="registro.fecha_nacimiento"
                            show-icon :show-on-focus="false">
                        </DatePicker>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            RFC
                        </label>
                        <InputMask v-model="registro.rfc" mask="aaaa-999999-***"
                            placeholder="????-000000-???" :unmask="true"
                            class="form-control">
                        </InputMask>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            CURP
                        </label>
                        <InputText v-model="registro.curp" maxlength="18"
                            class="form-control">
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
                                    <InputText id="calle" v-model="registro.calle" maxlength="120" fluid>
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="colonia" class="col-form-label col-sm-2">Colonia</label>
                                <div class="col-sm-7">
                                    <InputText id="colonia" v-model="registro.colonia" maxlength="120" fluid>
                                    </InputText>
                                </div>
                                <label for="cp" class="col-form-label col-sm-1">CP</label>
                                <div class="col-sm-2">
                                    <InputText id="cp" v-model="registro.cp" maxlength="120" fluid>
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="municipio" class="col-form-label col-sm-2">Municipio</label>
                                <div class="col-sm-5">
                                    <InputText id="municipio" v-model="registro.municipio" maxlength="120" fluid>
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
                                        fluid
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
                                        class="form-control">
                                    </InputMask>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label class="required form-label fs-6 fw-semibold mb-2">
                                        Telefono Celular
                                    </label>
                                    <InputMask v-model="registro.celular" mask="(999) 999-9999"
                                        placeholder="(999) 999-9999" :unmask="true"
                                        class="form-control">
                                    </InputMask>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label class="required form-label fs-6 fw-semibold mb-2">
                                        Correo electrónico
                                    </label>
                                    <InputText v-model="registro.email" type="email"
                                        pattern="[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}"
                                        class="form-control">
                                    </InputText>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4 fv-row">
                                    <label class="form-label fs-6 fw-semibold mb-2">
                                        Nombre Contacto
                                    </label>
                                    <InputText v-model="registro.nombrecontacto"
                                        class="form-control">
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label class="required form-label fs-6 fw-semibold mb-2">
                                        Parentesto
                                    </label>
                                    <InputText v-model="registro.parentesco"
                                        class="form-control">
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label class="required form-label fs-6 fw-semibold mb-2">
                                        Telefono Contacto
                                    </label>
                                    <InputMask v-model="registro.telefonocontacto" mask="(999) 999-9999"
                                        placeholder="(999) 999-9999" :unmask="true"
                                        class="form-control">
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
                                        class="form-control">
                                    </InputText>
                                </div>
                                <div class="col-sm-4 fv-row">
                                    <label class="required form-label fs-6 fw-semibold mb-2">
                                        Costo Hora
                                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                                            v-tooltip.top="'Indica el costo por hora que se le paga al técnico'" />
                                    </label>
                                    <InputNumber id="costo" v-model="registro.costo_hora" mode="currency" currency="USD" locale="en-US"
                                        :min="0" :max="9999999.99"
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
                                        class="form-control">
                                    </InputText>
                                </div>
                                <div class="col-sm-2 fv-row">
                                    <label class="form-label fs-6 fw-semibold mb-2">
                                        PIN
                                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                                            v-tooltip.top="'PIN secreto para validar la identidad del técnico '" />
                                    </label>
                                    <Password v-model="registro.pin" maxlength="4" toggle-mask
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
                                        rows="3"
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
                            <div class="row mb-5">
                                <label for="file" class="col-form-label col-sm-2">
                                    Subir Imagen (png,jpg,gif)
                                    <i class="pi pi-info-circle" style="font-size: 1rem;"
                                    v-tooltip.top="'Puede adjuntar una imagen o fotografia del técnico'" />
                                </label>
                                <div class="col-sm-10">
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
                <Button
                    severity="success" label="Guardar" type="submit"
                    class="me-4" raised icon="pi pi-check" :loading="isUpdating"
                >
                </Button>
            </div>
        </form>
    </div>
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