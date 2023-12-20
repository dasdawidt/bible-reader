<script setup lang="ts">
import Divider from 'primevue/divider';
import { Book } from '@/types/bible/book';
import { BookTypeOldTestament } from '@/types/bible/bookTypeOldTestament';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import { supportedTranslations } from '@/logic/translations/provider';
import { findTranslation, formatPassages, getBook, getChapter } from '@/logic/util/BibleUtils';
import { fromQuery } from '@/logic/util/QueryUtils';
import { BookTypeNewTestament } from '@/types/bible/bookTypeNewTestament';
import ReaderNavbar from '@/components/navigation/ReaderNavbar.vue';
import { computed, onMounted } from 'vue';
import { useBrowserLocation, useTitle } from '@vueuse/core';
import Footer from '@/components/Footer.vue';
import InlineVerse from '@/components/display/InlineVerse.vue';
import ShareButtons from '@/components/ShareButtons.vue';
import { useRoute, useRouter } from 'vue-router';

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

const highligtedVerseNumbers = fromQuery<number[]>(
    'v',
    (string: string) => string?.split(',')?.map(s => Number.parseInt(s)) ?? [],
    (numbers: number[]) => numbers?.length == 0 ? undefined : numbers?.sort((a, b) => a - b)?.join(',')
);

const removeHighlight = () => {
    highligtedVerseNumbers.value = [];
}
const getIsHighlighted = (number: number) => highligtedVerseNumbers.value?.includes(number);
const setIsHighlighted = (number: number, value: boolean) => value
    ? highligtedVerseNumbers.value = highligtedVerseNumbers.value?.concat(number)
    : highligtedVerseNumbers.value = highligtedVerseNumbers.value?.filter(n => n != number);

const highlightedVerses = computed(() => selectedChapter.value?.verses?.filter(v => highligtedVerseNumbers.value?.includes(v.number)));

const route = useRoute();
const router = useRouter();
const browserLocation = useBrowserLocation();
const shareUrl = computed(() => new URL(router.resolve(route).href, browserLocation.value.href).href);
const shareText = computed(() => highlightedVerses.value?.map(v => v.text)?.join(' ') + '\n' + shareTitle.value + '\n');
const shareTitle = computed(() =>
    highlightedVerses.value?.length > 0
        ? formatPassages(selectedTranslation.value, highlightedVerses.value?.map(v => ({
            translationId: selectedTranslation.value?.id,
            bookType: selectedBook.value?.type,
            chapter: selectedChapter.value?.number,
            verse: v.number,
        })))
        : undefined
);

const initialTitle = document.title;
useTitle(
    computed(() => selectedChapter.value != null
        ? `${selectedBook.value?.name} ${selectedChapter.value?.number} (${selectedTranslation.value?.id?.toUpperCase()}) | ${initialTitle}`
        : initialTitle
    )
);

onMounted(() => {
    if (highligtedVerseNumbers.value?.length > 0) {
        document.querySelector(`#verse-${highligtedVerseNumbers.value[0]}`)
            .scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

</script>

<template>
    <ReaderNavbar :translations="translationList" v-model:translation="selectedTranslation" v-model:book="selectedBook"
        v-model:chapter="selectedChapter" @navigate="removeHighlight" class="print:hidden">
        <template #toast-stack>
            <ShareButtons :title="shareTitle" :text="shareText" :url="shareUrl" :visible="highligtedVerseNumbers.length > 0"
                @update:visible="removeHighlight" />
        </template>
    </ReaderNavbar>
    <div class="px-4 pb-[40vh] pt-[20vh] print:p-0 flex flex-col min-h-screen">
        <div v-if="selectedChapter != null">
            <div class="flex flex-row w-full items-center justify-center gap-3 py-12 overflow-hidden">
                <Divider class="flex-shrink" />
                <span class="text-2xl text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0">
                    {{ getBook(selectedTranslation, selectedBook?.type)?.name }} {{ selectedChapter?.number }}
                </span>
                <Divider class="flex-shrink" />
            </div>
            <InlineVerse v-for="(verse, i) of selectedChapter?.verses" :id="`verse-${verse.number}`" :key="i" :verse="verse"
                :is-highlighted="getIsHighlighted(verse.number)"
                @update:is-highlighted="v => setIsHighlighted(verse.number, v)" />
            <Divider class="py-6" />
        </div>
        <div class="flex-grow" />
        <Footer class="print:hidden" />
    </div>
</template>