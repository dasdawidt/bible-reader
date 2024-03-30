<script setup lang="ts">
import Dropdown, { DropdownProps } from 'primevue/dropdown';
import { mdiChevronRight } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';

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
        dropdown-icon="mdi mdi-chevron-right text-xl"
        empty-message=" "
        :pt="{ panel: { class: 'hidden' } }"
    >
        <template #dropdownicon>
            <SvgIcon type="mdi" :path="mdiChevronRight" />
        </template>
        <template #value>
            <div class="w-full flex flex-row justify-start alignt-center">
                <slot></slot>
            </div>
        </template>
    </Dropdown>
</template>
