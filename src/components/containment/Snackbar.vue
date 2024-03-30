<script setup lang="ts">
import Toast, { ToastPassThroughOptions } from 'primevue/toast';

const passThrough: ToastPassThroughOptions = {
    root: {
        style: {
            right: '0',
            bottom: '0',
            padding: '20px',
            width: '100%',
            maxWidth: '400px',
            pointerEvents: 'none',
        },
    },
    container: {
        style: {
            pointerEvents: 'auto',
        },
    },
};
</script>

<template>
    <Toast position="bottom-right" :pt="passThrough" />
</template>
