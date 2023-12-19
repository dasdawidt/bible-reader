<script setup lang="ts">
import { Verse } from '@/types/bible/verse';

const props = defineProps<{
    verse: Verse,
    isHighlighted: boolean
}>();

const highlightedStyle = {
    backgroundColor: 'var(--highlight-bg)',
    color: 'var(--highlight-text-color)'
};
</script>

<template>
    <span class="opacity-50 text-sm w-8 flex-shrink-0">
        {{ verse.number }}
    </span>
    <div class="text-lg text-justify">
        <span :style="isHighlighted ? highlightedStyle : undefined">
            {{ verse.text }}
        </span>
    </div>
    <span class="opacity-50 text-sm w-8 flex-shrink-0"></span>
</template>