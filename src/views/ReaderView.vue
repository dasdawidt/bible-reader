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
import { computed, onMounted, ref } from 'vue';
import { useTitle } from '@vueuse/core';
import Footer from '@/components/Footer.vue';
import InlineVerse from '@/components/display/InlineVerse.vue';

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
    (string: string) => string?.split(',')?.map(s => Number.parseInt(s)) ?? [],
    (numbers: number[]) => numbers?.length == 0 ? undefined : numbers?.sort((a, b) => a - b)?.join(',')
);

const onNavigation = () => {
    highligtedVerses.value = [];
}
const getIsHighlighted = (number: number) => highligtedVerses.value?.includes(number);
const setIsHighlighted = (number: number, value: boolean) => value
    ? highligtedVerses.value = highligtedVerses.value?.concat(number)
    : highligtedVerses.value = highligtedVerses.value?.filter(n => n != number);

const initialTitle = document.title;
useTitle(
    computed(() => selectedChapter.value != null
        ? `${selectedBook.value?.name} ${selectedChapter.value?.number} (${selectedTranslation.value?.id?.toUpperCase()}) | ${initialTitle}`
        : initialTitle
    )
);

onMounted(() => {
    if (highligtedVerses.value?.length > 0) {
        document.querySelector(`#verse-${highligtedVerses.value[0]}`)
            .scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

</script>

<template>
    <ReaderNavbar :translations="translationList" v-model:translation="selectedTranslation" v-model:book="selectedBook"
        v-model:chapter="selectedChapter" @navigate="onNavigation" class="print:hidden" />
    <div class="px-4 pb-[40vh] pt-[20vh] print:m-0 flex flex-col min-h-screen">
        <div v-if="selectedChapter != null">
            <div class="flex flex-row w-full items-center justify-center gap-3 py-12 overflow-hidden">
                <Divider class="flex-shrink" />
                <span class="text-2xl text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0">
                    {{ getBook(selectedTranslation, selectedBook?.type)?.name }} {{ selectedChapter?.number }}
                </span>
                <Divider class="flex-shrink" />
            </div>
            <InlineVerse v-for="(verse, i) of selectedChapter?.verses" :id="`verse-${verse.number}`" :key="i" :verse="verse"
                :is-highlighted="getIsHighlighted(verse.number)" @load=""
                @update:is-highlighted="v => setIsHighlighted(verse.number, v)" />
            <Divider class="py-6" />
        </div>
        <div class="flex-grow" />
        <Footer />
    </div>
</template>