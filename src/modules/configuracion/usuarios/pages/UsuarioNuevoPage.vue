<script setup lang="ts">
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useUsuario from '@/modules/configuracion/usuarios/composables/useUsuario';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import Message from 'primevue/message';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Select from 'primevue/select';
import { useForm } from 'vee-validate';
import useUtilerias from '@/core/helpers/utilerias';
import * as yup from 'yup';

const route  = useRoute();
const router = useRouter();

const { getLocalIP } = useUtilerias();

const {
    registro,
    isPending,
    isError,
    isAdding,
    isAddingSuccess,
    roles,
    departamentos,

    dataMutationNew,
    newRegistro,
    
} = useUsuario( +route.params.id );

const schema = yup.object({
    usuario:        yup.string().required().min(4).max(20).label('Usuario'),
    password:       yup.string().required().min(6).max(30).label('Password'),
    nombre:         yup.string().required().min(6).label('Nombre'),
    email:           yup.string().required().email().min(3).label('Correo electrónico'),
    codigo_pais:    yup.string().min(2).max(10).label('Codigo Telefonico País'),
    telefono_movil: yup.string().min(10).label('Telefono movil'),
    rol:            yup.object({
                        id: yup.number().required().min(1)
                    }).required(),
    departamento:   yup.object({
                        id: yup.number().required().min(1)
                    }).required(),
})

const { values, 
    defineField,
    handleSubmit,
    resetForm,
    errors,
    meta
}= useForm({ validationSchema: schema });

const [ usuario ]           = defineField('usuario');
const [ password ]          = defineField('password');
const [ nombre ]            = defineField('nombre');
const [ email ]             = defineField('email');
const [ codigo_pais ]       = defineField('codigo_pais');
const [ telefono_movil ]    = defineField('telefono_movil');
const [ rol ]               = defineField('rol');
const [ departamento ]      = defineField('departamento');

const onSubmit = handleSubmit( async (values) => {
    const ip = await getLocalIP();
    registro.value = {
        id:                 0,
        usuario:            values.usuario,
        password:           values.password,
        nombre:             values.nombre,
        email:              values.email,
        codigo_pais:        values.codigo_pais,
        telefono_movil:     values.telefono_movil,
        ipacceso:           ip,
        ultimo_acceso:      new Date(),
        rol_id:             values.rol.id,
        departamento_id:    values.departamento.id,
        activo:             true,
    }
    newRegistro(registro.value);
})

watch( isAddingSuccess, () => {
    if (isAddingSuccess) {
        setTimeout(() => {
            dataMutationNew.reset();
        }, 2000);
        resetForm();
    }
})

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
        <form @submit="onSubmit">
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
                        <InputText id="usuario" v-model="usuario" maxlength="30" 
                            :class="{ 'p-invalid' : errors.usuario}" aria-describedby="usuario-help"
                            :pt="{root: { class: 'col-sm-12'}}">
                        </InputText>
                        <Message v-if="errors.usuario" severity="error" variant="simple" size="small">{{ errors.usuario }}</Message>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="password" class="required col-form-label col-sm-2">Password</label>
                    <div class="col-sm-2">
                        <Password id="password" v-model="password" maxlength="30" 
                            toggle-mask
                            :class="{ 'p-invalid' : errors.password}" aria-describedby="password-help"
                            :pt="{root: { class: 'col-sm-11'}}">
                        </Password>
                        <Message v-if="errors.password" severity="error" variant="simple" size="small">{{ errors.password }}</Message>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="nombre" class="required col-form-label col-sm-2">Nombre</label>
                    <div class="col-sm-10">
                        <InputText id="nombre" v-model="nombre" placeholder="Capture el nombre completo del usuario"
                            :class="{ 'p-invalid' : errors.nombre}" aria-describedby="nombre-help"
                            :pt="{root: { class: 'col-sm-12'}}">
                        </InputText>
                        <Message v-if="errors.nombre" severity="error" variant="simple" size="small">{{ errors.nombre }}</Message>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="email" class="required col-form-label col-sm-2">Email</label>
                    <div class="col-sm-10">
                        <InputText id="email" v-model="email" placeholder="Correo electrónico asociado al usuario"
                            :class="{ 'p-invalid' : errors.email}" aria-describedby="email-help"
                            :pt="{root: { class: 'col-sm-12'}}">
                        </InputText>
                        <Message v-if="errors.email" severity="error" variant="simple" size="small">{{ errors.email }}</Message>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-4">
                        <div class="row">
                            <label for="codigo_pais" class="col-form-label col-sm-6">Codigo País</label>
                            <div class="col-sm-4">
                                <InputText id="codigo_pais" v-model="codigo_pais" 
                                    :class="['me-2',{ 'p-invalid' : errors.codigo_pais}]" aria-describedby="codigo_pais-help"
                                    :pt="{root: { class: 'col-sm-12'}}">
                                </InputText>
                            </div>
                            <div class="fv-plugins-message-container">
                                <div class="fv-help-block">
                                    <Message v-if="errors.codigo_pais" severity="error" variant="simple" size="small">{{ errors.codigo_pais }}</Message>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-8">
                        <div class="row">
                            <label for="telefono_movil" class="col-form-label col-sm-2">Teléfono Movil</label>
                            <div class="col-sm-5">
                                <InputText id="telefono_movil" v-model="telefono_movil" placeholder='Numero del celular del usuario'
                                    :class="{ 'p-invalid' : errors.telefono_movil}" aria-describedby="telefono_movil-help"
                                    :pt="{root: { class: 'col-sm-12'}}">
                                </InputText>
                            </div>
                            <div class="fv-plugins-message-container">
                                <div class="fv-help-block">
                                    <Message v-if="errors.telefono_movil" severity="error" variant="simple" size="small">{{ errors.telefono_movil }}</Message>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="rol" class="col-form-label col-sm-2 fw-semibold fs-6">Rol</label>
                    <div class="col-sm-2">
                        <Select v-model="rol" 
                        :options="roles"
                        option-label="nombre"
                        placeholder="Seleccione un Rol"
                        :pt="{
                            root: { class: 'col-sm-12'}
                        }"
                        >
                        </Select>
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block">
                                <Message v-if="errors.rol" severity="error" variant="simple" size="small">{{ errors.rol }}</Message>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="departamento" class="col-form-label col-sm-2">Departamento</label>
                    <div class="col-sm-2">
                        <Select v-model="departamento" 
                            :options="departamentos"
                            option-label="nombre"
                            placeholder="Seleccione un Departamento"
                            :pt="{
                                root: { class: 'col-sm-12'}
                            }">
                        </Select>
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block">
                                <Message v-if="errors.departamento" severity="error" variant="simple" size="small">{{ errors.departamento }}</Message>
                            </div>
                        </div>
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
                    severity="success" label="Guardar" type="submit"
                    class="me-4" raised icon="pi pi-check" :loading="isAdding"
                >
                </Button>
            </div>
        </form>
        <Toast />
    </div>
</template>