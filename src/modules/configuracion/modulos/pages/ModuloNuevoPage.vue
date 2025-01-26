<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import type { Modulo } from '../interfaces/modulo';
import useModulo from '@/modules/configuracion/modulos/composables/useModulo';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Toast from 'primevue/toast';
import { watch } from 'vue';

const router = useRouter();

const {
    registro,
    isPending,
    isError,
    dataMutationNew,
    isAdding,
    isAddingSuccess,
    secciones,
    subsecciones,
    selseccion,
    selsubseccion,

    newRegistro,
} = useModulo( 0 );

watch( isAddingSuccess, () => {
    setTimeout(() => {
        dataMutationNew.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/modulos')
})

const validaDatos = (data: Modulo) => {
    data.seccion    = selseccion.value;
    data.subseccion = selsubseccion.value;
    newRegistro(data);
}

</script>
<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Nuevo Modulo</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validaDatos(registro!)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="fv-row mb-2">
                    <label for="id" class="form-label col-sm-2">ID</label>
                    <InputNumber id="id" v-model="registro.id" maxlength="120" disabled
                    :pt="{  root: { class: 'col-sm-2'}, 
                            pcInputText: { root:{ class: 'text-end'}}
                        }">
                    </InputNumber>
                </div>
                <div class="fv-row mb-5">
                    <label for="descripcion" class="required form-label col-sm-2">Descripción</label>
                    <InputText id="descripcion" v-model="registro.nombre" maxlength="120"
                        :pt="{root: { class: 'col-sm-10'}}">
                    </InputText>
                </div>
                <div class="fv-row mb-5">
                    <label for="seccion" class="required form-label col-sm-2">Sección</label>
                    <Select
                        v-model="selseccion"
                        :options="secciones"
                        placeholder="Seleccione una Sección"
                        :pt="{root: { class: 'col-sm-4'}}"
                    >
                    </Select>
                </div>
                <div class="fv-row mb-5">
                    <label for="subseccion" class="required form-label col-sm-2">SubSección</label>
                    <Select
                        v-model="selsubseccion"
                        :options="subsecciones"
                        placeholder="Seleccione una SubSección"
                        :pt="{root: { class: 'col-sm-4'}}"
                    >
                    </Select>
                </div>
                <div class="fv-row mb-5">
                    <label for="codigo" class="required form-label col-sm-2">Código</label>
                    <InputText id="codigo" v-model="registro.codigo" maxlength="20"
                        :pt="{root: { class: 'col-sm-4'}}">
                    </InputText>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'modulos'})}">
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