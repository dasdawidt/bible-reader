<script setup lang="ts">
import MdiIcon from './MdiIcon.vue';

defineProps<{
    icon?: string;
}>();
</script>

<template>
    <MdiIcon class="size-4! scale-150 opacity-75" :icon />
</template>
