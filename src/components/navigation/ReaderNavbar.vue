<script setup lang="ts">
import Button from 'primevue/button';
import BookDialog from '@/components/inputs/BookDialog.vue';
import TranslationDialog from '@/components/inputs/TranslationDialog.vue';
import ChapterDialog from '@/components/inputs/ChapterDialog.vue';
import SettingsDialog from './SettingsDialog.vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import { Book } from '@/types/bible/book';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import { computed, ref } from 'vue';
import { computedWithControl, onKeyStroke, useResizeObserver } from '@vueuse/core';
import { TranslationList } from '@/types/bible/translationList';



// General variables

const { isOnMobile } = useOnMobile();



// Props and emits

const props = defineProps<{
    translations?: TranslationList,
    chapter?: Chapter,
    book?: Book,
    translation?: Translation
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



// Navigation

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

onKeyStroke('ArrowRight', navigateNext);
onKeyStroke('ArrowLeft', navigatePrevious);



// Menu

const showMenu = ref(selectedChapter.value == null);
const menuTransition = ref(false);
const toggleMenu = () => {
    // make sure the animation is played
    menuTransition.value = true;
    showMenu.value = !showMenu.value
};

// Open/close the menu
const menuElement = ref<HTMLElement>(null);
const menuStyle = computedWithControl(
    () => [isOnMobile.value, showMenu.value],
    () => ({
        transform: 'translateY(' + (
            isOnMobile.value
                ? showMenu.value ? '0px' : `${menuElement.value?.clientHeight}px`
                : showMenu.value ? '0px' : `-${menuElement.value?.clientHeight}px`
        ) + ')'
    })
);
useResizeObserver(menuElement, () => {
    // disable animation for auto-resize
    menuTransition.value = false;
    menuStyle.trigger();
});

// Menu icon
const menuIcon = computed(() => {
    return isOnMobile.value
        ? showMenu.value ? 'mdi mdi-chevron-down' : 'mdi mdi-chevron-up'
        : showMenu.value ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down';
});

// Menu style
const menuClass = computed(() => {
    let classes = '';
    classes += ' ' + (
        menuTransition.value
            ? 'transition-all duration-300'
            : ''
    );
    classes += ' ' + (
        isOnMobile.value
            ? 'pb-0 bottom-0 border-b-0'
            : 'flex-col-reverse pt-0 top-0 border-t-0'
    );
    classes += ' ' + (
        isOnMobile.value
            ? showMenu.value ? 'rounded-t-[2rem]' : ''
            : showMenu.value ? 'rounded-b-[2rem]' : ''
    );
    return classes;
});



// Util

function cut(text: string) {
    return text.length > 10
        ? text.substring(0, 9) + '.'
        : text;
}

</script>

<template>
    <div class="flex flex-col z-10 p-2 gap-2 w-full fixed shadow-md -left-[0.5px] border border-solid" :class="menuClass"
        style="background-color: var(--surface-b); border-color: var(--surface-border);" :style="menuStyle">

        <!-- Navigation bar (always visible) -->
        <div class="flex flex-row w-full justify-between gap-2">
            <Button class="w-full max-w-xs" icon="mdi mdi-arrow-left" rounded text
                :label="previousPossible ? `${cut(previousPossible.book?.name)} ${previousPossible.chapter?.number}` : 'Eternity'"
                :disabled="previousPossible == null" @click="navigatePrevious" />
            <!-- Menu toggle button -->
            <Button :icon="menuIcon" class="text-3xl flex-shrink-0" rounded @click="toggleMenu" :text="!isOnMobile" />
            <Button class="w-full max-w-xs" icon="mdi mdi-arrow-right" icon-pos="right" rounded text
                :label="nextPossible ? `${cut(nextPossible.book?.name)} ${nextPossible.chapter?.number}` : 'Eternity'"
                :disabled="nextPossible == null" @click="navigateNext" />
        </div>

        <!-- Toggleable menu -->
        <div class="flex w-full gap-2 items-center"
            :class="isOnMobile ? 'flex-col-reverse pb-2.5 pt-1' : 'flex-col pt-2.5 pb-1'" ref="menuElement">

            <div class="flex flex-col w-full md:flex-row gap-2">
                <TranslationDialog v-model="selectedTranslation" :translations="translations" />
                <BookDialog v-model="selectedBook" :books="selectedTranslation?.books" />
                <ChapterDialog v-model="selectedChapter" :chapters="selectedBook?.chapters"
                    :book-name="selectedBook?.name" />
                <SettingsDialog />
            </div>
        </div>
    </div>
</template>