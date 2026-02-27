<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { computed } from 'vue';
import { Verse } from '@/types/bible/verse';

const props = defineProps<{
    verse: Verse;
}>();

const isHighlighted = defineModel<boolean>('isHighlighted')

const borderColor = computed(() => (isHighlighted.value ? 'var(--primary-color)' : ''));
const color = computed(() => (isHighlighted.value ? 'var(--highlight-text-color)' : ''));
const backgroundColor = computed(() => (isHighlighted.value ? 'var(--highlight-bg)' : ''));
</script>

<template>
    <div class="flex flex-row flex-nowrap items-baseline gap-1.5">
        <div class="opacity-50 text-sm flex-shrink-0">
            <Avatar class="bg-transparent text-sm transition-colors" :label="verse.number?.toString()"
                :style="{ backgroundColor, color }" shape="circle" />
        </div>
        <div class="text-lg text-justify leading-loose px-2 border-0 border-l-2 border-solid border-transparent transition-colors"
            :style="{ borderColor }">
            <span class="py-0.5 rounded transition-colors" :style="{ backgroundColor, color }"
                @click="isHighlighted = !isHighlighted">
                {{ verse.text }}
            </span>
        </div>
        <span class="opacity-50 text-sm w-8 flex-shrink-0"></span>
    </div>
</template>
