<script setup lang="ts">
import List from '../components/TipoInventarioList.vue';
import useTiposInventario from '../composables/useTiposInventario';
import LoadingModal from "@/shared/components/LoadingModal.vue";
import PaginationNumbers from '@/shared/components/PaginationNumbers.vue';

const { isPending, registros,currentBuscar,currentPage, totalPages, getPage, getBuscar } = useTiposInventario();
    
</script>

<template> 
    <div>
        <h1 class="mt-2 ms-2">Listado de Tipos de Inventario</h1>
        <List 
            :registros="registros" 
            :currentBuscar="currentBuscar"
            @buscar-Changed="getBuscar"
        />
        <PaginationNumbers  
            :current-page="currentPage" 
            :total-pages="totalPages"
            @page-changed="getPage"
        />
        <LoadingModal v-if="isPending" />

    </div>

</template>

<style scoped>

</style>