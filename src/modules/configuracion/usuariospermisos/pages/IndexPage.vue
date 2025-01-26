<script setup lang="ts">
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import usePermisosUsuarios from '../composables/usePermisosUsuarios';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Tree from 'primevue/tree';
import Toast from 'primevue/toast';

const {
    isPending,
    selectusuario,
    usuariosfiltrados,
    nodes_configuracion,
    nodes_taller,
    nodes_almacen,
    nodes_administracion,
    key_configuracion,
    key_taller,
    key_almacen,
    key_administracion,
    expandkey_configuracion,
    expandkey_taller,
    expandkey_almacen,
    expandkey_administracion,
    loadingConf,
    loadingTalle,
    loadingAlma,
    loadingAdm,

    buscarUsuarios,
    ObtenerRelUsuario,
    onNodeSelectConf,
    expandConf,
    onNodeSelectTalle,
    expandTalle,
    onNodeSelectAlma,
    expandAlma,
    onNodeSelectAdm,
    expandAdm,
} = usePermisosUsuarios();

</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-6">
        <div class="card-title">
            <strong>Administración de Permisos a Modulos por Usuario</strong>
        </div>
    </div>
    <div class="card-body border-0 pt-0 pb-0">
        <div class="row mb-5">
            <label for="usuario" class="col-sm-1 col-form-label">Usuario</label>
            <div class="col-sm-11">
                <AutoComplete
                    v-model="selectusuario"
                    :suggestions="usuariosfiltrados"
                    @complete="buscarUsuarios"
                    :option-label="(data) => { return data.id > 0 ? data.usuario+' | '+data.nombre : ''; }"
                    empty-search-message="No existen usuario que coincidan con la busqueda"
                    empty-selection-message="No se ha seleccionado un usuario"
                    placeholder="Capture un nombre de usuario"
                    @item-select="ObtenerRelUsuario(selectusuario.id)"
                    fluid
                >
                </AutoComplete>  
            </div>
        </div>
        <div class="row mb-6">
            <div class="col-sm-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-opacity-20 bg-primary mb-0" style="min-height: 40px;">
                        <h3 class="card-title">CONFIGURACIÓN</h3>
                    </div>
                    <div class="card-body p-3">
                        <template v-if="selectusuario.id > 0">
                            <div class="row mb-2">
                                <div class="col-sm-12">
                                    <Button type="button" 
                                        icon="pi pi-plus" 
                                        label="Expandir" @click="expandConf" 
                                        size="small"
                                        class="cols-sm-6 me-2" />
                                    <Button type="button" 
                                        icon="pi pi-minus" 
                                        label="Contraer" @click="() => { expandkey_configuracion = {} }" 
                                        size="small"
                                        class="cols-sm-6"/>
                                </div>
                            </div>
                            <Tree
                                v-model:selection-keys="key_configuracion"
                                v-model:expanded-keys="expandkey_configuracion"
                                :loading="loadingConf"
                                :filter="true"
                                filter-mode="lenient"
                                :value="nodes_configuracion"
                                selection-mode="checkbox"
                                class="w-full p-0"
                                @node-select="onNodeSelectConf"
                                @node-unselect="onNodeSelectConf"
                            >
                                <template #TITULO="slotProps">
                                    <b>{{ slotProps.node.label  }}</b>
                                </template>
                            </Tree>
                        </template>
                        
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-opacity-20 bg-primary mb-0" style="min-height: 40px;">
                        <h3 class="card-title">ALMACÉN</h3>
                    </div>
                    <div class="card-body p-3">
                        <template v-if="selectusuario.id > 0">
                            <div class="row mb-2">
                                <div class="col-sm-12">
                                    <Button type="button" 
                                        icon="pi pi-plus" 
                                        label="Expandir" @click="expandAlma" 
                                        size="small"
                                        class="cols-sm-6 me-2" />
                                    <Button type="button" 
                                        icon="pi pi-minus" 
                                        label="Contraer" @click="() => { expandkey_almacen = {} }" 
                                        size="small"
                                        class="cols-sm-6"/>
                                </div>
                            </div>
                            <Tree
                                v-model:selection-keys="key_almacen"
                                v-model:expanded-keys="expandkey_almacen"
                                :loading="loadingAlma"
                                :filter="true"
                                filter-mode="lenient"
                                :value="nodes_almacen"
                                selection-mode="checkbox"
                                class="w-full p-0"
                                @node-select="onNodeSelectAlma"
                                @node-unselect="onNodeSelectAlma"
                            >
                                <template #TITULO="slotProps">
                                    <b>{{ slotProps.node.label  }}</b>
                                </template>
                            </Tree>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-sm-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-opacity-20 bg-primary mb-0" style="min-height: 40px;">
                        <h3 class="card-title">TALLER</h3>
                    </div>
                    <div class="card-body p-3">
                        <template v-if="selectusuario.id > 0">
                            <div class="row mb-2">
                                <div class="col-sm-12">
                                    <Button type="button" 
                                        icon="pi pi-plus" 
                                        label="Expandir" @click="expandTalle" 
                                        size="small"
                                        class="cols-sm-6 me-2" />
                                    <Button type="button" 
                                        icon="pi pi-minus" 
                                        label="Contraer" @click="() => { expandkey_taller = {} }" 
                                        size="small"
                                        class="cols-sm-6"/>
                                </div>
                            </div>
                            <Tree
                                v-model:selection-keys="key_taller"
                                v-model:expanded-keys="expandkey_taller"
                                :loading="loadingTalle"
                                :filter="true"
                                filter-mode="lenient"
                                :value="nodes_taller"
                                selection-mode="checkbox"
                                class="w-full p-0"
                                @node-select="onNodeSelectTalle"
                                @node-unselect="onNodeSelectTalle"
                            >
                                <template #TITULO="slotProps">
                                    <b>{{ slotProps.node.label  }}</b>
                                </template>
                            </Tree>
                        </template>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-opacity-20 bg-primary mb-0" style="min-height: 40px;">
                        <h3 class="card-title">ADMINISTRACIÓN</h3>
                    </div>
                    <div class="card-body p-3">
                        <template v-if="selectusuario.id > 0">
                            <div class="row mb-2">
                                <div class="col-sm-12">
                                    <Button type="button" 
                                        icon="pi pi-plus" 
                                        label="Expandir" @click="expandAdm" 
                                        size="small"
                                        class="cols-sm-6 me-2" />
                                    <Button type="button" 
                                        icon="pi pi-minus" 
                                        label="Contraer" @click="() => { expandkey_administracion = {} }" 
                                        size="small"
                                        class="cols-sm-6"/>
                                </div>
                            </div>
                            <Tree
                                v-model:selection-keys="key_administracion"
                                v-model:expanded-keys="expandkey_administracion"
                                :loading="loadingAdm"
                                :filter="true"
                                filter-mode="lenient"
                                :value="nodes_administracion"
                                selection-mode="checkbox"
                                class="w-full p-0"
                                @node-select="onNodeSelectAdm"
                                @node-unselect="onNodeSelectAdm"
                            >
                                <template #TITULO="slotProps">
                                    <b>{{ slotProps.node.label  }}</b>
                                </template>
                            </Tree>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast />
</template>