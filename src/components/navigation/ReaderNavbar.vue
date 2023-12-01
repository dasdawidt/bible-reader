<script setup lang="ts">
import Button from 'primevue/button';
import BookDialogue from '@/components/inputs/BookDialogue.vue';
import TranslationDialogue from '@/components/inputs/TranslationDialogue.vue';
import ChapterDialogue from '@/components/inputs/ChapterDialogue.vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import { Book } from '@/types/bible/book';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import { computed, ref } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import { TranslationList } from '@/types/bible/translationList';

const { isOnMobile } = useOnMobile();

const props = defineProps<{
    translations: TranslationList,
    chapter: Chapter,
    book: Book,
    translation: Translation
}>();

const emits = defineEmits<{
    (e: 'update:chapter', v: Chapter): void;
    (e: 'update:book', v: Book): void;
    (e: 'update:translation', v: Translation): void;
}>();

const selectedChapter = computed({
    get: () => props.chapter,
    set: (v) => emits('update:chapter', v)
});

const selectedBook = computed({
    get: () => props.book,
    set: (v) => emits('update:book', v)
});

const selectedTranslation = computed({
    get: () => props.translation,
    set: (v) => emits('update:translation', v)
});

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
    }
}

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
        <div class="flex flex-col w-full md:flex-row gap-2">
            <TranslationDialogue v-model="selectedTranslation" :translations="translations" />
            <BookDialogue v-model="selectedBook" :books="selectedTranslation?.books" />
            <ChapterDialogue v-model="selectedChapter" :chapters="selectedBook?.chapters" />
        </div>
    </div>
</template>