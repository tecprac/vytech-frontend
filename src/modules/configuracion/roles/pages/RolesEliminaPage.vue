<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import type { Rol } from '../interfaces/rol';
import useRol from '@/modules/configuracion/roles/composables/useRol';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from "primevue/toast";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { watch } from 'vue';
import Swal from "sweetalert2";


const route     = useRoute();
const router    = useRouter();
const confirm   = useConfirm();

const {
        rol, 
        isPending, 
        isError,
        rolMutationDelete,
        deleteRol,
        isDeleting,
        isDeletingSuccess,
    } = useRol( +route.params.id );

watch( isDeletingSuccess, () => {
    setTimeout(() => {
        rolMutationDelete.reset();
    }, 2000);
})

watch(isError, () => {
    if(isError.value)
        router.replace('/roles')
})

const Eliminar = (rol: Rol) => {
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
            deleteRol(rol!);
        }
    });

}

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Elimina Rol</h2>
    </div>
    <div v-if="rol">
        <form @submit.prevent="Eliminar(rol!)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="fv-row mb-2">
                    <label for="id" class="form-label col-sm-2">ID</label>
                    <InputNumber id="id" v-model="rol.id" maxlength="120" disabled
                    :pt="{  root: { class: 'col-sm-2'}, 
                            pcInputText: { root:{ class: 'text-end'}}
                        }">
                    </InputNumber>
                </div>
                <div class="fv-row mb-5">
                    <label for="descripcion" class="required form-label col-sm-2">Descripción</label>
                    <InputText id="descripcion" v-model="rol.nombre" maxlength="120" disabled
                    :pt="{root: { class: 'col-sm-10'}}">
                    </InputText>
                </div>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'roles'})}">
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