<script setup lang="ts">
import SelectButton from 'primevue/selectbutton';
import { useI18n } from 'vue-i18n';

defineProps<{
    condensed?: boolean;
}>();

const { locale, availableLocales } = useI18n();

</script>

<template>
    <SelectButton class="flex w-full flex-row" v-model="locale" :options="availableLocales"
        :pt="{ button: { class: 'w-full' } }">
        <template #option="slotProps">
            <div class="flex flex-row justify-center flex-nowrap w-full gap-3">
                <span class="uppercase opacity-50">{{ slotProps.option }}</span>
                <span v-if="condensed != true" class="text-ellipsis overflow-hidden">
                    <span>{{ $t(`locales.${slotProps.option}`) }}</span>
                </span>
            </div>
        </template>
    </SelectButton>
</template>