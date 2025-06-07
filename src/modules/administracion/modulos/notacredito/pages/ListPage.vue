<script setup lang="ts">
import List from '../components/NotaCreditoList.vue';
import useNotasCredito from '../composables/useNotasCredito';
import LoadingModal from "@/shared/components/LoadingModal.vue";
import PaginationNumbers from '@/shared/components/PaginationNumbers.vue';

const { isPending, registros,currentBuscar,currentPage, totalPages, getPage, getBuscar } = useNotasCredito();
    
</script>

<template> 
    <div>
        <h1 class="mt-2 ms-2">Listado de Notas de Crédito</h1>
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