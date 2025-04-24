<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useAlmacen from '../composables/useAlmacen';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { watch } from 'vue';
import type { Almacen } from '../interfaces/interfaces';
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
} = useAlmacen( 0 );

watch( isAddingSuccess, () => {
    setTimeout(() => {
        dataMutationNew.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.push({name: 'almacen'})
})

const validaDatos = (data: Almacen) => {
    if (data.nombre.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El nombre del Almacén es obligatorio',
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
        <h2>Nuevo Almacén</h2>
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
                        <InputText id="nombre" v-model="registro.nombre" maxlength="120"
                            :pt="{root: { class: 'col-sm-12'}}">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="direccion" class="col-form-label col-sm-2">Dirección</label>
                    <div class="col-sm-10">
                        <InputText id="nombre" v-model="registro.direccion" maxlength="120"
                            :pt="{root: { class: 'col-sm-12'}}">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="ciudad" class="col-form-label col-sm-2">Ciudad</label>
                    <div class="col-sm-3">
                        <InputText id="nombre" v-model="registro.ciudad" maxlength="120" fluid>
                        </InputText>
                    </div>
                    <label for="estado" class="col-form-label col-sm-2">Estado</label>
                    <div class="col-sm-3">
                        <InputText id="estado" v-model="registro.estado" maxlength="120" fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-5">
                    <label for="esconsignacion" class="col-form-label col-sm-2">
                        Es Consignación
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Indica si el almacén esta dentro de las instalaciónes de un cliente'"></i>
                    </label>
                    <div class="col-sm-1 text-start">
                        <Checkbox id="esconsignacion" v-model="registro.esconsignacion" binary
                            :pt="{root: { class: 'text-start col-sm-1'}}">
                        </Checkbox>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'almacen'})}">
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