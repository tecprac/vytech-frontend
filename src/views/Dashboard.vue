<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import StatisticsWidget5 from "@/components/widgets/statsistics/Widget5.vue";
import ApiService from "@/core/services/ApiService";
import Swal from 'sweetalert2';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialogo from "primevue/dialog";
import DataTable from "primevue/datatable";
import Columna from "primevue/column";
import Boton from "primevue/button";
import useUtilerias from '@/core/helpers/utilerias';

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

export default defineComponent({
    name: "main-dashboard",
    components: {
        StatisticsWidget5,Toast,DataTable,
        Boton,Dialogo,Columna
    },
    setup() {
        const toast         = useToast();
        const ordenes       = ref<concentrado[]>([]);
        const tecnicos      = ref<tecnicos[]>([]);
        const dialogDetalle = ref<boolean>(false);
        const detalle       = ref();
        const expandedRows  = ref({});
        const estatus       = ref<string>('');
        const { convertTMZdatetime } = useUtilerias();

        const consultadatos = async () =>{
            Swal.fire({
                text: 'Consultando información',
                showConfirmButton: false,
            });
            Swal.showLoading();
            const response = await ApiService.get2('Orden/Dashboard',null);
            console.log(response.data);
            ordenes.value = response.data.concentrado;
            tecnicos.value = response.data.tecnicos;
            Swal.close();
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
            consultadatos();
        })

        return {
            ordenes,
            tecnicos,
            toast,
            dialogDetalle,
            expandedRows,
            detalle,
            estatus,

            getAssetPath,
            consultaOrdenes,
            convertTMZdatetime
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
                                <img :src="getAssetPath('media/logos/logo_prodiesel_ok.png')" alt="Logo ProDiesel" width="200px" class="img-fluid">
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
                    <!-- <div class="col-sm-12 text-center">
                        <img :src="getAssetPath('media/logos/logo_prodiesel_ok.png')" alt="Logo ProDiesel" width="800px" class="img-fluid">
                    </div> -->
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