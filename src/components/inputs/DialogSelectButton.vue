<script setup lang="ts">
import { mdiChevronRight } from '@mdi/js';
import Select, { type SelectProps } from 'openvue/select';
import SvgIcon from '@/components/icons/MdiIcon.vue';

export interface Props extends SelectProps {}

const props = defineProps<Props & { disabled?: boolean }>();
</script>

<template>
    <Select
        v-bind="props"
        readonly
        class="w-full"
        :class="{ 'p-disabled': props.disabled }"
        empty-message=" "
        :pt="{ panel: { class: 'hidden' } }"
    >
        <template #dropdownicon>
            <SvgIcon :icon="mdiChevronRight" />
        </template>
        <template #value>
            <div class="w-full flex flex-row justify-start alignt-center">
                <slot />
            </div>
        </template>
    </Select>
</template>
