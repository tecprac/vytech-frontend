<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import type { TipoServicio } from '../interfaces/interfaces';
import useTipoServicio from '../composables/useTipoServicio';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Toast from "primevue/toast";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { watch } from 'vue';

const route     = useRoute();
const router    = useRouter();
const confirm   = useConfirm();

const {
        registro, 
        isPending, 
        isError,
        dataMutationDelete,
        deleteRegistro,
        isDeleting,
        isDeletingSuccess,
} = useTipoServicio( +route.params.id );

watch( isDeletingSuccess, () => {
    setTimeout(() => {
        dataMutationDelete.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/tiposervicios')
})

const Eliminar = (registro: TipoServicio) => {
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
            deleteRegistro(registro!);
        }
    });

}

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Elimina Tipo de Servicio</h2>
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
                    <label for="descripcion" class="required col-form-label col-sm-2">Descripción</label>
                    <div class="col-sm-10">
                        <InputText id="descripcion" v-model="registro.descripcion" maxlength="120" disabled fluid
                            >
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="costo" class="col-form-label col-sm-2">
                        Costo Inicial
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Este costo se sumará automaticamente en la orden de servicio'"></i>
                    </label>
                    <div class="col-sm-2">
                        <InputNumber id="costo" v-model="registro.costo_inicial" mode="currency" currency="USD" locale="en-US" 
                            :min-fraction-digits="2" fluid disabled
                            :pt="{ pcInputText: { root:{ class: 'text-end'}}}">
                        </InputNumber>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="tiene_mantenimiento" class="col-form-label col-sm-3">
                        Acepta mantenimientos
                        <i class="pi pi-info-circle" style="font-size: 1rem;"
                        v-tooltip.top="'Acepta mantenimientos configurados previamente'"></i>
                    </label>
                    <div class="col-sm-1">
                        <Checkbox id="tiene_mantenimiento" v-model="registro.tiene_mantenimiento" fluid
                            binary disabled
                            >
                        </Checkbox>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'tiposervicios'})}">
                </Button>
                <Button
                    severity="danger" label="Eliminar" type="submit"
                    class="me-4" raised icon="pi pi-trash" :loading="isDeleting"
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