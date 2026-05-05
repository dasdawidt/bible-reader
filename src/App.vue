<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ScrollContainer from '@/components/containment/ScrollContainer.vue';
import Snackbar from '@/components/containment/Snackbar.vue';

const { locale } = useI18n();
</script>

<template>
    <Snackbar class="print:hidden" :lang="locale" />
    <ScrollContainer class="w-full h-dvh print:contents">
        <main class="max-w-container m-auto" :lang="locale">
            <RouterView />
        </main>
    </ScrollContainer>
</template>
