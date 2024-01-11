<script setup lang="ts">
import Button from 'primevue/button';
import BookDialog from '@/components/inputs/BookDialog.vue';
import TranslationDialog from '@/components/inputs/TranslationDialog.vue';
import ChapterDialog from '@/components/inputs/ChapterDialog.vue';
import SettingsDialog from '@/components/inputs/SettingsDialog.vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import { Book } from '@/types/bible/book';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import { computed, ref } from 'vue';
import { computedWithControl, onKeyStroke, useElementSize, useResizeObserver } from '@vueuse/core';
import { TranslationList } from '@/types/bible/translationList';
import { bookTypeToNumber } from '@/logic/util/BookTypeUtils';



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
    (e: 'navigate', v: NavigationTarget): void;
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



// Navigation

type NavigationTarget = { direction: 'previous' | 'next', book: Book, chapter: Chapter };

const navigationTargetPrevious = computed(() => getNavigationTarget('previous'));
const navigationTargetNext = computed(() => getNavigationTarget('next'));

function getNavigationTarget(direction: 'next' | 'previous'): NavigationTarget | undefined {
    if (selectedChapter.value == null || selectedBook.value == null || selectedTranslation.value == null) return undefined;
    const diff = direction === 'next' ? 1 : -1;
    const toChapter = selectedBook.value?.chapters?.find(c => c.number === selectedChapter.value?.number + diff);
    if (toChapter != null) return { direction, chapter: toChapter, book: selectedBook.value };
    const toBook = selectedTranslation.value?.books?.find(b => bookTypeToNumber(b.type) === bookTypeToNumber(selectedBook.value?.type) + diff);
    if (toBook != null) {
        const toChapterIndex = direction === 'next' ? 0 : toBook.chapters?.length - 1;
        return { direction, chapter: toBook.chapters?.[toChapterIndex], book: toBook };
    }
    return undefined;
}

const canNavigatePrevious = computed(() => navigationTargetPrevious.value != null);
const canNavigateNext = computed(() => navigationTargetNext.value != null);

const navigationLabelPrevious = computed(() => navButtonLabel(navigationTargetPrevious.value));
const navigationLabelNext = computed(() => navButtonLabel(navigationTargetNext.value));

const { width: menuWidth } = useElementSize(menuElement);

function navButtonLabel(navigationTarget: NavigationTarget) {
    return navigationTarget == null
        ? 'Eternity'
        : menuWidth.value < 280
            ? ''
            : menuWidth.value < 500
                ? `${navigationTarget.book?.abbreviation?.toUpperCase()} ${navigationTarget.chapter?.number}`
                : `${navigationTarget.book?.name} ${navigationTarget.chapter?.number}`;
}

const navigatePrevious = () => navigate(navigationTargetPrevious.value);
const navigateNext = () => navigate(navigationTargetNext.value);

function navigate(navigationTarget: NavigationTarget) {
    if (navigationTarget != null) {
        selectedBook.value = navigationTarget.book;
        selectedChapter.value = navigationTarget.chapter;
        emits('navigate', navigationTarget);
    }
}

onKeyStroke('ArrowRight', navigateNext);
onKeyStroke('ArrowLeft', navigatePrevious);

</script>

<template>
    <div class="flex flex-col items-center z-10 p-2 gap-2 fixed shadow-md -left-px -right-px border border-solid"
        :class="menuClass" style="background-color: var(--surface-b); border-color: var(--surface-border);"
        :style="menuStyle">

        <div class="absolute w-full h-0 z-20">
            <div class="relative top-2.5 w-full flex flex-col gap-2 justify-start items-center p-4 pointer-events-none [&>*]:pointer-events-auto"
                :class="{ 'top-auto bottom-28': isOnMobile }">
                <slot name="toast-stack" />
            </div>
        </div>

        <!-- Navigation bar (always visible) -->
        <div class="flex flex-row justify-between gap-2 w-full max-w-full transition-max-width"
            :class="{ '!max-w-container': showMenu }">
            <div class="w-full flex flex-row justify-start">
                <Button class="whitespace-nowrap" icon="mdi mdi-arrow-left" :label="navigationLabelPrevious"
                    :disabled="!canNavigatePrevious" @click="navigatePrevious" rounded text
                    :pt="{ label: { class: 'text-ellipsis overflow-hidden' } }" />
            </div>
            <!-- Menu toggle button -->
            <Button :icon="menuIcon" class="text-3xl flex-shrink-0" rounded @click="toggleMenu" :text="!isOnMobile" />
            <div class="w-full flex flex-row justify-end">
                <Button class="whitespace-nowrap" icon="mdi mdi-arrow-right" icon-pos="right" :label="navigationLabelNext"
                    :disabled="!canNavigateNext" @click="navigateNext" rounded text
                    :pt="{ label: { class: 'text-ellipsis overflow-hidden' } }" />
            </div>
        </div>

        <!-- Toggleable menu -->
        <div class="flex w-full gap-2 items-center max-w-container"
            :class="isOnMobile ? 'flex-col-reverse pb-2.5 pt-px' : 'flex-col pt-2.5 pb-px'" ref="menuElement">
            <div class="w-full flex flex-row justify-between">
                <SettingsDialog class="max-md:w-full" />
            </div>
            <div class=" flex flex-col w-full md:flex-row gap-2">
                <TranslationDialog v-model="selectedTranslation" :translations="translations" />
                <BookDialog v-model="selectedBook" :books="selectedTranslation?.books" />
                <ChapterDialog v-model="selectedChapter" :chapters="selectedBook?.chapters"
                    :book-name="selectedBook?.name" />
            </div>
        </div>
    </div>
</template>