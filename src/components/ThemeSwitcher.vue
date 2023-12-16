<script setup lang="ts">
import SelectButton from 'primevue/selectbutton';
import { useTheme } from '@/plugins/ThemePlugin';
import { ColorSchemeType } from '@vueuse/core';

const colorScheme = useTheme();
const options: {
    label: string,
    value: ColorSchemeType
}[] = [
        {
            label: 'Light',
            value: 'light',
        },
        {
            label: 'System',
            value: 'no-preference',
        },
        {
            label: 'Dark',
            value: 'dark',
        }
    ];

</script>

<template>
    <SelectButton v-model="colorScheme" :options="options" :option-value="o => o.value" :option-label="o => o.label" />
</template>