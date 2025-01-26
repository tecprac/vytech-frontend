<script setup lang="ts">
import RolList from '../components/RolList.vue';
import useRoles from '../composables/useRoles';
import LoadingModal from "@/shared/components/LoadingModal.vue";
import PaginationNumbers from '@/shared/components/PaginationNumbers.vue';

const { isPending, registros,currentBuscar,currentPage, totalPages, getPage, getBuscar } = useRoles();
    
</script>

<template> 
    <div>
        <h1 class="mt-2 ms-2">Listado de Roles</h1>
        
        <RolList 
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