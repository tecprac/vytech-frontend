<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useTipoServicio from '../composables/useTipoServicio';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { watch } from 'vue';
import type { TipoServicio } from '../interfaces/interfaces';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const toast  = useToast();

const {
        registro, 
        isPending, 
        isError,
        dataMutationUpdate,
        updateRegistro,
        isUpdating,
        isUpdatingSuccess,
} = useTipoServicio( +route.params.id );

watch( isUpdatingSuccess, () => {
    setTimeout(() => {
        dataMutationUpdate.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/tiposervicios')
})

const validaDatos = (data: TipoServicio) => {
    if (data.descripcion.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'La <strong>Descripción</strong> es obligatoria',
            life:       3000
        });
        return;
    }
    if (+data.costo_inicial > 9999999.99 || +data.costo_inicial < 0){
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El valor del Costo Inicial esta fuera del rango permitido',
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
        <h2>Edita Tipo de Servicio</h2>
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
                <div class="row mb-5">
                    <label for="descripcion" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="descripcion" v-model="registro.descripcion" maxlength="120" fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="costo" class="required col-form-label col-sm-2">
                        Costo Inicial
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Este costo se sumará automaticamente en la orden de servicio'"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="costo" v-model="registro.costo_inicial" mode="currency" currency="USD" locale="en-US"
                            :min-fraction-digits="2" fluid :min="0" :max="9999999.99"
                            :pt="{ pcInputText: { root:{ class: 'text-end'}}} ">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="tiene_mantenimiento" class="required col-form-label col-sm-3">
                        Acepta mantenimientos
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Acepta mantenimientos configurados previamente'"></i>
                    </label>
                    <div class="col-sm-1">
                        <Checkbox id="tiene_mantenimiento" v-model="registro.tiene_mantenimiento" binary fluid>
                        </Checkbox>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'tiposervicios'})}">
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