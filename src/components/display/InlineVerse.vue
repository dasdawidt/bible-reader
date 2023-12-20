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

const highlighted = computed({
    get: () => props.isHighlighted,
    set: v => emit('update:isHighlighted', v),
});

const borderColor = computed(() => highlighted.value ? 'var(--primary-color)' : '');
const color = computed(() => highlighted.value ? 'var(--highlight-text-color)' : '');
const backgroundColor = computed(() => highlighted.value ? 'var(--highlight-bg)' : '');

</script>

<template>
    <div class="flex flex-row flex-nowrap items-baseline gap-1.5">
        <div class="opacity-50 text-sm flex-shrink-0">
            <Avatar class="bg-transparent text-sm transition-colors" :label="(verse.number?.toString())"
                :style="{ backgroundColor, color }" shape="circle" />
        </div>
        <div class="text-lg text-justify leading-loose px-2 border-0 border-l-2 border-solid border-transparent transition-colors"
            :style="{ borderColor }">
            <span class="py-0.5 rounded transition-colors" :style="{ backgroundColor, color }"
                @click="highlighted = !highlighted">
                {{ verse.text }}
            </span>
        </div>
        <span class="opacity-50 text-sm w-8 flex-shrink-0"></span>
    </div>
</template>