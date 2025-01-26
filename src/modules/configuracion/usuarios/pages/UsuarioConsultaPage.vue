<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useUsuario from '@/modules/configuracion/usuarios/composables/useUsuario';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';

export interface Permisos {
    modulo: string,
    permiso: string,
}


const router = useRouter();
const route  = useRoute();
const auth   = useAuthStore();

const permisos = ref<Permisos[]>([]);
const sPermisos = ref<string>('');
permisos.value = auth.permisos.filter((element: any) => element.codigo == '007'); // Modulo Usuarios
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});


const {
    registro,
    isPending,
    isError,
    nombredepartamento,
    nombrerol,
    dialogPassword,
    cambiarPassword,
    
    mostrarDialogPassword,
    enviarPassword,
} = useUsuario( +route.params.id );

watch(isError, () => {
    if(isError.value)
        router.replace('/usuarios')
})

</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Nuevo Usuario</h2>
    </div>
    <div v-if="registro">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="row mb-1">
                    <div class="col-sm-3">
                        <Button
                            v-if="!registro.superusuario && sPermisos.indexOf('Cambiar-Contraseña')"
                            severity="info"
                            @click="mostrarDialogPassword"
                            icon="pi pi-refresh"
                            label="Cambiar Contraseña"
                            raised
                            >
                        </Button>
                    </div>
                </div>
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
            </div>
        <Toast />
    </div>

    <!-- DIALOGO CAMBIAR PASSWORD -->
    <Dialog
        v-model:visible="dialogPassword"
        header="Cambiar Contraseña de acceso al sistema"
        :style="{width: '40vw' }"
        modal
        :close-on-escape="false"
        :pt = " { 
                    header: { class: 'bg-secondary' } ,
                    footer: { class: 'bg-light' } 
                }"
        >
        <div class="row mt-2 mb-2">
            <label for="password" class="col-sm-3 col-form-label col-form-label-sm">Nueva Contraseña:</label>
            <div class="col-sm-7 fv-row">
                <Password 
                    v-model="cambiarPassword.password"
                    prompt-label="Capture nueva contraseña"
                    weakLabel="Contraseña debil" 
                    mediumLabel="Contraseña intermedia" 
                    strongLabel="Contraseña muy segura"
                    toggle-mask>

                </Password>
            </div>
        </div>
        <div class="row mb-2">
            <label for="confirmapwd" class="col-sm-3 col-form-label col-form-label-sm">Confirmar Contraseña:</label>
            <div class="col-sm-7 fv-row">
                <Password 
                    v-model="cambiarPassword.confirmapwd"
                    prompt-label="Confirmar contraseña"
                    weakLabel="Contraseña debil" 
                    mediumLabel="Contraseña intermedia" 
                    strongLabel="Contraseña muy segura"
                    toggle-mask>
                </Password>
            </div>
        </div>
        <template #footer>
            <br>
            <Button class="btn btn-sm btn-secondary me-2" 
                @click="() => { dialogPassword = false }">
                Cancelar
            </Button>
            <Button class="btn btn-sm btn-primary" 
                @click="enviarPassword">
                Cambiar
            </Button>
        </template>
    </Dialog>
</template>
