<script setup lang="ts">
import PassageDisplay from '@/components/display/PassageDisplay.vue';
import BookDialogue from '@/components/inputs/BookDialogue.vue';
import TranslationDialogue from '@/components/inputs/TranslationDialogue.vue';
import VerseDialogue from '@/components/inputs/VerseDialogue.vue';
import Button from 'primevue/button';
import { translation } from '@/logic/StubTranslation';
import { Book } from '@/types/bible/book';
import { Translation } from '@/types/bible/translation';
import { TranslationList } from '@/types/bible/translationList';
import { Passage } from '@/types/plans/passage';
import { ref } from 'vue';

const translationLost: TranslationList = [
    {
        id: 'de',
        name: 'German',
        translations: [
            translation
        ]
    }
];

const selectedTranslation = ref<Translation | undefined>(undefined);
const selectedBook = ref<Book | undefined>(undefined);
const selectedPassages = ref<Passage[] | []>([]);

</script>

<template>
    <h1>Select</h1>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-2">
            <TranslationDialogue v-model="selectedTranslation" :translations="translationLost" />
            <BookDialogue v-model="selectedBook" :books="selectedTranslation?.books" />
            <VerseDialogue v-model="selectedPassages" :translation="selectedTranslation" :book="selectedBook?.type" />
        </div>
        <PassageDisplay :passages="selectedPassages" :translation="selectedTranslation"
            placeholder="Select verses to preview." />
        <div class="flex align-items-center gap-2">
            <Button label="Cancel" severity="secondary" text class="w-full" />
            <Button label="Ok" severity="primary" text class="w-full"
                :disabled="selectedPassages?.length < 1 || selectedTranslation == null" />
        </div>
    </div>
</template>