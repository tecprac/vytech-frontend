<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
permisos.value = auth.permisos.filter((element: any) => element.codigo == '050'); // Modulo Almacen Catalogo Almacenes
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

const {
    registro,
    isPending,
    isError,
    
    deleteRegistro

} = useAlmacen( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.push({name: 'almacen'})
})

const Eliminar = (data: Almacen) => {
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
        <h2>Consulta Almacén</h2>
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
                        <InputText id="nombre" v-model="registro.nombre" maxlength="120" fluid disabled>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="direccion" class="col-form-label col-sm-2">Dirección</label>
                    <div class="col-sm-10">
                        <InputText id="nombre" v-model="registro.direccion" maxlength="120" fluid disabled>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="ciudad" class="col-form-label col-sm-2">Ciudad</label>
                    <div class="col-sm-3">
                        <InputText id="nombre" v-model="registro.ciudad" maxlength="120" fluid disabled>
                        </InputText>
                    </div>
                    <label for="estado" class="col-form-label col-sm-2">Estado</label>
                    <div class="col-sm-3">
                        <InputText id="estado" v-model="registro.estado" maxlength="120" fluid disabled>
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
                            :pt="{root: { class: 'text-start col-sm-1'}}" disabled>
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