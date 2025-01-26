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
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast  = useToast();

const {
    registro,
    isPending,
    isError,
    selecteddivision,
    divisionesfiltradas,
    
    dataMutationNew,
    newRegistro,
    isAdding,
    isAddingSuccess,
    buscarDivisiones,
} = useTrabajo( 0 );

watch( isAddingSuccess, () => {
    setTimeout(() => {
        dataMutationNew.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/trabajos')
})

const validarDatos = async (data:Trabajo ) => {
    if (selecteddivision.value.id == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'Debe seleccionar una división',
            life:       3000
        });
        return;
    }
    data.division_id = selecteddivision.value.id;
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
                    <label for="id" class="col-form-label col-sm-2">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" disabled fluid
                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="descripcion" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="descripcion" v-model="registro.descripcion" maxlength="120"
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
                            :min="0" :max="9999" fluid
                            :pt="{ pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="marca" class="required col-form-label col-sm-2">División</label>
                    <div class="col-sm-4">
                        <AutoComplete
                            v-model="selecteddivision"
                            option-label="descripcion"
                            :suggestions="divisionesfiltradas"
                            empty-search-message="No existen divisiones que coincidan"
                            empty-selection-message="No se ha se leccionado una división"
                            placeholder="Capture una división"
                            @complete="buscarDivisiones"
                        >
                        </AutoComplete>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="ficha" class="col-form-label col-sm-2" >
                        Ficha Técnica
                        <i class="pi pi-info-circle" 
                            v-tooltip.top="'Instrucciones detalladas del proceso para realizar el trabajo'"
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