<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCookie, mdiCookieOff } from '@mdi/js';
import SelectButton from 'primevue/selectbutton';
import { useSettings } from '@/plugins/SettingsPlugin';

defineProps<{
    condensed?: boolean;
}>();

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
        class="flex w-full flex-row"
        v-model="persistenceEnabled"
        :options="options"
        :option-value="(o) => o.value"
        :allow-empty="false"
        :pt="{ button: { class: 'w-full' } }"
    >
        <template #option="slotProps">
            <div
                class="flex flex-row justify-center items-center flex-nowrap w-full gap-3"
            >
                <SvgIcon
                    class="!scale-[1.35] opacity-75"
                    type="mdi"
                    size="16"
                    :path="slotProps.option.icon"
                />
                <span
                    v-if="condensed != true"
                    class="text-ellipsis overflow-hidden"
                >
                    {{ $t(slotProps.option.messageCode) }}
                </span>
            </div>
        </template>
    </SelectButton>
</template>
