<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useMotivo from '../composables/useMotivo';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { watch } from 'vue';
import type { Motivo } from '../interfaces/interfaces';
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
} = useMotivo( 0 );

watch( isAddingSuccess, () => {
    setTimeout(() => {
        dataMutationNew.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.push({name: 'almacen'})
})

const validaDatos = (data: Motivo) => {
    if (data.descripcion.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'La descripción del Motivo es obligatorio',
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
        <h2>Nuevo Motivo</h2>
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
                    <label for="nombre" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="nombre" v-model="registro.descripcion" maxlength="120"
                            :pt="{root: { class: 'col-sm-12'}}">
                        </InputText>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'motivo'})}">
                </Button>
                <Button
                    severity="success" label="Guardar" type="submit"
                    class="me-4" raised icon="pi pi-check" :loading="isAdding">
                </Button>
            </div>
        </form>
    </div>
    <Toast />
</template>

<style scoped>

</style>