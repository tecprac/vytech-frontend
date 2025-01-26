<script setup lang="ts">
import List from '../components/TipoUnidadList.vue';
import useTiposUnidad from '../composables/useTiposUnidad';
import LoadingModal from "@/shared/components/LoadingModal.vue";
import PaginationNumbers from '@/shared/components/PaginationNumbers.vue';

const { isPending, registros,currentBuscar,currentPage, totalPages, getPage, getBuscar } = useTiposUnidad();
    
</script>

<template> 
    <div>
        <h1 class="mt-2 ms-2">Listado de Tipos de Unidad</h1>
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