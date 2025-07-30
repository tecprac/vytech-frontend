<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { provide, defineComponent, onMounted, ref } from "vue";
import StatisticsWidget5 from "@/components/widgets/statsistics/Widget5.vue";
import ApiService from "@/core/services/ApiService";
import Swal from 'sweetalert2';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialogo from "primevue/dialog";
import DataTable from "primevue/datatable";
import Columna from "primevue/column";
import Boton from "primevue/button";
import SelectPrime from "primevue/select";
import useUtilerias from '@/core/helpers/utilerias';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart,LineChart,PieChart} from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';

interface concentrado {
    estatus: string,
    ordenes: number,
}

interface tecnicos {
    tecnico_id: number,
    nombre:     string,
    estatus:    string,
    ordenes:    number,
}

interface DataSerie {
    name:       string,
    type:       string,
    tooltip:    object,
    label:      object,
    emphasis?:  object,
    stack?:     string,
    data:       number[],
}

interface OrdenesPorTipo {
    descripcion:    string,
    ordenes:        number,    
}

interface OrdenesPorTecnico {
    tecnico:    string,
    ordenes:    number,
}

interface TrabajosPorTipo {
    tipo:       string,
    trabajos:   number,
}

interface Mes {
    mes:    number,
    nombre: string,
}

import { 
    ToolboxComponent,
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    DataZoomComponent, 
} from 'echarts/components';

import VChart, { THEME_KEY } from 'vue-echarts';

use([
    ToolboxComponent,
    TooltipComponent,
    TitleComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
    BarChart,
    LineChart,
    PieChart,
    CanvasRenderer,
    UniversalTransition
]);

provide(THEME_KEY,'light');

