<script setup lang="ts">
import ScrollContainer from '@/components/containment/ScrollContainer.vue';
import Snackbar from '@/components/containment/Snackbar.vue';
</script>

<template>
    <Snackbar class="print:hidden" />
    <ScrollContainer class="w-full h-dvh print:contents">
        <main class="max-w-container m-auto">
            <RouterView />
        </main>
    </ScrollContainer>
</template>
