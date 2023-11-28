<script setup lang="ts">
import Card from 'primevue/card';
import { Verse } from '@/types/bible/verse';

const props = defineProps<{
    verses: Verse[]
}>();
</script>

<template>
    <Card>
        <template #title>
            <span class="text-xl font-bold">Preview</span>
        </template>
        <template #content>
            <div v-for="verse of verses" class="flex flex-row">
                <span class="w-6 flex-shrink-0 opacity-50">
                    {{ verse.number }}
                </span>
                <span>
                    {{ verse.text }}
                </span>
            </div>
        </template>
    </Card>
</template>