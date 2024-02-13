<script setup lang="ts">
import Footer from '@/components/display/Footer.vue';
import InlineVerse from '@/components/display/InlineVerse.vue';
import ReaderNavbar from '@/components/navigation/ReaderNavbar.vue';
import ShareButtons from '@/components/navigation/ShareButtons.vue';
import { useTranslationList } from '@/logic/translations';
import { findTranslation, formatPassages, getBook, getChapter } from '@/logic/util/BibleUtils';
import { bookTypeToString, stringToBookType } from '@/logic/util/BookTypeUtils';
import { fromQuery } from '@/logic/util/QueryUtils';
import { Book } from '@/types/bible/book';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import { useBrowserLocation, useTitle } from '@vueuse/core';
import Divider from 'primevue/divider';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const { translationList, loading: translationListLoading } = useTranslationList();
const selectedTranslation = fromQuery<Translation>(
    't',
    (id: string) => {
        return findTranslation(translationList.value, id);
    },
    (translation: Translation) => translation?.id?.toLowerCase()
);

const selectedBook = fromQuery<Book>(
    'b',
    (id: string) => {
        if (selectedTranslation.value != null)
            return getBook(
                selectedTranslation.value,
                stringToBookType(id)
            );
    },
    (book: Book) => bookTypeToString(book?.type)?.toLowerCase()
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
const getHiddenForPrint = (number: number) => highligtedVerseNumbers.value?.length > 0 && !getIsHighlighted(number);

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
        v-model:chapter="selectedChapter" :loading="translationListLoading" @navigate="removeHighlight"
        class="print:hidden">
        <template #toast-stack>
            <ShareButtons :title="shareTitle" :text="shareText" :url="shareUrl" :visible="highligtedVerseNumbers.length > 0"
                @update:visible="removeHighlight" />
        </template>
    </ReaderNavbar>
    <div class="px-4 pb-[40vh] pt-[20vh] print:p-0 flex flex-col min-h-screen">
        <div v-if="selectedChapter != null">
            <div class="relative w-full h-0">
                <div class="absolute -bottom-12 px-4 tracking-wider text-lg opacity-25 font-medium w-full text-center">
                    {{ selectedBook?.verboseName ?? selectedBook?.name }}
                </div>
            </div>
            <div class="flex flex-row w-full items-center justify-center gap-3 py-12 overflow-hidden">
                <Divider class="flex-shrink" />
                <span class="text-3xl text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0">
                    {{
                        $t('bible.chapter', undefined, { locale: selectedTranslation?.language?.toLowerCase() })
                    }} {{ selectedChapter?.number }}
                </span>
                <Divider class="flex-shrink" />
            </div>
            <InlineVerse v-for="(verse, i) of selectedChapter?.verses" :id="`verse-${verse.number}`" :key="i" :verse="verse"
                :is-highlighted="getIsHighlighted(verse.number)"
                @update:is-highlighted="v => setIsHighlighted(verse.number, v)"
                :class="{ 'print:hidden': getHiddenForPrint(verse.number) }" />
            <Divider class="py-6" />
        </div>
        <div class="flex-grow" />
        <Footer class="print:hidden" />
    </div>
</template>
