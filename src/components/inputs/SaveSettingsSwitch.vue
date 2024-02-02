<script setup lang="ts">
import { useSettings } from '@/plugins/SettingsPlugin';
import SelectButton from 'primevue/selectbutton';

defineProps<{
    condensed?: boolean;
}>();

const { persistenceEnabled } = useSettings();
const options: {
    messageCode: string,
    value: boolean,
    icon: string,
}[] = [
        {
            messageCode: 'prompts.persistence_enabled',
            value: true,
            icon: 'mdi-cookie',
        },
        {
            messageCode: 'prompts.persistence_disabled',
            value: false,
            icon: 'mdi-cookie-off',
        }
    ];
</script>

<template>
    <SelectButton class="flex w-full flex-row" v-model="persistenceEnabled" :options="options" :option-value="o => o.value"
        :allow-empty="false" :pt="{ button: { class: 'w-full' } }">
        <template #option="slotProps">
            <div class="flex flex-row justify-center items-center flex-nowrap w-full gap-3">
                <i class="mdi scale-125 opacity-75" :class="slotProps.option.icon" />
                <span v-if="condensed != true" class="text-ellipsis overflow-hidden">
                    {{ $t(slotProps.option.messageCode) }}
                </span>
            </div>
        </template>
    </SelectButton>
</template>