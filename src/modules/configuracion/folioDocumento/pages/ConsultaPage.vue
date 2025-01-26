<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { watch, ref } from 'vue';
import type { FolioDocumento } from '../interfaces/interfaces';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useFolioDocumento from '../composables/useFolioDocumento';
import { useAuthStore } from '@/stores/auth';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import AutoComplete from 'primevue/autocomplete';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';

export interface Permisos {
    modulo: string,
    permiso: string,
}

const route = useRoute();
const router = useRouter();
const auth   = useAuthStore();
const confirm   = useConfirm();

const permisos = ref<Permisos[]>([]);
const sPermisos = ref<string>('');
permisos.value = auth.permisos.filter((element: any) => element.codigo == '041'); // Modulo Configuración Folio Documento
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

const {
    registro,
    isPending,
    isError,
    selectedmodulo,
    modulosfiltrados,
    isDeleting,
    isDeletingSuccess,

    dataMutationDelete,
    
    buscarModulos,
    deleteRegistro
} = useFolioDocumento( +route.params.id );

watch( isDeletingSuccess, () => {
    setTimeout(() => {
        dataMutationDelete.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/foliodocumentos')
})

const Eliminar = (data: FolioDocumento) => {
    confirm.require({
        header: 'Estas seguro de eliminar el registro ?',
        message: 'Esta acción no se podra revertir!',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Si, Eliminar',
            severity: 'danger'
        },
        accept: () => {
            deleteRegistro(data!);
        }
    });
}

</script>
<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consulta Folio Documento</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="Eliminar(registro)">
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
                        <InputText v-if="registro.conf_modulo" fluid disabled
                        :value="registro.conf_modulo.seccion+' '+registro.conf_modulo.subseccion+' '+registro.conf_modulo.modulo">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="documento" class="required col-form-label col-sm-2">Documento</label>
                    <div class="col-sm-4">
                        <InputText id="descripcion" v-model="registro.documento" maxlength="60" fluid disabled
                            :pt="{pcInputText: { root:{ class: 'text-end'}}}">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="folio" class="required col-form-label col-sm-2">Siguiente Folio</label>
                    <div class="col-sm-2">
                        <InputNumber id="folio" v-model="registro.folio_siguiente" :min="0" :max="999999999" fluid disabled
                            :pt="{pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                    <label for="serie" class="col-form-label col-sm-1">Serie</label>
                    <div class="col-sm-2">
                        <InputText id="serie" v-model="registro.serie" maxlength="5" fluid disabled>
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
                    v-if="sPermisos.indexOf('Eliminar') >= 0 "
                    label="Eliminar" type="submit"
                    :loading="isDeleting"
                    severity="danger" icon="pi pi-times" raised
                >
                </Button>
            </div>
        </form>
    </div>
    <Toast />
    <ConfirmDialog :pt="{ header: { class: 'bg-secondary mb-2'} }" />
</template>

<style scoped>

</style>