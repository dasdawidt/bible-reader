<script setup lang="ts">
import ThemeSwitcher from '@/components/inputs/ThemeSwitcher.vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import { useWindowSize } from '@vueuse/core';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { computed, ref } from 'vue';
import LocaleSwitcher from './LocaleSwitcher.vue';
import SaveSettingsSwitch from './SaveSettingsSwitch.vue';

const visible = ref(false);
const { isOnMobile } = useOnMobile();
const { width: screenWidth } = useWindowSize();
const props = defineProps<{
    showLabel?: boolean;
}>();

const label = computed(() => props.showLabel ? 'Settings' : null);
const condensed = computed(() => screenWidth.value < 400);

</script>

<template>
    <Button icon="mdi-cog" icon-class="mdi scale-[1.2]" severity="secondary" @click="visible = true" v-bind="$attrs"
        :label="label" text />
    <Dialog v-model:visible="visible" :closable="false" :draggable="false" modal :header="$t('prompts.settings')"
        :position="isOnMobile ? 'bottom' : 'top'" dismissable-mask class="w-full max-w-container">
        <template #default>
            <div class="flex flex-col gap-4 pt-1">
                <SaveSettingsSwitch :condensed="condensed" />
                <ThemeSwitcher :condensed="condensed" />
                <LocaleSwitcher :condensed="condensed" />
            </div>
        </template>
        <template #footer>
            <Button :label="$t('prompts.close')" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>