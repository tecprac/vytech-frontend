<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import type { Trabajo } from '../interfaces/interfaces';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useTrabajo from '../composables/useTrabajo';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const router = useRouter();
const toast  = useToast();

const {
    registro,
    isPending,
    isError,
    selecteddivision,
    divisionesfiltradas,
    satprodservfiltrados,
    selectedprodserv,
    satobjetosimpuestos,
    selectobjetoimpuesto,
    satclaveunidadfiltradas,
    selectedclaveunidad,
    
    dataMutationNew,
    newRegistro,
    isAdding,
    isAddingSuccess,
    buscarDivisiones,
    buscarClaveProdServ,
    buscarClaveUnidad,
} = useTrabajo( 0 );

watch( isAddingSuccess, () => {
    setTimeout(() => {
        dataMutationNew.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.push({ name:'trabajos'});
})

const validarDatos = async (data:Trabajo ) => {
    if (data.descripcion.trim().length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'La descripción del Trabajo no puede estar vacía',
            life:       3000
        });
        return;
    }
    try {
        if (selecteddivision.value.id == 0) {
            toast.add({ severity:   'error',summary:    'Verificar',
                detail:     'Debe seleccionar una división',life:       3000
            });
            return;
        }    
    } catch (error) {
        toast.add({ severity:   'error', summary:    'Verificar',
            detail:     'Debe seleccionar una división', life: 3000});
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
    data.division_id        = selecteddivision.value.id;
    data.claveprodserv_id   = selectedprodserv.value.id;
    data.claveunidad_id     = selectedclaveunidad.value.id;
    data.objetoimpuesto_id  = selectobjetoimpuesto.value.id;
    newRegistro(data);
}

</script>
<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Nuevo Trabajo</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validarDatos(registro)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="row mb-2">
                    <label for="id" class="col-form-label col-form-label-sm col-sm-2">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" disabled fluid size="small"
                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="codigo" class="col-form-label col-form-label-sm col-sm-2">Código</label>
                    <div class="col-sm-2">
                        <InputText id="codigo" v-model="registro.codigo" maxlength="60"
                            fluid size="small">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="descripcion" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="descripcion" v-model="registro.descripcion" maxlength="120"
                            :pt="{root: { class: 'col-sm-12'}}" size="small"
                            placeholder="Capture una descripción para el trabajo o servicio">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="horasestandar" class="required col-form-label col-form-label-sm col-sm-2">
                        Horas Estandar
                        <i class="pi pi-info-circle" 
                            v-tooltip.top="'Tiempo para concluir el trabajo en horas'"
                        style="font-size: 1rem;"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="horasestandar" v-model="registro.horasestandar" highlight-on-focus
                            :min="0" :max="9999.99" :max-fraction-digits="2" :min-fraction-digits="2" fluid
                            :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small">
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
                            mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
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
                            mode="currency" currency="MXN" locale="es-MX" highlight-on-focus
                            :pt="{ pcInputText: { root:{ class: 'text-end'}}}" size="small">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="marca" class="required col-form-label col-form-label-sm col-sm-2">División</label>
                    <div class="col-sm-3">
                        <AutoComplete
                            v-model="selecteddivision"
                            option-label="descripcion"
                            force-selection auto-option-focus
                            :suggestions="divisionesfiltradas"
                            empty-search-message="No existen divisiones que coincidan"
                            empty-selection-message="No se ha se leccionado una división"
                            placeholder="Capture una división" fluid
                            @complete="buscarDivisiones" size="small"
                        >
                        </AutoComplete>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="ficha" class="col-form-label col-form-label-sm col-sm-2" >
                        Ficha Técnica
                        <i class="pi pi-info-circle" 
                            v-tooltip.top="'Instrucciones detalladas del proceso para realizar el trabajo'"
                        style="font-size: 1rem;"></i>
                    </label>
                    <div class="col-sm-10">
                        <Textarea
                            v-model="registro.ficha_tecnica"
                            rows="3" size="small"
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
                                        :option-label="(data) => {return (data.c_claveprodserv+' '+data.descripcion).trim()}"
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
                                        :option-label="(data) => {return (data.c_claveunidad+' '+data.nombre).trim()}"
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
                    severity="success" label="Guardar" type="submit"
                    class="me-4" raised icon="pi pi-check" :loading="isAdding"
                >
                </Button>
            </div>
        </form>
    </div>
    <Toast />
</template>

<style scoped>

</style>