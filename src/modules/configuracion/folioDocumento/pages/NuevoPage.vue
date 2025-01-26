<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import type { FolioDocumento } from '../interfaces/interfaces';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useFolioDocumento from '../composables/useFolioDocumento';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import AutoComplete from 'primevue/autocomplete';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast  = useToast();

const {
    registro,
    isPending,
    isError,
    selectedmodulo,
    modulosfiltrados,

    dataMutationNew,
    newRegistro,
    isAdding,
    isAddingSuccess,
    buscarModulos,
} = useFolioDocumento( 0 );

watch( isAddingSuccess, () => {
    setTimeout(() => {
        dataMutationNew.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/foliodocumentos')
})

const validarDatos = async (data:FolioDocumento ) => {
    if (selectedmodulo.value.id == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'Debe seleccionar un modulo',
            life:       3000
        });
        return;
    }
    if (data.documento.length == 0) {
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El nombre del documento no puede estar vacío',
            life:       3000
        });
        return;
    }
    if (data.folio_siguiente <= 0){
        toast.add({
            severity:   'error',
            summary:    'Verificar',
            detail:     'El numero de Folio debe ser mayor a 0',
            life:       3000
        });
        return;
    }
    data.modulo_id = selectedmodulo.value.id;
    newRegistro(data);
}

</script>
<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Nuevo Folio Documento</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="validarDatos(registro)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="row mb-2">
                    <label for="id" class="col-form-label col-sm-2">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" maxlength="120" disabled
                        :pt="{  root: { class: 'col-sm-12'}, 
                                pcInputText: { root:{ class: 'text-end'}}
                            }">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="marca" class="required col-form-label col-sm-2">Modulo</label>
                    <div class="col-sm-4">
                        <AutoComplete
                            v-model="selectedmodulo"
                            :option-label="(data) => { return !data.nombre ? '' : data.seccion+' '+data.subseccion+' '+data.nombre}"
                            :suggestions="modulosfiltrados"
                            empty-search-message="No existen modulos que coincidan"
                            empty-selection-message="No se ha se leccionado un modulo"
                            placeholder="Capture un modulo"
                            @complete="buscarModulos" fluid
                        >
                        </AutoComplete>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="documento" class="required col-form-label col-sm-2">Documento</label>
                    <div class="col-sm-4">
                        <InputText id="descripcion" v-model="registro.documento" maxlength="60" fluid
                            :pt="{pcInputText: { root:{ class: 'text-end'}}}">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="folio" class="required col-form-label col-sm-2">Siguiente Folio</label>
                    <div class="col-sm-2">
                        <InputNumber id="folio" v-model="registro.folio_siguiente" :min="1" :max="999999999" fluid
                            :pt="{pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                    <label for="serie" class="col-form-label col-sm-1">Serie</label>
                    <div class="col-sm-1">
                        <InputText id="serie" v-model="registro.serie" maxlength="5" fluid>
                        </InputText>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'foliodocumentos'})}">
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