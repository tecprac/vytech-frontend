<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useAgente from '../composables/useAgente';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { watch } from 'vue';
import type { Agente } from '../interfaces/interfaces';
import { useToast } from 'primevue/usetoast';

const route     = useRoute();
const router    = useRouter();
const toast     = useToast();

const {
    registro,
    isPending,
    isError,

    dataMutationUpdate,
    updateRegistro,
    isUpdating,
    isUpdatingSuccess,
} = useAgente( +route.params.id );

watch( isUpdatingSuccess, () => {
    setTimeout(() => {
        dataMutationUpdate.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.push({name: 'agente'});
})

const validaDatos = (data: Agente) => {
    if (data.nombre.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El nombre es obligatorio',
            life:       3000
        });
        return;
    }
    if (data.apaterno.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El Apellido Paterno es obligatorio',
            life:       3000
        });
        return;
    }
    if (data.amaterno.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El Apellido Materno es obligatorio',
            life:       3000
        });
        return;
    }
    if (+data.porc_cobro > 100.00 || +data.porc_cobro < 0){
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El valor del Porcentaje de Cobro esta fuera del rango permitido',
            life:       3000
        });
        return;
    }
    if (+data.porc_venta > 100.00 || +data.porc_venta < 0){
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El valor del Porcentaje de Venta esta fuera del rango permitido',
            life:       3000
        });
        return;
    }
    updateRegistro(data);
}

</script>
<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Editar Agente</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validaDatos(registro!)">
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
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            Nombre(s)
                        </label>
                        <InputText v-model="registro.nombre"
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
                <div class="row mb-2">
                    <label for="porc_venta" class="required col-form-label col-sm-2">
                        Porcentaje de Venta
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Porcentaje sobre cada venta realizada por el agente'"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="porc_venta" v-model="registro.porc_venta" mode="decimal" locale="en-US"
                            :min="0" :max="100.00"
                            :min-fraction-digits="2" fluid highlight-on-focus
                            :pt="{root: { class: 'col-sm-10'},
                            pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                    <label for="porc_cobro" class="required col-form-label col-sm-2">
                        Porcentaje de Cobro
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Porcentaje sobre cada pago de la venta realizada por el agente'"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="porc_cobro" v-model="registro.porc_cobro" mode="decimal" locale="en-US"
                            :min="0" :max="100.00"
                            :min-fraction-digits="2" fluid highlight-on-focus
                            :pt="{root: { class: 'col-sm-10'},
                            pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'agente'})}">
                </Button>
                <Button
                    severity="success" label="Guardar" type="submit"
                    class="me-4" raised icon="pi pi-check" :loading="isUpdating"
                >
                </Button>
            </div>
        </form>
    </div>
    <Toast />
</template>

<style scoped>

</style>