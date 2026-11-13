<script setup lang="ts">
import { mdiCookie, mdiCookieOff } from '@mdi/js';
import SelectButton from 'openvue/selectbutton';
import { useI18n } from 'vue-i18n';
import { useSettings } from '@/plugins/SettingsPlugin';
import MdiIconInline from '../icons/MdiIconInline.vue';

defineProps<{
    condensed?: boolean;
}>();

const { t } = useI18n();
const { persistenceEnabled } = useSettings();
const options: {
    messageCode: string;
    value: boolean;
    icon: string;
}[] = [
    {
        messageCode: 'prompts.persistence_enabled',
        value: true,
        icon: mdiCookie,
    },
    {
        messageCode: 'prompts.persistence_disabled',
        value: false,
        icon: mdiCookieOff,
    },
];
</script>

<template>
    <SelectButton
        class="flex w-full flex-row justify-stretch *:grow"
        v-model="persistenceEnabled"
        :options="options"
        :option-value="(o) => o.value"
        :allow-empty="false"
    >
        <template #option="slotProps">
            <div class="flex flex-row justify-center items-center flex-nowrap w-full gap-3">
                <MdiIconInline :icon="slotProps.option.icon" />
                <span v-if="condensed !== true" class="text-ellipsis overflow-hidden">
                    {{ t(slotProps.option.messageCode) }}
                </span>
            </div>
        </template>
    </SelectButton>
</template>
