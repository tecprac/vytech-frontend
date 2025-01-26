<script setup lang="ts">
import { ref, watch, toRef } from "vue";

interface Props {
    totalPages: number;
    currentPage: number;
}

interface Emits {
    (e: 'pageChanged', page: number): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const currentPage = toRef(props, 'currentPage');
const totalPages  = toRef(props, 'totalPages');

const totalPageNumbers = ref<number[]>([]);
const PageNumbers = ref<number[]>([]);

watch( totalPages, () => {
    totalPageNumbers.value = [...new Array(totalPages.value)].map( ( v , i ) => i + 1);
}, {immediate: true});

watch(currentPage, () => {
    const interno = currentPage.value
    const numeroelmentos = totalPages.value - currentPage.value > 5 ? 5 :  (totalPages.value - currentPage.value) + 1;
    PageNumbers.value = [...new Array(numeroelmentos)].map( (v,i) => {
        return interno + i;
    });
    window.scroll({top: 0, behavior: 'smooth'});
},{immediate: true});

</script>

<template>
    <div class="card-footer text-center py-5">
        <button v-show="totalPages > 5" type="button" class="btn btn-sm btn-light-primary me-2" 
            :class="{disabled: currentPage === 1 }"
            @click="emits('pageChanged', 1)">
            &lt;&lt;
        </button>

        <button type="button" class="btn btn-sm btn-light-primary me-2" 
            :class="{disabled: currentPage === 1 }"
            @click="emits('pageChanged',currentPage - 1)">
            &lt;
        </button>

        <button v-show="totalPages <= 5" type="button" class="btn btn-sm btn-light-primary me-1" 
            v-for="number of totalPageNumbers"
            :key="number"
            :class="{active: currentPage == number}"
            @click="emits('pageChanged',number)" 
            >
            {{ number }}
        </button>

        <button v-show="totalPages > 5" type="button" class="btn btn-sm btn-light-primary me-1" 
            v-for="number of PageNumbers"
            :key="number"
            :class="{active: currentPage == number}"
            @click="emits('pageChanged',number)" 
            >
            {{ number }}
        </button>

        <button v-show="totalPages > 5 && currentPage < totalPages" type="button" class="btn btn-sm btn-light-primary me-2" disabled
            >
            ...
        </button>

        <button type="button" class="btn btn-sm btn-light-primary me-2" 
            :class="{disabled: currentPage === totalPages}"
            @click="emits('pageChanged',currentPage + 1)">
            &gt;
        </button>

        <button v-show="totalPages > 5" type="button" class="btn btn-sm btn-light-primary me-2" 
            :class="{disabled: currentPage === totalPages}"
            @click="emits('pageChanged', totalPages)">
            &gt;&gt;
        </button>
    </div>
</template>

<style scoped>
div {
    margin-top: 10px;
}

button:disabled {
    cursor: not-allowed;
}
</style>