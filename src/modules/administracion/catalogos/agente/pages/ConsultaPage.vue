<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useAgente from '../composables/useAgente';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { watch } from 'vue';
import type { Agente } from '../interfaces/interfaces';
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
permisos.value = auth.permisos.filter((element: any) => element.codigo == '049'); // Modulo Admimistración Catalogo Agente
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

const {
    registro,
    isPending,
    isError,

    deleteRegistro

} = useAgente( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.push({name: 'agente'});
})

const Eliminar = (data: Agente) => {
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
        <h2>Consultar Agente</h2>
    </div>
    <div v-if="registro"> 
        <form @submit.prevent="Eliminar(registro!)">
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
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            Nombre(s)
                        </label>
                        <InputText v-model="registro.nombre" disabled
                            class="form-control">
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            Apellido Paterno
                        </label>
                        <InputText v-model="registro.apaterno" disabled
                            class="form-control">
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label class="required form-label fs-6 fw-semibold mb-2">
                            Apellido Materno
                        </label>
                        <InputText v-model="registro.amaterno" disabled
                            class="form-control">
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="porc_venta" class="required col-form-label col-sm-2">
                        Porcentaje de Venta
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Porcentaje sobre cada venta realizada por el agente'"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="porc_venta" v-model="registro.porc_venta" mode="decimal" locale="en-US"
                            :min="0" :max="100.00" disabled
                            :min-fraction-digits="2" fluid highlight-on-focus
                            :pt="{root: { class: 'col-sm-10'},
                            pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                    <label for="porc_cobro" class="required col-form-label col-sm-2">
                        Porcentaje de Cobro
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Porcentaje sobre cada pago de la venta realizada por el agente'"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="porc_cobro" v-model="registro.porc_cobro" mode="decimal" locale="en-US"
                            :min="0" :max="100.00" disabled
                            :min-fraction-digits="2" fluid highlight-on-focus
                            :pt="{root: { class: 'col-sm-10'},
                            pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'agente'})}">
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