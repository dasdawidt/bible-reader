<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import Button from 'primevue/button';
import { computed } from 'vue';

const {
    isSupported,
    isFullscreen,
    toggle
} = useFullscreen();

const fullscreenIcon = computed(() => isFullscreen.value ? 'mdi-fullscreen-exit' : 'mdi-fullscreen');

</script>

<template>
    <Button icon-class="mdi scale-[1.6]" severity="secondary" :icon="fullscreenIcon" :disabled="!isSupported"
        @click="toggle" v-bind="$attrs" text />
</template>