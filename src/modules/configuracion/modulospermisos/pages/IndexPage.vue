<template>
    <div class="card-header border-0 pt-6">
        <div class="card-title">
            <strong>Asignación de Permisos a Modulos</strong>
        </div>
    </div>
    <div class="card-body border-0 pt-0 pb-0">
        <div class="row mb-10 align-items-start">
            <div class="col-sm-4">
                <div class="card">
                    <div class="card-title text-center bg-info text-white">
                        <strong>Permisos Disponibles</strong>
                    </div>
                    <div class="card-body border-0 pt-0 pb-0">
                        <div class="copy table-responsive" style="height: 500px;">
                            <div class="item card-container">
                                <ContainerDrag 
                                    class="item"
                                    group-name="1"
                                    :get-child-payload="getChildPayload1"
                                    @drop="onDropOrigen('aPermisos',$event)">
                                    <Draggable v-for="permiso in aPermisos" :key="permiso.id">
                                        <div class="draggable-item">
                                            {{ permiso.data }}
                                        </div>
                                    </Draggable>
                                </ContainerDrag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="card">
                    <div class="card-title text-center bg-primary text-white">
                        <strong>Modulos</strong>
                    </div>
                    <div class="card-body border-0 pt-0 pb-0">
                        <div class="row mb-3">
                            <label for="seccion" class="col-sm-2 col-form-label col-form-label-sm fw-semobold fs-6">Secciones:</label>
                            <div class="col-sm-6">
                                <Select
                                    v-model="selseccion"
                                    :options="secciones"
                                    fluid
                                    @change="cambiaSeccion"
                                >
                                </Select>
                            </div>
                            
                        </div>
                        <div class="row mb-10">
                            <label for="modulo" class="col-sm-2 col-form-label col-form-label-sm fw-semobold fs-6">Modulos:</label>
                            <div class="col-sm-6">
                                <select
                                name="modulo"
                                id="modulo"
                                data-control="select2"
                                data-hide-searc="true"
                                v-model="moduloSeleccionado"
                                @change="cambiaModulo"
                                class="form-select form-select-white form-select-sm"
                                >
                                    <option v-for="modulo in aSubModulos" v-bind:key="modulo.id">
                                        {{ modulo.subseccion+' '+modulo.data }}
                                    </option>                                        
                                </select>
                                <div class="group card-container">
                                    <ContainerDrag
                                        group-name="1"
                                        :get-child-payload="getChildPayload2"
                                        @drop="onDropDestino('aModuloPermisos',$event)"
                                    >
                                        <Draggable v-for="modulopermiso in aModuloPermisos" :key="modulopermiso.id">
                                            <div class="draggable-item">
                                                {{ modulopermiso.data }}
                                            </div>
                                        </Draggable>
                                    </ContainerDrag>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast/>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import { Container as ContainerDrag, Draggable} from "vue-dndrop";
import ApiService from "@/core/services/ApiService";
import { applyDrag } from '../helpers/index';
import type { Permiso, Modulo, Registro, ModuloPermiso } from '../interfaces/interfaces';
import Select from "primevue/select";
import Toast from "primevue/toast";

