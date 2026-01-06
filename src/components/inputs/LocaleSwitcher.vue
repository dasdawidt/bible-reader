<script setup lang="ts">
import SelectButton from 'primevue/selectbutton';
import { useI18n } from 'vue-i18n';
import { useSettings } from '@/plugins/SettingsPlugin';

defineProps<{
    condensed?: boolean;
}>();

const { availableLocales } = useI18n();
const { settings } = useSettings();
</script>

<template>
    <SelectButton
        class="flex w-full flex-row"
        v-model="settings.language"
        :options="availableLocales"
        :allow-empty="false"
        :pt="{ button: { class: 'w-full' } }"
    >
        <template #option="slotProps">
            <div class="flex flex-row justify-center flex-nowrap w-full gap-3">
                <span class="uppercase opacity-75 font-semibold">{{
                    slotProps.option
                }}</span>
                <span
                    v-if="condensed != true"
                    class="text-ellipsis overflow-hidden"
                >
                    <span>{{ $t(`locales.${slotProps.option}`) }}</span>
                </span>
            </div>
        </template>
    </SelectButton>
</template>
