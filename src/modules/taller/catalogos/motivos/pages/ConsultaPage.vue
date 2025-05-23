<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import { useConfirm } from "primevue/useconfirm";
import { useAuthStore } from '@/stores/auth';
import ConfirmDialog from 'primevue/confirmdialog';

export interface Permisos {
    modulo: string,
    permiso: string,
}

const route     = useRoute();
const router    = useRouter();
const toast     = useToast();
const auth      = useAuthStore();
const confirm   = useConfirm();

const permisos = ref<Permisos[]>([]);
const sPermisos = ref<string>('');
permisos.value = auth.permisos.filter((element: any) => element.codigo == '051'); // Modulo Motivo Catalogo 
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

const {
    registro,
    isPending,
    isError,
    
    deleteRegistro

} = useMotivo( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.push({name: 'motivo'})
})

const Eliminar = (data: Motivo) => {
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
        <h2>Consulta Motivo</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="Eliminar(registro!)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="row mb-2">
                    <label for="id" class="col-form-label col-sm-2">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" maxlength="120" disabled fluid>
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="nombre" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="nombre" v-model="registro.descripcion" maxlength="120" fluid disabled>
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
                    v-if="sPermisos.indexOf('Eliminar') >= 0 "
                    label="Eliminar" type="submit"
                    severity="danger" icon="pi pi-times" raised
                    v-tooltip.top="{ value: 'Eliminar', showDelay: 1000, hideDelay: 300}">
                </Button>
            </div>
        </form>
    </div>
    <Toast />
    <ConfirmDialog :pt="{ header: { class: 'bg-secondary mb-2'} }" />
</template>

<style scoped>

</style>