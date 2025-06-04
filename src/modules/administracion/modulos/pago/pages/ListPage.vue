<script setup lang="ts">
import List from '../components/PagoList.vue';
import usePagos from '../composables/usePagos';
import LoadingModal from "@/shared/components/LoadingModal.vue";
import PaginationNumbers from '@/shared/components/PaginationNumbers.vue';

const { isPending, registros,currentBuscar,currentPage, totalPages, getPage, getBuscar } = usePagos();
    
</script>

<template> 
    <div>
        <h1 class="mt-2 ms-2">Listado de Pagos</h1>
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