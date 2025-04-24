<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';
import useIniciaTermina from '../composables/useIniciaTermina';
//Componentes PRIMEVUE
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import Select from 'primevue/select';
import ConfirmPopup from 'primevue/confirmpopup';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Tag from 'primevue/tag';
const {
    isPending,
    isLoading,
    tecnicos,
    selectecnico,
    pin,
    trabajos,
    dialogOrden,
    dialogTrabajo,
    tipo_operacion,
    trabajo_actual,
    trabajo_bitacora,
    orden_consulta,

    BuscarTrabajos,
    ActualizaEstatus,
    openDialogOrden,
} = useIniciaTermina();

</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-6">
        <div class="card-title">
            <strong>Trabajos por Técnicos</strong>
        </div>
    </div>
    <div class="card-body border-0 pt-0 pb-0">
        <Toolbar class="mb-2">
            <template #start>
                <div class="flex items-center gap-2">
                    <!-- <label for="tecnico" class="col-form-label col-form-label-sm col-sm-3">Técnico</label> -->
                    <label for="tecnico" class="col-form-label me-2">Técnico</label>
                    <Select
                        v-model="selectecnico" :options="tecnicos" id="tecnico"
                        class="me-2"
                        placeholder="Selecciones un Técnico"
                        :option-label="(data) => {return data.nombres+' '+data.apaterno+' '+data.amaterno}"
                        >
                    </Select>
                    <template v-if="selectecnico.id > 0">
                        <!-- <label for="pin" class="col-form-label col-form-label-sm col-sm-2">PIN</label> -->
                        <label for="pin" class="col-form-label me-2">PIN</label>
                        <InputText
                            v-model="pin" maxlength="5" type="password" id="pin">
                        </InputText>
                    </template>
                </div>
            </template>

            <template #end> 
                <Button
                    label="Buscar" raised
                    :loading="isLoading"
                    icon="pi pi-search-plus"
                    @click="BuscarTrabajos">
                </Button>
            </template>
        </Toolbar>
        <DataTable :value="trabajos"
            show-gridlines scroll-height="flex" size="small" scrollable>
            <Column field="id" header="ID" class="text-center" :pt="{ headerCell: { class: 'bg-secondary'} }" />
            <Column header="ORDEN" class="text-center" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    <Button :label="data.orden_id" raised outlined severity="info"
                    @click="openDialogOrden(data.orden_id)" :loading="isLoading">
                    </Button>
                </template>
            </Column>
            <Column header="TRABAJO" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    {{ data.talle_trabajo.trabajo }}
                </template>
            </Column>
            <Column header="HORAS" class="text-center" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    {{ data.horas_estandar }}
                </template>
            </Column>
            <Column header="ESTATUS" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    <Tag :value="data.estatus"
                        :severity="data.estatus == 'SinIniciar' ? 'secondary' :
                                    data.estatus == 'EnProceso' ? 'success' :
                                    data.estatus == 'Pausa' ? 'warn' :
                                    data.estatus == 'Cancelado' ? 'danger': 'info'">
                    </Tag>
                </template>
            </Column>
            <Column header="ACCIONES" :pt="{ headerCell: { class: 'bg-secondary'} }">
                <template #body="{ data }">
                    <Button v-if="data.estatus == 'SinIniciar' || data.estatus == 'Pausa'"
                        raised rounded
                        icon="pi pi-play" class="me-2"
                        severity="success"
                        v-tooltip.top="'Iniciar el Trabajo'"
                        @click="ActualizaEstatus(data.id,'EnProceso','Mostrar')">
                    </Button >
                    <Button v-if="data.estatus == 'EnProceso'"
                        raised rounded
                        icon="pi pi-pause" class="me-2"
                        severity="warn"
                        v-tooltip.top="'Pausar el Trabajo'"
                        @click="ActualizaEstatus(data.id,'Pausa','Mostrar')">

                    </Button >
                    <Button v-if="data.estatus == 'EnProceso' || data.estatus == 'Pausa'"
                        raised rounded
                        icon="pi pi-stop" class="me-2"
                        severity="danger"
                        v-tooltip.top="'Terminar el Trabajo'"
                        @click="ActualizaEstatus(data.id,'Terminado','Mostrar')">

                    </Button>
                    <Button 
                        raised rounded
                        icon="pi pi-ban" class="me-2"
                        severity="contrast"
                        v-tooltip.top="'Cancelar el Trabajo'"
                        @click="ActualizaEstatus(data.id,'Cancelado','Mostrar')">
                    </Button>
                </template>
            </Column>
        </DataTable>
    </div>
    <!-- DIALOGO CONSULTA DE ORDEN -->
     <Dialog
        v-model:visible="dialogOrden"
        modal closable
        :header="'Datos de la Orden ID: ' + orden_consulta.id"
        :style="{width: '75rem'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    footer: { class: 'bg-secondary' } 
                }">
        <div class="row mt-2 mb-2">
            <label for="cliente" class="col-form-label col-sm-1">Cliente</label>
            <div class="col-sm-8">
                <InputText disabled fluid
                    :value="orden_consulta.adm_cliente!.tipo_persona == 'Moral' ? orden_consulta.adm_cliente?.razon_social : orden_consulta.adm_cliente?.nombre">
                </InputText>
            </div>
            <label for="cliente" class="col-form-label col-sm-1">Servicio</label>
            <div class="col-sm-2">
                <Button severity="primary" fluid disabled
                    :label="orden_consulta.talle_tipo_servicio?.tipo_servicio">
                </Button>
            </div>
        </div>
        <div class="row mb-2">
            <label for="unidad" class="col-form-label col-sm-1">Unidad</label>
            <div class="col-sm-2">
                <InputText disabled fluid
                    :value="orden_consulta.talle_unidad?.unidad">
                </InputText>
            </div>
            <label for="marca" class="col-form-label col-sm-1">Marca</label>
            <div class="col-sm-2">
                <InputText disabled fluid
                    :value="orden_consulta.talle_unidad?.talle_marca.marca">
                </InputText>
            </div>
            <label for="marca" class="col-form-label col-sm-1">Modelo</label>
            <div class="col-sm-2">
                <InputText disabled fluid
                    :value="orden_consulta.talle_unidad?.talle_modelo.modelo">
                </InputText>
            </div>
            <label for="motor" class="col-form-label col-sm-1">Motor</label>
            <div class="col-sm-2">
                <InputText disabled fluid
                    :value="orden_consulta.talle_unidad?.talle_motor.motor">
                </InputText>
            </div>
        </div>
        <div class="row mb-2">
            <label for="fallas" class="col-form-label col-sm-2">Fallas Reportadas</label>
            <div class="col-sm-10">
                <Textarea disabled fluid rows="5"
                    v-model="orden_consulta.fallas_reportadas">
                </Textarea>
            </div>
        </div>
        <template #footer>
            <Button 
                raised
                @click="() => { dialogOrden = false}"
                label="Cerrar"
                severity="secondary"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
     </Dialog>
    <!-- DIALOGO DE TRABAJO BITACORA -->
    <Dialog
        v-model:visible="dialogTrabajo"
        modal :closable="false"
        :header="(tipo_operacion == 'EnProceso' ? 'Iniciar' : 
                    tipo_operacion =='Pausa' ? 'Pausar' : 
                    tipo_operacion == 'Terminado' ? 'Terminar' : 'Cancelar') + 
                    ' Trabajo '+trabajo_actual?.talle_trabajo?.trabajo"
        :style="{width: '75rem'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }">
        <label for="comentarios" >Comentarios</label>
        <Textarea v-model="trabajo_bitacora.comentarios"
                fluid rows="3" id="comentarios">
        </Textarea>
        <template #footer>
            <Button 
                raised
                @click="() => { dialogTrabajo = false}"
                label="Cancelar"
                severity="secondary"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
            <Button 
                raised icon="pi pi-check"
                label="Aceptar"
                severity="success"
                :loading="isLoading"
                @click="ActualizaEstatus(0,tipo_operacion,'Cerrar')"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Button>
        </template>
    </Dialog>
    <Toast/>
    <Toast group="waiting">
        <template #message="slotProps">
            <div class="font-medium text-lg my-4">{{ slotProps.message.summary }}</div>
            <ProgressSpinner
                style="width: 25px; height: 25px" strokeWidth="8"
                fill="transparent"
                animation-duration=".5s"
            >

            </ProgressSpinner>
        </template>
    </Toast>
    <ConfirmPopup></ConfirmPopup>
</template>

<style scoped>

</style>