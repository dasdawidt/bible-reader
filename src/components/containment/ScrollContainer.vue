<script setup lang="ts">
import ScrollPanel from 'primevue/scrollpanel';
</script>

<template>
    <ScrollPanel
        :pt="{
            content: { class: 'box-border' },
            barY: {
                class: 'transition-opacity bg-slate-500 opacity-20 w-2 hover:opacity-50 active:opacity-50 cursor-default',
            },
        }"
    >
        <slot />
    </ScrollPanel>
</template>
