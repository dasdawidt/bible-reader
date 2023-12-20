<script setup lang="ts">
import SelectButton from 'primevue/selectbutton';
import { useTheme } from '@/plugins/ThemePlugin';
import { ColorSchemeType } from '@vueuse/core';
import { useOnMobile } from '@/logic/util/MobileDetection';

const props = defineProps<{
    condensed?: boolean;
}>();

const { isOnMobile } = useOnMobile();
const colorScheme = useTheme();
const options: {
    label: string,
    value: ColorSchemeType,
    icon: string,
}[] = [
        {
            label: 'Light',
            value: 'light',
            icon: 'mdi-white-balance-sunny',
        },
        {
            label: 'System',
            value: 'no-preference',
            icon: isOnMobile.value ? 'mdi-cellphone' : 'mdi-laptop',
        },
        {
            label: 'Dark',
            value: 'dark',
            icon: 'mdi-brightness-2',
        }
    ];

</script>

<template>
    <SelectButton class="flex w-full flex-row" v-model="colorScheme" :options="options" :option-value="o => o.value"
        :pt="{ button: { class: 'w-full' } }">
        <template #option="slotProps">
            <div class="flex flex-row justify-center flex-nowrap w-full gap-3">
                <i class="mdi" :class="slotProps.option.icon" />
                <span v-if="condensed != true" class="text-ellipsis overflow-hidden">{{ slotProps.option.label }}</span>
            </div>
        </template>
    </SelectButton>
</template>