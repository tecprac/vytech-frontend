<template>
    <InputText 
        :value="modelValue" 
        :size="size"
        @input="$emit('update:modelValue',($event.target as HTMLInputElement)?.value ?? '')"
        @blur="$emit('blur')"
        :class="{ 'p-invalid' : error}" aria-describedby="usuario-help"
        :pt="{root: { class: 'col-sm-2'}}">
    </InputText>
    <small id="usuario-help" class="p-error ms-2 text-danger">
        {{  error  }}
    </small>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';

interface Props {
    modelValue?:    string | number;
    error?:         string;
    type:           'text' | 'number';
    size:           'small' | 'large' | null | undefined ;
}

withDefaults( defineProps<Props>(), {
    type: 'text',
    size: null
});

defineEmits(['update:modelValue','blur']);

</script>
