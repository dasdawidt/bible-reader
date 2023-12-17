<script setup lang="ts">
import Snackbar from '@/components/Snackbar.vue';
import ScrollPanel from 'primevue/scrollpanel';
</script>

<template>
    <Snackbar />
    <ScrollPanel class="w-full h-screen"
        :pt="{ barY: { class: 'transition-opacity bg-slate-500 opacity-20 w-2 hover:opacity-50' } }">
        <main class="max-w-container m-auto">
            <RouterView />
        </main>
    </ScrollPanel>
</template>