export default defineComponent({
    name: "main-dashboard",
    components: {
        StatisticsWidget5,Toast,DataTable,
        Boton,Dialogo,Columna,VChart,SelectPrime,
    },
    setup() {
        const toast         = useToast();
        const ordenes       = ref<concentrado[]>([]);
        const tecnicos      = ref<tecnicos[]>([]);
        const ordenPorTipo  = ref<OrdenesPorTipo[]>([]);
        const ordenPorTecnico = ref<OrdenesPorTecnico[]>([]);
        const trabajosPorTipo = ref<TrabajosPorTipo[]>([]);
        const dialogDetalle = ref<boolean>(false);
        const detalle       = ref();
        const expandedRows  = ref({});
        const estatus       = ref<string>('');
        const meses         = ref<Mes[]>([
            {mes:1,nombre: 'Enero'},
            {mes:2,nombre: 'Febrero'},
            {mes:3,nombre: 'Marzo'},
            {mes:4,nombre: 'Abril'},
            {mes:5,nombre: 'Mayo'},
            {mes:6,nombre: 'Junio'},
            {mes:7,nombre: 'Julio'},
            {mes:8,nombre: 'Agosto'},
            {mes:9,nombre: 'Septiembre'},
            {mes:10,nombre: 'Octubre'},
            {mes:11,nombre: 'Noviembre'},
            {mes:12,nombre: 'Diciembre'},
        ]);
        const mesactual     = ref<Mes>();
        
        const echart        = ref();
        const echart2       = ref();
        const echart3       = ref();
        
        const { convertTMZdatetime } = useUtilerias();

        const consultadatos = async (mes:number) =>{
            Swal.fire({
                text: 'Consultando información',
                showConfirmButton: false,
            });
            Swal.showLoading();
            try {
                const response = await ApiService.get2(`Orden/Dashboard/${mes}`,null);
                ordenes.value       = response.data.concentrado;
                tecnicos.value      = response.data.tecnicos;
                ordenPorTipo.value  = response.data.ordenesportipo;
                ordenPorTecnico.value = response.data.ordenesportecnico;
                trabajosPorTipo.value = response.data.trabajospordivision;
                interface registro {
                        value: number,
                        name: string
                }
                let dataSerie:registro[] = [];
                for (let i = 0; i < ordenPorTipo.value.length; i++) {
                    dataSerie.push({value: + ordenPorTipo.value[i].ordenes, name: ordenPorTipo.value[i].descripcion});
                }
                let dataSerieTrabajo:registro[] = [];
                let dataCategoryTrabajo:string[] = [];
                let dataTipoTrabajo:number[] = [];
                for (let j = 0; j < trabajosPorTipo.value.length; j++) {
                    dataSerieTrabajo.push({
                        value: +trabajosPorTipo.value[j].trabajos, 
                        name: trabajosPorTipo.value[j].tipo 
                    });
                    dataTipoTrabajo.push(trabajosPorTipo.value[j].trabajos);
                    dataCategoryTrabajo.push(trabajosPorTipo.value[j].tipo);
                }
                let dataSerieTecnico:registro[] = [];
                let dataCategory:string[] = [];
                let dataTecnicos:number[] = [];
                for (let h = 0; h < ordenPorTecnico.value.length; h++) {
                    dataSerieTecnico.push({
                        value: ordenPorTecnico.value[h].ordenes, 
                        name: ordenPorTecnico.value[h].tecnico,
                    });
                    dataCategory.push(ordenPorTecnico.value[h].tecnico);
                    dataTecnicos.push(ordenPorTecnico.value[h].ordenes);
                }
                let option = {
                    title: {
                        text: 'ORDENES POR TIPO DE SERVICIO MES: ' + meses.value.find(item => item.mes == mes)!.nombre,
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: 14
                        },
                        subtext: `Ordenes Totales`,
                        subtextStyle: {
                            fontWeight: 'bold',
                            fontSize: 14
                        }
                    },
                    legend: {
                        show:   true,
                        orient: 'horizontal',
                        left:   'left',
                        data:   ordenPorTipo.value,
                        top:    40,
                    },
                    label: {
                        show: true
                    },
                    labelLine: {
                        show: false
                    },
                    dataZoom: [
                        {
                            show:   false,
                            start:  0,
                            end:    100,
                        },
                        {
                            type:   'inside',
                            start:  0,
                            end:    70,
                        },
                        {
                            show:           false,
                            yAxisIndex:     0,
                            filterMode:     'empty',
                            width:          30,
                            height:         '80%',
                            showDataShadow: false,
                            left:           '93%'
                        }
                    ],
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: false, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                    },
                    grid: {
                        show:  false,
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top: '75',
                        containLabel: true
                    },
                    series: [
                        {
                            name: 'Tipos de Servicio',
                            type: 'pie',
                            radius: '50%',
                            itemStyle: {
                                borderRadius: 5,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            tooltip: {
                                valueFormatter: function (value: number) {
                                    return value;
                                }
                            },
                            label: {
                                position: 'outside',
                                show: true,
                                fontWeight: "bold",
                                // formatter: `{b}: \$ {c} ({d}%)`
                                formatter: function(params: any) {
                                    let arr = [
                                        params.name + ': '+
                                        params.value+ ' \n'+
                                        '(' + params.percent + '%)'
                                    ]
                                    return arr;
                                }
                            },
                            data: dataSerie,
                        }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                };
                option.title.subtext = 'Total ordenes: '+ ordenPorTipo.value.reduce((acum, value) => acum + +value.ordenes, 0 );
                echart.value.setOption(option);
                let dataSeries  = [
                                    {
                                        name: 'Ordenes',
                                        type: 'bar',
                                        colorBy: 'data',
                                        tooltip: {
                                            valueFormatter: function (value: number) {
                                                return value;
                                            }
                                        },
                                        label: {
                                            position: 'top',
                                            show: true,
                                            fontWeight: "bold",
                                        },
                                        data: dataTecnicos
                                    },
                                ];
                let optiontecnico = {
                    title: {
                        text:       'ASIGNACIÓN DE ORDENES POR TÉCNICO MES: ' + meses.value.find(item => item.mes == mes)!.nombre,
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: 14
                        },
                        subtext:    ``,
                        subtextStyle: {
                            fontWeight: 'bold',
                            fontSize: 14
                        }
                    },
                    legend: {
                        shadow: true,
                        padding: [25,5,5,10],
                        data: ['Ordenes']
                    },
                    label: {
                        show: true,
                        formatter: function ( data: any) {
                            const texto = Number.isNaN( Number.parseFloat(data.value) ) 
                                            ? data.value
                                            : data.value;
                            return  texto;
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    tooltip: {
                        show:       true,
                        trigger:    'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                    },
                    grid: {
                        show:   true,
                        left:   '3%',
                        right:  '4%',
                        bottom: '3%',
                        top:    '75',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: dataCategory,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type:     'value',
                            name:     'Ordenes',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                    ],
                    series: dataSeries
                }
                optiontecnico.title.subtext = 'Total ordenes: '+ ordenPorTecnico.value.reduce((acum, value) => acum + +value.ordenes, 0 );
                echart2.value.setOption(optiontecnico);
                let dataSeriesTrabajo  = [
                                    {
                                        name: 'Trabajos',
                                        type: 'bar',
                                        colorBy: 'data',
                                        tooltip: {
                                            valueFormatter: function (value: number) {
                                                return value;
                                            }
                                        },
                                        label: {
                                            position: 'top',
                                            show: true,
                                            fontWeight: "bold",
                                        },
                                        data: dataSerieTrabajo
                                    },
                                ];
                let optiontrabajos = {
                    title: {
                        text:       'TRABAJOS POR TIPO/DIVISIÓN MES: ' + meses.value.find(item => item.mes == mes)!.nombre,
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: 14
                        },
                        subtext:    ``,
                        subtextStyle: {
                            fontWeight: 'bold',
                            fontSize: 14
                        }
                    },
                    legend: {
                        shadow: true,
                        padding: [25,5,5,10],
                        data: ['Trabajos']
                    },
                    label: {
                        show: true,
                        formatter: function ( data: any) {
                            const texto = Number.isNaN( Number.parseFloat(data.value) ) 
                                            ? data.value
                                            : data.value;
                            return  texto;
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    tooltip: {
                        show:       true,
                        trigger:    'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                    },
                    grid: {
                        show:   true,
                        left:   '3%',
                        right:  '4%',
                        bottom: '3%',
                        top:    '75',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: dataCategoryTrabajo,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type:     'value',
                            name:     'Trabajos',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                    ],
                    series: dataSeriesTrabajo
                }                
                optiontrabajos.title.subtext = 'Total trabajos: '+ trabajosPorTipo.value.reduce((acum, value) => acum + +value.trabajos, 0 );
                echart3.value.setOption(optiontrabajos);
                Swal.close();
            } catch (error) {
                Swal.close();
            }
        }

        const consultaOrdenes = async (tipo: string) => {
            estatus.value = tipo;
            try {
                // Swal.fire({
                //     text: 'Consultando información',
                //     showConfirmButton: false,
                // });
                // Swal.showLoading();
                const response = await ApiService.get2(`Orden/OrdenesByEstatus/${estatus.value}`,null);
                detalle.value = null;
                detalle.value = response.data;
                if (detalle.value) {
                    dialogDetalle.value = true;
                } else {
                    toast.add({
                        severity: 'contrast',
                        summary: 'No se encontraron Ordenes',
                        detail: 'No existen ordenes con el estatus: '+estatus.value,
                        life:   3500
                    });    
                }
                Swal.close();
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Error al consultar información',
                    detail: 'Se genero el siguiente error \n'+error,
                    life:   3500
                });
            }
        }

        onMounted( () => {
            mesactual.value = meses.value.find(item => item.mes == (new Date()).getMonth()+1);
            consultadatos(mesactual.value!.mes);
        })

        return {
            ordenes,
            tecnicos,
            toast,
            dialogDetalle,
            expandedRows,
            detalle,
            estatus,
            meses,
            mesactual,
            echart,
            echart2,
            echart3,

            getAssetPath,
            consultadatos,
            consultaOrdenes,
            convertTMZdatetime,
        };
    },
});
</script>

<template>
    <div class="row">
        <div class="col-12">
            <div class="card card-flush h-lg-100 shadow">
                <div class="card-body">
                    <div class="card-px text-center">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h2 class="fs-2x fw-bold mt-10 text-primary">VYTechServices</h2>
                            </div>
                            <div class="col-sm-6">
                                <img :src="getAssetPath('media/logos/logo_ok.png')" alt="Logo" width="200px" class="img-fluid">
                            </div>
                        </div>
                    </div>
                    <div class="row g-5 g-xl-8">
                        <div class="col-xl-3">
                            <StatisticsWidget5 v-if="ordenes.find(item => item.estatus == 'Abierta')"
                                widget-classes="card-xl-stretch mb-xl-8 shadow"
                                icon-name="paper-clip"
                                color="light-info"
                                icon-color="info"
                                :title="ordenes.find(item => item.estatus == 'Abierta')!.ordenes.toString()"
                                description="Ordenes Abiertas"
                                @click="consultaOrdenes('Abierta')"
                            ></StatisticsWidget5>
                        </div>

                        <div class="col-xl-3">
                        <StatisticsWidget5  v-if="ordenes.find(item => item.estatus == 'EnProceso')"
                            widget-classes="card-xl-stretch mb-xl-8 shadow"
                            icon-name="delivery-time"
                            color="light-success"
                            icon-color="info"
                            :title="ordenes.find(item => item.estatus == 'EnProceso')!.ordenes.toString()"
                            description="Ordenes EnProceso"
                            @click="consultaOrdenes('EnProceso')"
                        ></StatisticsWidget5>
                        </div>

                        <div class="col-xl-3">
                        <StatisticsWidget5 v-if="ordenes.find(item => item.estatus == 'Cerrada')"
                            widget-classes="card-xl-stretch mb-xl-8 shadow"
                            icon-name="lock-3"
                            color="light-warning"
                            icon-color="info"
                            :title="ordenes.find(item => item.estatus == 'Cerrada')!.ordenes.toString()"
                            description="Ordenes Cerradas"
                            @click="consultaOrdenes('Cerrada')"
                        ></StatisticsWidget5>
                        </div>

                        <div class="col-xl-3">
                        <StatisticsWidget5 v-if="ordenes.find(item => item.estatus == 'ParcialFacturada')"
                            widget-classes="card-xl-stretch mb-xl-8 shadow"
                            icon-name="chart-pie-simple"
                            color="dark"
                            icon-color="white"
                            :title="ordenes.find(item => item.estatus == 'Cerrada')!.ordenes.toString()"
                            description="Ordenes Parcialmente Facturadas"
                            @click="consultaOrdenes('ParcialFacturada')"
                        ></StatisticsWidget5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-4 g-5 g-xl-10 mb-5 mb-xl-10">
        <div class="col-xxl-6">
            <div class="card card-flush h-lg-100 shadow">
                <div class="card-body">
                    <div class="row">
                        <label for="mesactual" class="col-form-label col-form-label-sm col-sm-2">Mes</label>
                        <div class="col-sm-4">
                            <SelectPrime v-model="mesactual" :options="meses"
                                option-label="nombre" variant="filled"
                                placeholder="Seleccione un Mes" fluid
                                @change="consultadatos(mesactual!.mes)">
                            </SelectPrime>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <v-chart 
                            ref="echart"
                            class="echart" 
                            autoresize
                            :manual-update="true"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-6">
            <div class="card card-flush h-lg-100 shadow">
                <div class="card-body">
                    <div class="row mt-2">
                        <v-chart 
                            ref="echart2"
                            class="echart" 
                            autoresize
                            :manual-update="true"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
        <div class="col-xxl-12">
            <div class="card card-flush h-lg-100 shadow">
                <div class="card-body">
                    <div class="row mt-2">
                        <v-chart 
                            ref="echart3"
                            class="echart" 
                            autoresize
                            :manual-update="true"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- DIALOG DETALLE ORDEN -->
     <Dialogo
        v-model:visible="dialogDetalle"
        modal :closable="true" maximizable
        :style="{width: '80rem'}"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :header="'Consulta de Ordenes con estatus: '+estatus"
        :pt = " { 
                    header: { class: 'bg-secondary' },
                    // content: { style: 'height: 360px'},
                    footer: { class: 'bg-secondary' } 
                }"
        >
        <DataTable
            :value="detalle" scrollable>
            <Columna field="folio" header="Orden" class="text-center"></Columna>
            <Columna field="fecha_alta" header="Fecha Alta" class="text-star">
                <template #body="{data}">
                    {{ convertTMZdatetime(data.fecha_alta) }}
                </template>
            </Columna>
            <Columna field="talle_tipo_servicio" header="Tipo Servicio" class="text-star">
                <template #body="{data}">
                    {{ data.talle_tipo_servicio.tipo_servicio }}
                </template>
            </Columna>
            <Columna field="adm_cliente" header="Cliente" class="text-star">
                <template #body="{data}">
                    {{ data.adm_cliente.tipo_persona == 'Moral' ? data.adm_cliente.razon_social : data.adm_cliente.nombre }}
                </template>
            </Columna>
            <Columna field="talle_unidad" header="Unidad" class="text-star">
                <template #body="{data}">
                    {{ data.talle_unidad.unidad+' '+data.talle_unidad.talle_tipo_unidad.tipo_unidad+' '+data.talle_unidad.talle_marca.marca+' '+data.talle_unidad.talle_modelo.modelo }}
                </template>
            </Columna>
        </DataTable>
        <template #footer>
            <Boton 
                raised
                @click="() => { dialogDetalle = false}"
                label="Cerrar"
                severity="secondary"
                icon="pi pi-times"
                :pt="{
                    root: { class: 'mt-2'}
                }"
            >
            </Boton>
        </template>
     </Dialogo>
   <Toast/>
</template>

<style scoped>
.echart {
  height: 30vh;
}
</style>