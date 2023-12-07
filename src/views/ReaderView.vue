<script setup lang="ts">
import ReaderNavbar from '@/components/navigation/ReaderNavbar.vue';
import Divider from 'primevue/divider';
import Footer from '@/components/Footer.vue';
import { TranslationInfo } from '@/types/bible/translationInfo';
import { Book } from '@/types/bible/book';
import { BookInfo } from '@/types/bible/bookInfo';
import { BookTypeOldTestament } from '@/types/bible/bookTypeOldTestament';
import { BookTypeNewTestament } from '@/types/bible/bookTypeNewTestament';
import { Chapter } from '@/types/bible/chapter';
import { ChapterInfo } from '@/types/bible/chapterInfo';
import { findTranslation, supportedTranslations } from '@/logic/translations/provider';
import { findTranslationInfo } from '@/logic/util/BibleUtils';
import { fromQuery } from '@/logic/util/QueryUtils';
import { computed } from 'vue';
import { useTitle } from '@vueuse/core';
import { useQuery } from '@tanstack/vue-query';

const translationList = supportedTranslations;

const selectedTranslationInfo = fromQuery<TranslationInfo>(
    't',
    (id: string) => {
        if (translationList != null)
            return findTranslationInfo(translationList, id);
    },
    (translationInfo: TranslationInfo) => translationInfo?.id?.toLowerCase()
);

const selectedTranslationProvider = computed(() => findTranslation(selectedTranslationInfo.value?.id));

const selectedBookInfo = fromQuery<BookInfo>(
    'b',
    (id: string) => {
        if (selectedTranslationInfo.value != null)
            return selectedTranslationProvider.value?.supportedBooks
                .find(b =>
                    b.type === (
                        BookTypeOldTestament[id?.toUpperCase()]
                        ?? BookTypeNewTestament[id?.toUpperCase()]
                    )
                );
    },
    (bookInfo: BookInfo) => (
        BookTypeOldTestament[bookInfo?.type]
        ?? BookTypeNewTestament[bookInfo?.type]
    )?.toLowerCase()
);

const { data: selectedBook, refetch } = useQuery<Book, Error>({
    queryKey: ['book', selectedTranslationInfo, selectedBookInfo],
    queryFn: async () => {
        const data = await selectedTranslationProvider.value?.getBook(selectedBookInfo.value?.type);
        if (data == null) throw new Error(`Cannot find Book ${selectedBookInfo.value?.type} of Translation ${selectedTranslationInfo.value?.id}.`);
        return data;
    }
});

const selectedChapterInfo = fromQuery<ChapterInfo>(
    'c',
    (number: string) => {
        if (selectedBook.value != null)
            return selectedBook.value?.chapters
                .find(c => c.number === Number.parseInt(number));
    },
    (chapterInfo: ChapterInfo) => chapterInfo.number.toString()
);

const { data: selectedChapter } = useQuery<Chapter, Error>({
    queryKey: ['chapter', selectedTranslationInfo, selectedBookInfo, selectedChapterInfo],
    queryFn: async () => {
        const data = await selectedTranslationProvider.value?.getChapter(selectedBookInfo.value?.type, selectedChapterInfo.value?.number)
        if (data == null) throw new Error(`Cannot find Chapter ${selectedChapter.value} in Book ${selectedBookInfo.value?.type} of Translation ${selectedTranslationInfo.value?.id}.`);
        return data;
    }
});

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
    computed(() => selectedChapterInfo.value != null
        ? `${selectedBookInfo.value?.name} ${selectedChapter.value?.number} (${selectedTranslationInfo.value?.id?.toUpperCase()}) | ${initialTitle}`
        : initialTitle
    )
);

</script>

<template>
    <ReaderNavbar :translations="translationList" v-model:translation="selectedTranslationInfo"
        :translation-provider="selectedTranslationProvider" :books="selectedTranslationProvider?.supportedBooks"
        v-model:book="selectedBookInfo" :chapters="selectedBook?.chapters" v-model:chapter="selectedChapterInfo"
        class="print:hidden" />
    <div class="px-4 pb-[40vh] pt-[20vh] print:m-0 flex flex-col min-h-screen">
        <div v-if="selectedChapter != null">
            <div class="flex flex-row w-full items-center py-12">
                <Divider />
                <span class="text-2xl font-bold whitespace-nowrap px-3">
                    {{ selectedBook?.name }} {{ selectedChapter?.number }}
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