<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useBahia from '../composables/useBahia';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { watch } from 'vue';

const route = useRoute();
const router = useRouter();

const {
        registro, 
        isPending, 
        isError,
    } = useBahia( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.replace('/bahias')
})

</script>

<template> 
        <LoadingModal v-if="isPending" />
        <div class="card-header border-0 pt-2">
            <h2>Consulta Bahía</h2>
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
                    <InputText id="descripcion" v-model="registro.descripcion" maxlength="120" disabled
                    :pt="{root: { class: 'col-sm-10'}}">
                    </InputText>
                </div>
                <div class="fv-row mb-5">
                    <label for="enpatio_cliente" class="required form-label col-sm-3">Bahía en patio del cliente</label>
                    <Checkbox id="enpatio_cliente" v-model="registro.enpatio_cliente" disabled
                    :pt="{root: { class: 'col-sm-1'}}">
                    </Checkbox>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'bahias'})}">
                </Button>
            </div>
        </div>
</template>

<style scoped>

</style>