<script setup lang="ts">
import { useRouter } from 'vue-router';
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

const router = useRouter();
const toast  = useToast();

const {
    registro,
    isPending,
    isError,
    dataMutationNew,
    newRegistro,
    isAdding,
    isAddingSuccess,
} = useTipoServicio( 0 );

watch( isAddingSuccess, () => {
    setTimeout(() => {
        dataMutationNew.reset();
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
            detail:     'La Descripción es obligatoria',
            life:       3000
        });
        return;
    }
    console.log(+data.costo_inicial);
    if (+data.costo_inicial > 9999999.99 || +data.costo_inicial < 0){
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El valor del Costo Inicial esta fuera del rango permitido',
            life:       3000
        });
        return;
    }
    newRegistro(data);
}

</script>
<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Nuevo Tipo de Servicio</h2>
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
                    <label for="descripcion" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="descripcion" v-model="registro.descripcion" maxlength="120"
                            :pt="{root: { class: 'col-sm-12'}}">
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
                            :min="0" :max="9999999.99"
                            :min-fraction-digits="2" fluid highlight-on-focus
                            :pt="{root: { class: 'col-sm-10'},
                            pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-5">
                    <label for="tiene_mantenimiento" class="col-form-label col-sm-3">
                        Acepta mantenimientos
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Acepta mantenimientos configurados previamente'"></i>
                    </label>
                    <div class="col-sm-1 text-start">
                        <Checkbox id="tiene_mantenimiento" v-model="registro.tiene_mantenimiento" binary
                            :pt="{root: { class: 'text-start col-sm-1'}}">
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