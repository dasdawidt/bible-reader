<script setup lang="ts">
import { mdiChevronRight } from '@mdi/js';
import Dropdown, { type DropdownProps } from 'primevue/dropdown';
import SvgIcon from '@/components/icons/MdiIcon.vue';

// The @vue-ignore is needed because vue is not able to resolve the base type at the moment.
export interface Props extends /* @vue-ignore */ DropdownProps {}

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
