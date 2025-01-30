<script setup lang="ts">
import { watch,ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import type { Permisos,UnidadMedida } from '../interfaces/interfaces';
import { useAuthStore } from '@/stores/auth';
import useUnidadMedida from '../composables/useUnidadMedida';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';


const route     = useRoute();
const router    = useRouter();
const auth      = useAuthStore();
const confirm   = useConfirm();

const permisos = ref<Permisos[]>([]);
const sPermisos = ref<string>('');
permisos.value = auth.permisos.filter((element: any) => element.codigo == '042'); // Modulo Admimistración Usuarios
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

const {
        registro, 
        isPending, 
        isError,
        isDeleting,
        isDeletingSuccess,
        dataMutationDelete,

        deleteRegistro,
} = useUnidadMedida( +route.params.id );


watch( isDeletingSuccess, () => {
    setTimeout(() => {
        dataMutationDelete.reset();
    }, 2000);
})


watch(isError, () => {
    if(isError.value)
        router.push({name: 'unidadmedida'})
})

const Eliminar = (data: UnidadMedida) => {
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
        <h2>Consulta Unidad Medida</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="Eliminar(registro!)">
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
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'marcas'})}">
                </Button>
                <Button 
                    v-if="sPermisos.indexOf('Eliminar') >= 0 "
                    label="Eliminar" type="submit" :loading="isDeleting"
                    severity="danger" icon="pi pi-times" raised
                    v-tooltip.top="{ value: 'Eliminar', showDelay: 1000, hideDelay: 300}"
                >
                </Button>
            </div>
        </form>
        <Toast/>
        <ConfirmDialog :pt="{ header: { class: 'bg-secondary mb-2'} }" />
    </div>
</template>

<style scoped>

</style>