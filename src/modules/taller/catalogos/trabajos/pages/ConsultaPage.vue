<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useTrabajo from '../composables/useTrabajo';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { watch } from 'vue';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';

const route = useRoute();
const router = useRouter();

const {
        registro, 
        isPending, 
        isError,
        
    } = useTrabajo( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.replace('/trabajos')
})

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consulta Trabajo</h2>
    </div>
    <div v-if="registro"> 
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
                            :min="0" :max="9999" fluid disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}}}">
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
        </div>
        <div class="card-footer">
            <Button
                severity="secondary" label="Regresar"
                class="me-4" raised icon="pi pi-arrow-left"
                @click="() => { router.push({name: 'trabajos'})}">
            </Button>
        </div>
    </div>
    <Toast/>
</template>

<style scoped>

</style>