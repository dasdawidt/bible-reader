<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { Verse } from '@/types/bible/verse';
import { computed } from 'vue';

const props = defineProps<{
    verse: Verse,
    isHighlighted?: boolean
}>();

const emit = defineEmits<{
    (event: 'update:isHighlighted', value: boolean): void,
}>();

const highligted = computed({
    get: () => props.isHighlighted,
    set: v => emit('update:isHighlighted', v),
});

const highlightedStyle = {
    backgroundColor: 'var(--highlight-bg)',
    color: 'var(--highlight-text-color)'
};
</script>

<template>
    <div class="flex flex-row flex-nowrap items-baseline gap-1.5" @click="highligted = !highligted">
        <div class="opacity-50 text-sm flex-shrink-0">
            <Avatar class="bg-transparent text-sm" :label="(verse.number?.toString())"
                :style="highligted ? highlightedStyle : undefined" shape="circle" />
        </div>
        <div class="text-lg text-justify leading-loose">
            <span class="py-0.5 rounded" :style="highligted ? highlightedStyle : undefined">
                {{ verse.text }}
            </span>
        </div>
        <span class="opacity-50 text-sm w-8 flex-shrink-0"></span>
    </div>
</template>