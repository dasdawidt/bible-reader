<script setup lang="ts">
import Snackbar from '@/components/Snackbar.vue';
// import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
</script>

<template>
    <!-- <ThemeSwitcher /> -->
    <Snackbar />
    <main class="max-w-container m-auto">
        <RouterView />
    </main>
</template>
