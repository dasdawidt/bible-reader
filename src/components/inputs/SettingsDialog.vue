<script setup lang="ts">
import { mdiCog } from '@mdi/js';
import { useWindowSize } from '@vueuse/core';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MdiIcon from '@/components/icons/MdiIcon.vue';
import ThemeSwitcher from '@/components/inputs/ThemeSwitcher.vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import LocaleSwitcher from './LocaleSwitcher.vue';
import SaveSettingsSwitch from './SaveSettingsSwitch.vue';

const props = defineProps<{
    showLabel?: boolean;
}>();

const visible = ref(false);
const { isOnMobile } = useOnMobile();
const { width: screenWidth } = useWindowSize();
const { t } = useI18n();

// biome-ignore lint/correctness/noUnusedVariables: Is used in template via shorthand.
const label = computed(() => (props.showLabel ? 'Settings' : undefined));
const condensed = computed(() => screenWidth.value < 400);
const buildDate = import.meta.env.BUILD_DATE;
</script>

<template>
    <Button severity="secondary" @click="visible = true" v-bind="$attrs" :label rounded text>
        <template #icon>
            <MdiIcon class="size-5.75!" :icon="mdiCog" />
        </template>
    </Button>
    <Dialog
        class="w-full max-w-container"
        v-model:visible="visible"
        :closable="false"
        :draggable="false"
        modal
        :header="t('prompts.settings')"
        :position="isOnMobile ? 'bottom' : 'top'"
        dismissable-mask
        :pt="{ content: { class: 'pb-0 pt-2' } }"
    >
        <template #default>
            <div class="flex flex-col gap-4">
                <SaveSettingsSwitch :condensed="condensed" />
                <ThemeSwitcher :condensed="condensed" />
                <LocaleSwitcher :condensed="condensed" />
            </div>
            <div class="w-full text-center text-sm uppercase opacity-5 p-4">Build {{ buildDate }}</div>
        </template>
        <template #footer>
            <Button :label="t('prompts.close')" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
