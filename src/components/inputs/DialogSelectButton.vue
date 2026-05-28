<script setup lang="ts">
import { mdiChevronRight } from '@mdi/js';
import Dropdown, { type DropdownProps } from 'primevue/dropdown';
import SvgIcon from '@/components/icons/MdiIcon.vue';

export interface Props extends DropdownProps {}

const props = defineProps<Props & { disabled?: boolean }>();
</script>

<template>
    <Dropdown
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
    </Dropdown>
</template>
