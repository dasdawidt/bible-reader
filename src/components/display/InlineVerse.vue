<script setup lang="ts">
import Avatar from 'openvue/avatar';
import type { Verse } from '@/types/bible/verse';

defineProps<{
    verse: Verse;
}>();

const isHighlighted = defineModel<boolean>('isHighlighted', { default: false });

function toggleHighlight() {
    isHighlighted.value = !isHighlighted.value;
}
</script>

<template>
    <div class="flex flex-row flex-nowrap items-baseline gap-1.5">
        <div class="opacity-50 text-sm shrink-0">
            <Avatar
                class="bg-transparent text-sm transition-colors"
                :class="{ 'bg-highlight text-primary': isHighlighted }"
                :label="verse.number?.toString()"
                shape="circle"
            />
        </div>
        <div
            class="text-lg text-justify leading-loose hyphens-auto px-2 border-0 border-l-2 border-solid transition-colors"
            :class="isHighlighted ? 'border-primary': 'border-transparent'"
        >
            <!-- biome-ignore lint/a11y/useSemanticElements: button is styled and resetting the style is too complex -->
            <span
                role="button"
                tabindex="0"
                class="py-0.5 rounded-sm transition-colors"
                :class="{ 'bg-primary/10 text-primary-emphasis': isHighlighted }"
                @click="toggleHighlight()"
                @keydown.enter="toggleHighlight()"
            >
                {{ verse.text }}
            </span>
        </div>
        <span class="opacity-50 text-sm w-8 shrink-0"></span>
    </div>
</template>
