<script setup lang="ts">
import Button, { ButtonProps } from 'primevue/button';

// The @vue-ignore is needed because vue is not able to resolve the base type at the moment.
export interface Props extends /* @vue-ignore */ ButtonProps { };

const props = defineProps<Props & { disabled?: boolean }>();

</script>

<template>
    <Button v-bind="props" class="w-full p-inputtext cursor-pointer" :class="{ 'p-disabled': props.disabled }" unstyled>
        <div class="w-full flex flex-row justify-start alignt-center">
            <slot></slot>
            <div class="flex-grow" />
            <i class="mdi mdi-chevron-right leading-none text-xl opacity-75" />
        </div>
    </Button>
</template>