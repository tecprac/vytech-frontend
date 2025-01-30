<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useTrabajo from '../composables/useTrabajo';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';
import type { Permisos, Trabajo } from '../interfaces/interfaces';
import Select from 'primevue/select';
import AutoComplete from 'primevue/autocomplete';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth   = useAuthStore();
const confirm   = useConfirm();

const permisos = ref<Permisos[]>([]);
const sPermisos = ref<string>('');
permisos.value = auth.permisos.filter((element: any) => element.codigo == '020'); // Modulo Taller->Catalogos->Trabajos
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

const {
        registro, 
        isPending, 
        isError,
        isDeleting,
        isDeletingSuccess,
        dataMutationDelete,
        selecteddivision,
        divisionesfiltradas,
        satprodservfiltrados,
        selectedprodserv,
        satobjetosimpuestos,
        selectobjetoimpuesto,
        satclaveunidadfiltradas,
        selectedclaveunidad,
        
        deleteRegistro,
    } = useTrabajo( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.push({ name: 'trabajos'})
});

watch( isDeletingSuccess, () => {
    setTimeout(() => {
        dataMutationDelete.reset();
    }, 2000);
});

const Eliminar = (data: Trabajo) => {
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
        <h2>Consulta Trabajo</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="Eliminar(registro!)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="row mb-2">
                    <label for="id" class="col-form-label col-sm-2">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" fluid disabled
                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="codigo" class="col-form-label col-form-label-sm col-sm-2">Código</label>
                    <div class="col-sm-2">
                        <InputText id="codigo" v-model="registro.codigo" maxlength="60"
                            fluid size="small" disabled>
                        </InputText>
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
                    <label for="horasestandar" class="required col-form-label col-sm-2">
                        Horas Estandar
                        <i class="pi pi-info-circle" 
                            v-tooltip.top="'Tiempo para concluir el trabajo en horas'"
                        style="font-size: 1rem;"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="horasestandar" v-model="registro.horasestandar" 
                            :min="0" :max="9999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                    <label for="costo" class="col-form-label col-form-label-sm col-sm-1">
                        Costo 
                        <i class="pi pi-info-circle" 
                            v-tooltip.top="'Costo de la hora del servicio'"
                        style="font-size: 1rem;"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="costo" v-model="registro.costo_reposicion" 
                            :min="0" :max="9999999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                            mode="currency" currency="MXN" locale="es-MX" highlight-on-focus disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small">
                        </InputNumber>
                    </div>
                    <label for="precio" class="col-form-label col-form-label-sm col-sm-1">
                        Precio 
                        <i class="pi pi-info-circle" 
                            v-tooltip.top="'Precio por hora que se cobra al cliente'"
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
                    <label for="division" class="required col-form-label col-sm-2">División</label>
                    <div class="col-sm-4">
                        <InputText v-if="registro.talle_division" v-model="registro.talle_division.division" disabled
                            :pt="{root: { class: 'col-sm-12'}}">
                        >
                        </InputText>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="ficha" class="col-form-label col-sm-2" v-tooltip.top="'Instrucciones detalladas del proceso para realizar el trabajo'">
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
                <Accordion :value="['0','1']" multiple>
                    <AccordionPanel value="0">
                        <AccordionHeader class="bg-secondary">Impuestos</AccordionHeader>
                        <AccordionContent>
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
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="1">
                        <AccordionHeader class="bg-secondary">CFDI</AccordionHeader>
                        <AccordionContent>
                            <div class="row mt-2 mb-2">
                                <label for="claveprodserv" class="required col-form-label col-form-label-sm col-sm-2">
                                    Clave Prod / Serv
                                </label>
                                <div class="col-sm-10">
                                    <AutoComplete v-model="selectedprodserv"
                                        :option-label="(data) => data.c_claveprodserv+' '+data.descripcion"
                                        force-selection auto-option-focus size="small"
                                        :suggestions="satprodservfiltrados"  disabled
                                        empty-search-message="No existen Clave de Producto/Servicio que coincidan"
                                        empty-selection-message="No se ha se leccionado un Clave de Producto/Servicio"
                                        placeholder="Capture una Clave de Producto/Servicio" fluid>
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
                                        placeholder="Capture una Clave de Unidad" fluid disabled>
                                    </AutoComplete>
                                </div>
                                <label for="objetoimp" class="required col-form-label col-form-label-sm col-sm-2">
                                    Objeto de Impuesto
                                </label>
                                <div class="col-sm-4">
                                    <Select
                                        v-model="selectobjetoimpuesto"
                                        :options="satobjetosimpuestos" size="small" disabled
                                        :option-label="(data) => data.c_objetoimp+' '+data.descripcion" fluid
                                        placeholder="Seleccione un Tipo de Objeto para el Trabajo/Servicio">
                                    </Select>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'trabajos'})}">
                </Button>
                <Button 
                    v-if="sPermisos.indexOf('Eliminar') >= 0 "
                    label="Eliminar" type="submit" :loading="isDeleting"
                    severity="danger" icon="pi pi-times" raised
                    v-tooltip.top="{ value: 'Eliminar', showDelay: 1000, hideDelay: 300}"
                >
                </Button>
            </div>
        </form>
    </div>
    <Toast/>
    <ConfirmDialog :pt="{ header: { class: 'bg-secondary mb-2'} }" />
</template>

<style scoped>

</style>