<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAssetPath } from "@/core/helpers/assets";
import type { Orden } from '../interfaces/interfaces';
import { useAuthStore } from "@/stores/auth";
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import useUtilerias from "@/core/helpers/utilerias" ;
import Tag from 'primevue/tag';
export interface Permisos {
    modulo: string,
    permiso: string,
}

interface Props {
    registros:      Orden[],
    currentBuscar:  string,
}

interface Emits {
    (e: 'buscarChanged', buscar: string): void;
}

const props         = defineProps<Props>();
const emits         = defineEmits<Emits>();
const router        = useRouter();
const { convertTMZdatetime, formatNumber } = useUtilerias();


const tableHeader   = ref([
    {
        columnLabel:    'ID',
        columnField:    'id',
        sortEnabled:    true,
        class:          "text-center"
    },
    {
        columnLabel:    'Folio',
        columnField:    'folio',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Serie',
        columnField:    'serie',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Fecha Alta',
        columnField:    'fecha_alta',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Unidad',
        columnField:    'talle_unidad',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Marca',
        columnField:    'talle_marca',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Modelo',
        columnField:    'talle_modelo',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Tipo Unidad',
        columnField:    'talle_tipo_unidad',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Tipo Servicio',
        columnField:    'talle_tipo_servicio',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Kilometraje',
        columnField:    'kms',
        sortEnabled:    true,
        class:          "text-end"
    },
    {
        columnLabel:    'Cliente',
        columnField:    'adm_cliente',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Dias en Proceso',
        columnField:    'dias_proceso',
        sortEnabled:    true,
        class:          "text-end"
    },
    {
        columnLabel:    'Estatus',
        columnField:    'estatus',
        sortEnabled:    true,
        class:          "text-center"
    },
    {
        columnLabel:    "Acciones",
        columnField:    "actions",
        sortEnabled:    false,
        class:          "text-center"
    },
])

const search = ref<string>(props.currentBuscar);
const store = useAuthStore();

const permisos = ref<Permisos[]>([]);
const sPermisos = ref<string>('');
permisos.value = store.permisos.filter((element: any) => element.codigo == '023'); // Taller->Modulos->Orden de Servicio
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

</script>

<template>
    <div class="card-header border-0 pt-6">
        <div class="card-toolbar">
            <div class="d-flex justify-content-end" data-kt-customer-table-toolbar="base">
                <Button label='Nueva Orden' severity="Primary" icon="pi pi-plus" raised
                    @click="() => { router.push({name: 'orden-nuevo', params: {id: 0}}) }"
                    v-if="sPermisos.indexOf('Nuevo') >= 0 "
                    v-tooltip-top="'Registrar nueva Orden '">
                </Button>
            </div>
        </div>
        <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
                <span class="svg-icon svg-icon-1 position-absolute ms-2">
                    <inline-svg :src="getAssetPath('media/icons/duotune/general/gen021.svg')" />
                </span>
                <FloatLabel variant="on">
                    <InputText type="text" id="search" v-model="search" @input="emits('buscarChanged',search)" variant="filled" class="ms-10"></InputText>
                    <label for="search" class="ms-10">Buscar en Ordenes</label>
                </FloatLabel>
            </div>
        </div>
        
    </div>
    <div class="card-body pt-0 py-0">
        <div class="table-responsive">
            <table class="table shadow-sm table-sm table-hover table-bordered table-rounded border gy-2 gs-2">
                <thead class="bg-gray-500">
                    <tr class="fw-bolder fs-5 text-gray-200">
                        <th v-for="columna in tableHeader" :key="columna.columnLabel" :class="columna.class" >
                            {{ columna.columnLabel }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in $props.registros" :key="item.id" :class="item.activo ==false ? 'bg-gray-300' : 
                        item.estatus == 'Cancelada' ? 'bg-opacity-50 bg-danger' : ''">
                        <td v-for="col in tableHeader" :key="col.columnLabel" :class="col.class">
                            <template v-if="col.columnField === 'actions'">
                                <Button severity="info" icon="pi pi-search" raised
                                    v-if="sPermisos.indexOf('Consultar') >= 0 "
                                    @click="() => { router.push({name: 'orden-consulta', params: {id: item.id}}) }"
                                    v-tooltip.top="{ value: 'Consultar', showDelay: 1000, hideDelay: 300}"
                                    class="me-3">
                                </Button>
                                <Button severity="warn" icon="pi pi-pencil" raised
                                    v-if="sPermisos.indexOf('Editar') >= 0 && (item.estatus == 'Abierta' || item.estatus == 'EnProceso')"
                                    @click="() => { router.push({name: 'orden-edita', params: {id: item.id}}) }"
                                    v-tooltip.top="{ value: 'Editar', showDelay: 1000, hideDelay: 300}"
                                    class="me-3">
                                </Button>
                            </template>
                            <template v-else-if="col.columnField=='talle_tipo_servicio'">
                                {{  item[col.columnField]!['tipo_servicio']  }}
                            </template>
                            <template v-else-if="col.columnField=='talle_unidad' && item['talle_unidad']">
                                {{  item[col.columnField]!['unidad']  }}
                            </template>
                            <template v-else-if="col.columnLabel=='Marca' && item['talle_unidad']">
                                {{  item['talle_unidad']['talle_marca']['marca']  }}
                            </template>
                            <template v-else-if="col.columnLabel=='Tipo Unidad' && item['talle_unidad']">
                                {{  item['talle_unidad']['talle_tipo_unidad']['tipo_unidad']  }}
                            </template>
                            <template v-else-if="col.columnLabel=='Modelo' && item['talle_unidad']">
                                {{  item['talle_unidad']['talle_modelo']['modelo']  }}
                            </template>
                            <template v-else-if="col.columnLabel=='Tipo Servicio' && item['talle_tipo_servicio']">
                                {{  item['talle_tipo_servicio']['tipo_servicio'] }}
                            </template>
                            <template v-else-if="col.columnField=='adm_cliente' && item['adm_cliente']">
                                {{  item[col.columnField]!['tipo_persona'] == 'Moral' 
                                            ? item[col.columnField]!['razon_social'] 
                                            : item[col.columnField]!['nombre']
                                }}
                            </template>
                            <template v-else-if="col.columnField=='fecha_alta'">
                                {{  convertTMZdatetime(item[col.columnField].toString() ) }}
                            </template>
                            <template v-else-if="col.columnField=='kms'">
                                {{  formatNumber( item[col.columnField] ) }}
                            </template>
                            <template v-else-if="col.columnField=='estatus'">
                                <Tag :value="item['estatus']"
                                    :severity="item['estatus'] == 'Cancelada' 
                                    ? 'danger' 
                                    : item['estatus'] == 'Pausa' 
                                        ? 'warn' 
                                        : item['estatus'] == 'Abierta' 
                                            ? 'info' : 'success' ">
                                </Tag>
                            </template>
                            <template v-else-if="col.columnField=='activo'">
                                {{  item[col.columnField] ? 'ACTIVO' : 'INACTIVO'  }}
                            </template>
                            <template v-else>
                                {{ item[col.columnField] }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped></style>