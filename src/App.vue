<script setup lang="ts">
import ScrollContainer from '@/components/containment/ScrollContainer.vue';
import Snackbar from '@/components/containment/Snackbar.vue';
</script>

<template>
    <Snackbar />
    <ScrollContainer class="w-full h-screen print:contents">
        <main class="max-w-container m-auto">
            <RouterView />
        </main>
    </ScrollContainer>
</template>
