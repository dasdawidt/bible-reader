<script setup lang="ts">
import BookDialogue from '@/components/inputs/BookDialogue.vue';
import TranslationDialogue from '@/components/inputs/TranslationDialogue.vue';
import { Book } from '@/types/bible/book';
import { Translation } from '@/types/bible/translation';
import { ref } from 'vue';
import { getBook } from '@/logic/util/BibleUtils';
import Divider from 'primevue/divider';
import { supportedTranslations } from '@/logic/translations/provider';

const translationList = supportedTranslations;

const selectedTranslation = ref<Translation | undefined>(undefined);
const selectedBook = ref<Book | undefined>(undefined);

</script>

<template>
    <h1>Select</h1>
    <div class="flex flex-col gap-6 sticky top-0 py-3 z-10">
        <div class="flex flex-col md:flex-row gap-2">
            <TranslationDialogue v-model="selectedTranslation" :translations="translationList" />
            <BookDialogue v-model="selectedBook" :books="selectedTranslation?.books" />
        </div>
    </div>
    <div v-if="selectedBook != null" class="text-lg">
        <div v-for="chapter of selectedBook?.chapters">
            <div class="flex flex-row w-full items-center py-12">
                <Divider />
                <span class="text-xl font-bold whitespace-nowrap px-3">
                    {{ getBook(selectedTranslation, selectedBook?.type).name }} {{ chapter?.number }}
                </span>
                <Divider />
            </div>
            <div v-for="verse of chapter?.verses" class="flex flex-row items-baseline">
                <span class="opacity-50 text-sm w-8 flex-shrink-0">{{ verse.number }}</span>
                <span class="text-justify">{{ verse.text }}</span>
                <span class="opacity-50 text-sm w-8 flex-shrink-0"></span>
            </div>
        </div>
    </div>
</template>