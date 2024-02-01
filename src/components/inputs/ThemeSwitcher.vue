<script setup lang="ts">
import { useOnMobile } from '@/logic/util/MobileDetection';
import { useSettings } from '@/plugins/SettingsPlugin';
import { ColorSchemeType } from '@vueuse/core';
import SelectButton from 'primevue/selectbutton';
import { computed } from 'vue';

defineProps<{
    condensed?: boolean;
}>();

const { isOnMobile } = useOnMobile();
const { settings } = useSettings();
const options: {
    messageCode: string,
    value: ColorSchemeType,
    icon: string,
}[] = [
        {
            messageCode: 'prompts.light_theme',
            value: 'light',
            icon: 'mdi-white-balance-sunny',
        },
        {
            messageCode: 'prompts.device_theme',
            value: 'no-preference',
            icon: isOnMobile.value ? 'mdi-cellphone' : 'mdi-laptop',
        },
        {
            messageCode: 'prompts.dark_theme',
            value: 'dark',
            icon: 'mdi-brightness-2',
        }
    ];

</script>

<template>
    <SelectButton class="flex w-full flex-row" v-model="settings.theme" :options="options" :option-value="o => o.value"
        :allow-empty="false" :pt="{ button: { class: 'w-full' } }">
        <template #option="slotProps">
            <div class="flex flex-row justify-center flex-nowrap w-full gap-3">
                <i class="mdi" :class="slotProps.option.icon" />
                <span v-if="condensed != true" class="text-ellipsis overflow-hidden">
                    {{ $t(slotProps.option.messageCode) }}
                </span>
            </div>
        </template>
    </SelectButton>
</template>