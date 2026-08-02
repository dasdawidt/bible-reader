<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { computed } from 'vue';
import type { Verse } from '@/types/bible/verse';

defineProps<{
    verse: Verse;
}>();

const isHighlighted = defineModel<boolean>('isHighlighted', { default: false });

const borderColor = computed(() => (isHighlighted.value ? 'var(--primary-color)' : ''));
const color = computed(() => (isHighlighted.value ? 'var(--highlight-text-color)' : ''));
const backgroundColor = computed(() => (isHighlighted.value ? 'var(--highlight-bg)' : ''));

function toggleHighlight() {
    isHighlighted.value = !isHighlighted.value;
}
</script>

<template>
    <div class="flex flex-row flex-nowrap items-baseline gap-1.5">
        <div class="opacity-50 text-sm shrink-0">
            <Avatar
                class="bg-transparent text-sm transition-colors"
                :label="verse.number?.toString()"
                :style="{ backgroundColor, color }"
                shape="circle"
            />
        </div>
        <div
            class="text-lg text-justify leading-loose hyphens-auto px-2 border-0 border-l-2 border-solid border-transparent transition-colors"
            :style="{ borderColor }"
        >
            <!-- biome-ignore lint/a11y/useSemanticElements: button is styled and resetting the style is too complex -->
            <span
                role="button"
                tabindex="0"
                class="py-0.5 rounded-sm transition-colors"
                :style="{ backgroundColor, color }"
                @click="toggleHighlight()"
                @keydown.enter="toggleHighlight()"
            >
                {{ verse.text }}
            </span>
        </div>
        <span class="opacity-50 text-sm w-8 shrink-0"></span>
    </div>
</template>
