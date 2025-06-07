<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAssetPath } from "@/core/helpers/assets";
import type { Documento } from '../interfaces/interfaces';
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
    registros:      Documento[],
    currentBuscar:  string,
}

interface Emits {
    (e: 'buscarChanged', buscar: string): void;
}

const props         = defineProps<Props>();
const emits         = defineEmits<Emits>();
const router        = useRouter();
const { convertTMZdatetime,formatCurrency } = useUtilerias();


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
        class:          "text-end"
    },
    {
        columnLabel:    'Serie',
        columnField:    'serie',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Fecha',
        columnField:    'fecha',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Cliente',
        columnField:    'adm_cliente',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Orden',
        columnField:    'orden_taller',
        sortEnabled:    true,
        class:          "text-start"
    },
    {
        columnLabel:    'Subtotal',
        columnField:    'subtotal',
        sortEnabled:    true,
        class:          "text-end"
    },
    {
        columnLabel:    'Impuestos',
        columnField:    'impuestos',
        sortEnabled:    true,
        class:          "text-end"
    },
    {
        columnLabel:    'Total',
        columnField:    'total',
        sortEnabled:    true,
        class:          "text-end"
    },
    {
        columnLabel:    'Saldo',
        columnField:    'saldo',
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
permisos.value = store.permisos.filter((element: any) => element.codigo == '053'); // Administracion->Modulos->Nota Crédito Clientes
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

</script>

<template>
    <div class="card-header border-0 pt-6">
        <div class="card-toolbar">
            <div class="d-flex justify-content-end" data-kt-customer-table-toolbar="base">
                <Button label='Nueva Nota Crédito' severity="Primary" icon="pi pi-plus" raised
                    @click="() => { router.push({name: 'notacredito-nuevo', params: {id: 0}}) }"
                    v-if="sPermisos.indexOf('Nuevo') >= 0 "
                    v-tooltip-top="'Registrar nueva Nota Crédito '">
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
                    <label for="search" class="ms-10">Buscar en Notas de Crédito</label>
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
                        item.estatus == 'Cancelado' ? 'bg-opacity-50 bg-danger' : ''">
                        <td v-for="col in tableHeader" :key="col.columnLabel" :class="col.class">
                            <template v-if="col.columnField === 'actions'">
                                <Button severity="info" icon="pi pi-search" raised
                                    v-if="sPermisos.indexOf('Consultar') >= 0 "
                                    @click="() => { router.push({name: 'notacredito-consulta', params: {id: item.id}}) }"
                                    v-tooltip.top="{ value: 'Consultar', showDelay: 1000, hideDelay: 300}"
                                    class="me-3">
                                </Button>
                                <Button severity="warn" icon="pi pi-pencil" raised
                                    v-if="sPermisos.indexOf('Editar') >= 0 && (item.estatus == 'SinAplicar')"
                                    @click="() => { router.push({name: 'notacredito-edita', params: {id: item.id}}) }"
                                    v-tooltip.top="{ value: 'Editar', showDelay: 1000, hideDelay: 300}"
                                    class="me-3">
                                </Button>
                            </template>
                            <template v-else-if="col.columnField=='subtotal'">
                                {{  formatCurrency(item[col.columnField])   }}
                            </template>
                            <template v-else-if="col.columnField=='impuestos'">
                                {{  formatCurrency(item[col.columnField])  }}
                            </template>
                            <template v-else-if="col.columnField=='total'">
                                {{  formatCurrency(item[col.columnField])  }}
                            </template>
                            <template v-else-if="col.columnField=='saldo'">
                                {{  formatCurrency(item[col.columnField])  }}
                            </template>
                            <template v-else-if="col.columnField=='adm_cliente' && item['adm_cliente']">
                                {{  item[col.columnField]!['tipo_persona'] == 'Moral' 
                                            ? item[col.columnField]!['razon_social'] 
                                            : item[col.columnField]!['nombre']
                                }}
                            </template>
                            <template v-else-if="col.columnField=='fecha'">
                                {{  convertTMZdatetime(item[col.columnField].toString() ) }}
                            </template>
                            <template v-else-if="col.columnField=='estatus'">
                                <Tag :value="item['estatus']"
                                    :severity="item['estatus'] == 'Cancelado' 
                                    ? 'danger' 
                                    : item['estatus'] == 'Aplicado' 
                                        ? 'warn' 
                                        : item['estatus'] == 'SinAplicar' 
                                            ? 'info' : 'success' ">
                                </Tag>
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