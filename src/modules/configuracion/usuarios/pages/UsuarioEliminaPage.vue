<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import type { Usuario } from '../interfaces/usuario';
import useUsuario from '@/modules/configuracion/usuarios/composables/useUsuario';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";

const router    = useRouter();
const route     = useRoute();
const auth      = useAuthStore();
const confirm   = useConfirm();


const {
    registro,
    isPending,
    isError,
    nombredepartamento,
    nombrerol,
    isDeleting,
    isDeletingSuccess,
    
    deleteRegistro
} = useUsuario( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.replace('/usuarios')
})

const Eliminar = (registro: Usuario) => {
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
        <h2>Elimina Usuario</h2>
    </div>
    <div v-if="registro">
        <div v-if="registro">
            <form @submit.prevent="Eliminar(registro!)">
                <div class="card-body border-0 pt-0 pb-0">
                    <div class="row mb-3">
                        <label for="id" class="col-form-label col-sm-2">ID</label>
                        <div class="col-sm-2">
                            <InputNumber id="id" v-model="registro.id" disabled
                                :pt="{  root: { class: 'col-sm-12'}, 
                                    pcInputText: { root:{ class: 'text-end'}}
                                }">
                            </InputNumber>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="usuario" class="required col-form-label col-sm-2">Usuario</label>
                        <div class="col-sm-2">
                            <InputText id="usuario" v-model="registro.usuario" disabled
                                :pt="{root: { class: 'col-sm-12'}}">
                            </InputText>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="nombre" class="required col-form-label col-sm-2">Nombre</label>
                        <div class="col-sm-10">
                            <InputText id="nombre" v-model="registro.nombre" disabled
                                :pt="{root: { class: 'col-sm-12'}}">
                            </InputText>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="email" class="required col-form-label col-sm-2">Email</label>
                        <div class="col-sm-10">
                            <InputText id="email" v-model="registro.email" disabled
                                :pt="{root: { class: 'col-sm-12'}}">
                            </InputText>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-sm-4">
                            <div class="row">
                                <label for="codigo_pais" class="col-form-label col-sm-6">Codigo País</label>
                                <div class="col-sm-4">
                                    <InputText id="codigo_pais" v-model="registro.codigo_pais" disabled
                                        :pt="{root: { class: 'col-sm-12'}}">
                                    </InputText>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <div class="row">
                                <label for="telefono_movil" class="col-form-label col-sm-2">Teléfono Movil</label>
                                <div class="col-sm-5">
                                    <InputText id="telefono_movil" v-model="registro.telefono_movil" disabled
                                        :pt="{root: { class: 'col-sm-12'}}">
                                    </InputText>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="rol" class="col-form-label col-sm-2 fw-semibold fs-6">Rol</label>
                        <div class="col-sm-2">
                            <InputText type="text" v-model="nombrerol" disabled>
                            </InputText>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="departamento" class="col-form-label col-sm-2">Departamento</label>
                        <div class="col-sm-2">
                            <InputText type="text" v-model="nombredepartamento" disabled>
                            </InputText>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <Button
                        severity="secondary" label="Regresar"
                        class="me-4" raised icon="pi pi-arrow-left"
                        @click="() => { router.push({name: 'usuarios'})}">
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
    </div>
    
</template>
