<script setup lang="ts">
import BookDialogue from '@/components/inputs/BookDialogue.vue';
import TranslationDialogue from '@/components/inputs/TranslationDialogue.vue';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ChapterDialogue from '@/components/inputs/ChapterDialogue.vue';
import { computed, ref } from 'vue';
import { Book } from '@/types/bible/book';
import { BookTypeOldTestament } from '@/types/bible/bookTypeOldTestament';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import { supportedTranslations } from '@/logic/translations/provider';
import { findTranslation, getBook, getChapter } from '@/logic/util/BibleUtils';
import { fromQuery } from '@/logic/util/QueryUtils';
import { useOnMobile } from '@/logic/util/MobileDetection';
import { BookTypeNewTestament } from '@/types/bible/bookTypeNewTestament';
import { onKeyStroke } from '@vueuse/core';

document.title = "Bible Reader";

const translationList = supportedTranslations;

const selectedTranslation = fromQuery<Translation>(
    't',
    (id: string) => findTranslation(translationList, id),
    (translation: Translation) => translation?.id?.toLowerCase()
);

const selectedBook = fromQuery<Book>(
    'b',
    (id: string) => {
        if (selectedTranslation.value)
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
        if (selectedTranslation.value && selectedBook.value)
            return getChapter(selectedTranslation.value, selectedBook.value?.type, Number.parseInt(id));
    },
    (chapter: Chapter) => chapter?.number?.toString()
);

const highligtedVerses = fromQuery<number[]>(
    'v',
    (string: string) => string.split(',').map(s => Number.parseInt(s)),
    (numbers: number[]) => numbers?.join(',')
);

const { isOnMobile } = useOnMobile();

const previousPossible = computed(() => canNavigate('previous'));
const nextPossible = computed(() => canNavigate('next'));

function canNavigate(direction: 'next' | 'previous'): { book: Book, chapter: Chapter } | undefined {
    if (selectedChapter.value == null || selectedBook.value == null || selectedTranslation.value == null) return undefined;
    const diff = direction === 'next' ? 1 : -1;
    const toChapter = selectedBook.value?.chapters?.find(c => c.number === selectedChapter.value?.number + diff);
    if (toChapter != null) return { chapter: toChapter, book: selectedBook.value };
    const toBook = selectedTranslation.value?.books?.find(b => b.type === selectedBook.value?.type + diff);
    if (toBook != null) {
        const toChapterIndex = direction === 'next' ? 0 : toBook.chapters?.length - 1;
        return { chapter: toBook.chapters?.[toChapterIndex], book: toBook };
    }
    return undefined;
}

const navigatePrevious = () => navigate('previous');
const navigateNext = () => navigate('next');

function navigate(direction: 'next' | 'previous') {
    const canNavig = canNavigate(direction);
    if (canNavig != null) {
        selectedBook.value = canNavig.book;
        selectedChapter.value = canNavig.chapter;
        window.scroll({ top: 0 });
        highligtedVerses.value = null;
    }
}

const highlightedStyle = {
    backgroundColor: 'var(--highlight-bg)',
    color: 'var(--highlight-text-color)'
};
const isVerseHighlighted = (number: number) => highligtedVerses.value?.includes(number) ? highlightedStyle : undefined;

function cut(text: string) {
    return text.length > 10
        ? text.substring(0, 9) + '.'
        : text;
}

const showMenu = ref(selectedChapter.value == null);
const toggleMenu = () => showMenu.value = !showMenu.value;

const menuIcon = computed(() => {
    return isOnMobile.value
        ? showMenu.value ? 'mdi mdi-chevron-down' : 'mdi mdi-chevron-up'
        : showMenu.value ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down';
});

const menuClass = computed(() => {
    let classes = '';
    classes += ' ' + (
        isOnMobile.value
            ? 'pb-3'
            : 'flex-col-reverse pt-3'
    );
    classes += ' ' + (
        isOnMobile.value
            ? showMenu.value ? 'bottom-0 rounded-t-[2rem]' : '-bottom-[10.6rem] md:-bottom-[3.9rem]'
            : showMenu.value ? 'top-0 rounded-b-[2rem]' : '-top-[10.6rem] md:-top-[3.9rem]'
    );
    return classes;
});

onKeyStroke('ArrowRight', navigateNext);
onKeyStroke('ArrowLeft', navigatePrevious);

</script>

<template>
    <div class="flex flex-col gap-3 z-10 p-2 w-full shadow-md transition-all fixed -left-[0.5px]" :class="menuClass"
        style="background-color: var(--surface-b); border: 1px solid var(--surface-border)">
        <div class="flex flex-row w-full justify-between gap-2">
            <Button class="w-full max-w-xs" icon="mdi mdi-arrow-left" rounded text
                :label="previousPossible ? `${cut(previousPossible.book?.name)} ${previousPossible.chapter?.number}` : 'Eternity'"
                :disabled="previousPossible == null" @click="navigatePrevious" />
            <Button :icon="menuIcon" class="text-3xl flex-shrink-0" rounded @click="toggleMenu" :text="!isOnMobile" />
            <Button class="w-full max-w-xs" icon="mdi mdi-arrow-right" icon-pos="right" rounded text
                :label="nextPossible ? `${cut(nextPossible.book?.name)} ${nextPossible.chapter?.number}` : 'Eternity'"
                :disabled="nextPossible == null" @click="navigateNext" />
        </div>
        <div class="flex flex-col w-full md:flex-row gap-2" ref="shsh">
            <TranslationDialogue v-model="selectedTranslation" :translations="translationList" />
            <BookDialogue v-model="selectedBook" :books="selectedTranslation?.books" />
            <ChapterDialogue v-model="selectedChapter" :chapters="selectedBook?.chapters" />
        </div>
    </div>
    <div v-if="selectedChapter != null" class="p-4 mb-[40vh] mt-[20vh]">
        <div>
            <div class="flex flex-row w-full items-center py-12">
                <Divider />
                <span class="text-2xl font-bold whitespace-nowrap px-3">
                    {{ getBook(selectedTranslation, selectedBook?.type).name }} {{ selectedChapter?.number }}
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
        </div>
    </div>
</template>