<script setup lang="ts">
import { useOnMobile } from '@/logic/util/MobileDetection';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { computed, ref } from 'vue';
import ThemeSwitcher from '../ThemeSwitcher.vue';
import { useWindowSize } from '@vueuse/core';
const visible = ref(false);
const { isOnMobile } = useOnMobile();
const { width: screenWidth } = useWindowSize();
const props = defineProps<{
    showLabel?: boolean;
}>();

const label = computed(() => props.showLabel ? 'Settings' : null);
const condensedThemeSwitcher = computed(() => screenWidth.value < 400);

</script>

<template>
    <Button icon="mdi mdi-cog" severity="secondary" @click="visible = true" v-bind="$attrs" :label="label" text />
    <Dialog v-model:visible="visible" :closable="false" :draggable="false" modal header="Settings"
        :position="isOnMobile ? 'bottom' : 'top'" dismissableMask class="w-full max-w-container">
        <template #default>
            <div class="flex flex-col gap-2 pt-1">
                <ThemeSwitcher :condensed="condensedThemeSwitcher" />
            </div>
        </template>
        <template #footer>
            <Button label="Close" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>