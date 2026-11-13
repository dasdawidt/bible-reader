<script setup lang="ts">
import SelectButton from 'openvue/selectbutton';
import { useI18n } from 'vue-i18n';
import { useSettings } from '@/plugins/SettingsPlugin';

defineProps<{
    condensed?: boolean;
}>();

const { t, availableLocales } = useI18n();
const { settings } = useSettings();
</script>

<template>
    <SelectButton
        class="flex w-full flex-row justify-stretch *:grow"
        v-model="settings.language"
        :options="availableLocales"
        :allow-empty="false"
    >
        <template #option="slotProps">
            <div class="flex flex-row justify-center flex-nowrap w-full gap-3">
                <span class="uppercase opacity-75 font-semibold"> {{ slotProps.option }} </span>
                <span v-if="condensed !== true" class="text-ellipsis overflow-hidden">
                    <span>{{ t(`locales.${slotProps.option}`) }}</span>
                </span>
            </div>
        </template>
    </SelectButton>
</template>
