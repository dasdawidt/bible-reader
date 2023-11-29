<script setup lang="ts">
import BookDialogue from '@/components/inputs/BookDialogue.vue';
import TranslationDialogue from '@/components/inputs/TranslationDialogue.vue';
import { translation } from '@/logic/StubTranslation';
import { Book } from '@/types/bible/book';
import { Translation } from '@/types/bible/translation';
import { TranslationList } from '@/types/bible/translationList';
import { ref } from 'vue';
import { getBook } from '@/logic/util/BibleUtils';
import Divider from 'primevue/divider';

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

</script>

<template>
    <h1>Select</h1>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-2">
            <TranslationDialogue v-model="selectedTranslation" :translations="translationLost" />
            <BookDialogue v-model="selectedBook" :books="selectedTranslation?.books" />
        </div>
    </div>
    <div v-if="selectedBook != null" class="text-lg">
        <div v-for="chapter of selectedBook?.chapters">
            <Divider :id="`verse-dialogue-chapter-${chapter?.number}`">
                <span class="text-xl font-bold">
                    {{ getBook(translation, selectedBook?.type).name }} {{ chapter?.number }}
                </span>
            </Divider>
            <div v-for="verse of chapter?.verses" class="flex flex-row items-baseline">
                <span class="opacity-50 text-sm w-8 flex-shrink-0">{{ verse.number }}</span>
                <span class="text-justify">{{ verse.text }}</span>
                <span class="opacity-50 text-sm w-8 flex-shrink-0"></span>
            </div>
        </div>
    </div>
</template>