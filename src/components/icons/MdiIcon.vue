<script setup lang="ts">
defineProps<{
    icon?: string;
}>();
</script>

<template>
    <svg class="shrink-0 size-6.75" viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="icon" :d="icon" class="fill-current" />
    </svg>
</template>
