<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import usePermiso from '@/modules/configuracion/permisos/composables/usePermiso';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { watch } from 'vue';

const route = useRoute();
const router = useRouter();

const {
        registro, 
        isPending, 
        isError,
    } = usePermiso( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.replace('/permisos')
})

</script>

<template> 
        <LoadingModal v-if="isPending" />
        <div class="card-header border-0 pt-2">
            <h2>Consulta Permisos</h2>
        </div>
        <div v-if="registro"> 
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
                    <InputText id="descripcion" v-model="registro.nombre" maxlength="120" disabled
                    :pt="{root: { class: 'col-sm-10'}}">
                    </InputText>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'permisos'})}">
                </Button>
            </div>
        </div>
</template>

<style scoped>

</style>