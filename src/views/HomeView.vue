<script setup lang="ts">
import BookDialogue from '@/components/inputs/BookDialogue.vue';
import TranslationDialogue from '@/components/inputs/TranslationDialogue.vue';
import VerseDialogue from '@/components/inputs/VerseDialogue.vue';
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

const selectedTranslation = ref<Translation>(undefined);
const selectedBook = ref<Book>(undefined);
const selectedPassages = ref<Passage[]>([]);

</script>

<template>
    <h1>Select Verses</h1>
    <TranslationDialogue v-model="selectedTranslation" :translations="translationLost" />
    <BookDialogue v-model="selectedBook" :books="selectedTranslation?.books" />
    <VerseDialogue v-model="selectedPassages" :translation="selectedTranslation" :book="selectedBook?.type" />
</template>