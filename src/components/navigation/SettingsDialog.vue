<script setup lang="ts">
import { useOnMobile } from '@/logic/util/MobileDetection';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { ref } from 'vue';
import ThemeSwitcher from '../ThemeSwitcher.vue';
const visible = ref(false);
const { isOnMobile } = useOnMobile();
</script>

<template>
    <Button class="w-full" label="Settings" severity="secondary" text @click="visible = true" />
    <Dialog v-model:visible="visible" :closable="false" :draggable="false" modal header="Settings"
        :position="isOnMobile ? 'bottom' : 'top'" dismissableMask class="w-full max-w-container">
        <template #default>
            <div class="flex flex-col gap-2 pt-1">
                <ThemeSwitcher />
            </div>
        </template>
        <template #footer>
            <Button label="Close" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>