export default defineComponent ({
    name: 'modulospermisos',
    components: {
        ContainerDrag, Draggable, Toast, Select
    },
    data() {
        return {
            /* eslint-disable */
            aPermisos:          <Permiso[]>([]),
            /* eslint-enable */
            aModulos:           <Modulo[]>([{data: 'Seleccione un Modulo', id: 0}]),
            aSubModulos:        <Modulo[]>([{data: 'Seleccione un Modulo', id: 0}]),
            aModuloPermisos:    <ModuloPermiso[]>([]),
            moduloSeleccionado: <String>('Seleccione un Modulo'),
            registroLocal:      <Registro>({idModulo: 0,idPermiso: 0}),
            secciones:          ['CONFIGURACION','ALMACEN','TALLER','ADMINISTRACION'],
            selseccion:         'CONFIGURACION',
        }
    },

    async created() {
        ApiService.setHeader();
        let response = await ApiService.get2('/Permisos/listado',null);
        let dataPermiso = response.data;
        dataPermiso.forEach((element: any) => {
            this.aPermisos.push({id: element.id, data:element.nombre});
        });
        response = await ApiService.get2(`/Modulos/listado`,null);
        let dataModulos = response.data
        dataModulos.forEach((element: any) => {
            this.aModulos.push({
                id:         element.id,
                data:       element.nombre,
                seccion:    element.seccion,
                subseccion: element.subseccion,
             });
        });
        this.cambiaSeccion();
    },
    methods: {
        getChildPayload1 (index: number) {
            return this.aPermisos[index];
        },

         getChildPayload2 (index: number) {
            return this.aModuloPermisos[index];
        },

        async cambiaSeccion () {
            this.aModuloPermisos = [];
            this.aPermisos = [];
            this.aSubModulos = this.aModulos.filter(item => item.seccion == this.selseccion);
        },

        async cambiaModulo (event: any) {
            this.aModuloPermisos = [];
            this.aPermisos = [];
            let moduloSel = this.aSubModulos.find(element => (element.subseccion+' '+element.data) == this.moduloSeleccionado)
            if (moduloSel){
                this.registroLocal.idModulo = moduloSel.id
            }
            ApiService.setHeader();
            let response = await ApiService.get2(`/Modulos/GetModuloPermisos/${this.registroLocal.idModulo}`,null);
            response.data.forEach(element => {
                this.aModuloPermisos.push({id: element.id, data: element.permiso})
            })
            response = await ApiService.get2('/Permisos/listado',null);
            response.data.forEach(element => {
                if (!this.aModuloPermisos.find(element2 => element2.data == element.nombre))
                {
                    this.aPermisos.push({id: element.id, data: element.nombre})
                }
            })  
        },

        async onDropDestino (collection: any, dropResult: any) {
            if (dropResult.removedIndex !== null || dropResult.addedIndex !== null)
            {
                    const {payload } = dropResult
                    if (!this.aModuloPermisos.find(element => element.data == payload.data))
                    {
                        this[collection] = applyDrag(this[collection], dropResult)
                        ApiService.setHeader();
                        await ApiService.put(`/Modulos/InsertaModuloPermiso/${this.registroLocal.idModulo}/${payload.id}`,null);
                    } else {
                        this[collection] = applyDrag(this[collection], dropResult)
                    }    
            }
        },

        async onDropOrigen (collection: any, dropResult: any) {
            if (dropResult.removedIndex !== null || dropResult.addedIndex !== null)
            {
                const { payload } = dropResult;
                ApiService.setHeader();
                let response = await ApiService.put(`/Modulos/EliminaModuloPermiso/${payload.id}`,null);
                this[collection] = applyDrag(this[collection], dropResult)
            }
        },
    },

});

</script>

<style lang="scss" scoped>

.copy {
    display: flex;
    gap: 1rem;
}
.item {
    flex: 1;
}

.draggable-item {
    height: 50px;
    flex-direction: row !important;
    justify-content: space-between;
    text-align: center;
    background-color: white;
    border: 1px solid #597ba0aa;
    border-left: 5px solid #3868d1;
    margin: 5px;
    padding: 1rem 0;
    cursor: pointer;
    border-radius: 4px;
}

.draggable-item-horizontal {
    height: 300px;
    align-items: center;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: 8px;
    cursor: pointer;
    user-select: none;
    background-color: white;
    border: 1px solid #597ba0aa;
    border-top: 5px solid #42b883;
    border-radius: 4px;
    transition: border-color 0.2s linear;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
}

.draggable-item div, .draggable-item-horizontal div {
    color: red
}

.dragging {
    background-color: yellow;
   
}

.card-scene {
    max-width: 740px;
    margin: 0 auto;
    padding: 2rem 2.5rem;
}

.card-container {
    padding: 10px;
    margin: 5px;
    background-color: #f3f3f3;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
}

.card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: 8px;
    cursor: pointer;
    user-select: none;
    background-color: white;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s linear;
}

.card-text{
    color: #f2f2f2;
}


.card h3 {
    color: #f2f2f2;
    margin: 0;
}

.card-column-header {
    font-size: 18px;
}

.column-drag-handle {
    cursor: move;
    padding: 5px;
}

.card-ghost {
    transition: transform 0.18s ease;
    transform: rotateZ(5deg)
}

.card-ghost-drop {
    transition: transform 0.18s ease-in-out;
    transform: rotateZ(0deg)
}

.opacity-ghost {
    transition: all .18s ease;
    opacity: 0.8;
    background-color: cornflowerblue;
    box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
}

.opacity-ghost-drop {
    opacity: 1;
    background-color: white;
    box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.0);
}


.form-docs {
    display: flex
}

.form {
    flex: 3;
    border: 1px solid rgba(0, 0, 0, .125);
    border-radius: 6px;
}

.form-fields-panel {
    flex: 1;
    margin-right: 50px;
}


.form-ghost {
    transition: 0.18s ease;
    box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.08);
}

.form-ghost-drop {
    box-shadow: 0 0 2px 5px rgba(0, 0, 0, 0.0);
}

.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px;
}

.cards-drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px 45px 5px 5px;
}

.form-field {
    height: 50px;
    width: 250px;
    line-height: 30px;
    vertical-align: middle;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #eee;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #ddd;
    cursor: move;

}

.form-line {
    border: 1px solid #bcdae8ff;
    padding: 20px 30px;
    background-color: #f8f9fa;
    border-radius: 6px;
    transition: all .3s ease;
    transition-property: border-color, background-color;
    cursor: move;
}

.form-line.selected {
    background-color: #f8f9fa;
}

</style>