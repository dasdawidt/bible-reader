<script setup lang="ts">
import Divider from 'primevue/divider';
import { Book } from '@/types/bible/book';
import { BookTypeOldTestament } from '@/types/bible/bookTypeOldTestament';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import { supportedTranslations } from '@/logic/translations/provider';
import { findTranslation, getBook, getChapter } from '@/logic/util/BibleUtils';
import { fromQuery } from '@/logic/util/QueryUtils';
import { BookTypeNewTestament } from '@/types/bible/bookTypeNewTestament';
import ReaderNavbar from '@/components/navigation/ReaderNavbar.vue';
import { computed, onMounted } from 'vue';
import { useTitle } from '@vueuse/core';
import Footer from '@/components/Footer.vue';

const translationList = supportedTranslations;

const selectedTranslation = fromQuery<Translation>(
    't',
    (id: string) => {
        if (translationList != null)
            return findTranslation(translationList, id);
    },
    (translation: Translation) => translation?.id?.toLowerCase()
);

const selectedBook = fromQuery<Book>(
    'b',
    (id: string) => {
        if (selectedTranslation.value != null)
            return getBook(
                selectedTranslation.value,
                (
                    BookTypeOldTestament[id?.toUpperCase()]
                    ?? BookTypeNewTestament[id?.toUpperCase()]
                )
            );
    },
    (book: Book) => (
        BookTypeOldTestament[book?.type]
        ?? BookTypeNewTestament[book?.type]
    )?.toLowerCase()
);

const selectedChapter = fromQuery<Chapter>(
    'c',
    (id: string) => {
        if (selectedTranslation.value != null && selectedBook.value != null)
            return getChapter(selectedTranslation.value, selectedBook.value?.type, Number.parseInt(id));
    },
    (chapter: Chapter) => chapter?.number?.toString()
);

const highligtedVerses = fromQuery<number[]>(
    'v',
    (string: string) => string.split(',').map(s => Number.parseInt(s)),
    (numbers: number[]) => numbers?.join(',')
);

const highlightedStyle = {
    backgroundColor: 'var(--highlight-bg)',
    color: 'var(--highlight-text-color)'
};
const isVerseHighlighted = (number: number) => highligtedVerses.value?.includes(number) ? highlightedStyle : undefined;


const initialTitle = document.title;
useTitle(
    computed(() => selectedChapter.value != null
        ? `${selectedBook.value?.name} ${selectedChapter.value?.number} (${selectedTranslation.value?.id?.toUpperCase()}) | ${initialTitle}`
        : initialTitle
    )
);

</script>

<template>
    <ReaderNavbar :translations="translationList" v-model:translation="selectedTranslation" v-model:book="selectedBook"
        v-model:chapter="selectedChapter" class="print:hidden" />
    <div class="px-4 pb-[40vh] pt-[20vh] print:m-0 flex flex-col min-h-screen">
        <div v-if="selectedChapter != null">
            <div class="flex flex-row w-full items-center py-12">
                <Divider />
                <span class="text-2xl font-bold whitespace-nowrap px-3">
                    {{ getBook(selectedTranslation, selectedBook?.type)?.name }} {{ selectedChapter?.number }}
                </span>
                <Divider />
            </div>
            <div v-for=" verse  of  selectedChapter?.verses " class="flex flex-row items-baseline">
                <span class="opacity-50 text-sm w-8 flex-shrink-0">
                    {{ verse.number }}
                </span>
                <div class="text-lg text-justify">
                    <span :style="isVerseHighlighted(verse.number)">
                        {{ verse.text }}
                    </span>
                </div>
                <span class="opacity-50 text-sm w-8 flex-shrink-0"></span>
            </div>
            <Divider class="py-6" />
        </div>
        <div class="flex-grow" />
        <Footer />
    </div>
</template>