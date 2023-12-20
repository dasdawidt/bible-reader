<script setup lang="ts">
import Snackbar from '@/components/Snackbar.vue';
import ScrollContainer from '@/components/containment/ScrollContainer.vue';
</script>

<template>
    <Snackbar />
    <ScrollContainer class="w-full h-screen print:contents">
        <main class="max-w-container m-auto">
            <RouterView />
        </main>
    </ScrollContainer>
</template>
