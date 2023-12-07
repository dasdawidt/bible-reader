<script setup lang="ts">
import Button from 'primevue/button';
import BookDialogue from '@/components/inputs/BookDialogue.vue';
import TranslationDialogue from '@/components/inputs/TranslationDialogue.vue';
import ChapterDialogue from '@/components/inputs/ChapterDialogue.vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import { computed, ref } from 'vue';
import { computedWithControl, onKeyStroke, useResizeObserver } from '@vueuse/core';
import { TranslationList } from '@/types/bible/translationList';
import { TranslationInfo } from '@/types/bible/translationInfo';
import { BookInfo } from '@/types/bible/bookInfo';
import { ChapterInfo } from '@/types/bible/chapterInfo';
import { TranslationProvider } from '@/types/logic/TranslationProvider';
import { useMutation, useQuery } from '@tanstack/vue-query';



// General variables

const { isOnMobile } = useOnMobile();



// Props and emits

const props = defineProps<{
    translations?: TranslationList;
    translation?: TranslationInfo;
    translationProvider?: TranslationProvider;
    books?: BookInfo[];
    book?: BookInfo;
    chapters?: ChapterInfo[];
    chapter?: ChapterInfo;
}>();

const emits = defineEmits<{
    (e: 'update:chapter', v: ChapterInfo): void;
    (e: 'update:book', v: BookInfo): void;
    (e: 'update:translation', v: TranslationInfo): void;
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

const { data: previousPossible } = useQuery({
    queryKey: ['previous-possible', props],
    queryFn: async () => await canNavigate('previous'),
});
const { data: nextPossible } = useQuery({
    queryKey: ['next-possible', props],
    queryFn: async () => await canNavigate('next'),
});

// const previousPossible = computed(() => canNavigate('previous'));
// const nextPossible = computed(() => canNavigate('next'));

async function canNavigate(direction: 'next' | 'previous'): Promise<{ bookInfo: BookInfo, chapterInfo: ChapterInfo } | undefined> {
    if (selectedChapter.value == null || selectedBook.value == null || selectedTranslation.value == null) return undefined;
    const diff = direction === 'next' ? 1 : -1;
    const toChapter = await props.translationProvider?.getChapter(selectedBook.value?.type, selectedChapter.value?.number + diff);
    if (toChapter != null) return { chapterInfo: toChapter, bookInfo: selectedBook.value };
    const toBook = await props.translationProvider?.getBook(selectedBook.value?.type + diff);
    if (toBook != null) {
        const toChapterIndex = direction === 'next' ? 0 : props.chapters?.length - 1;
        return { chapterInfo: props.chapters?.[toChapterIndex], bookInfo: toBook };
    }
    return undefined;
}

const { mutateAsync: navigatePrevious, isPending: previousLoading } = useMutation({
    mutationKey: ['navigate-previous', props],
    mutationFn: () => navigate('previous'),
});
const { mutateAsync: navigateNext, isPending: nextLoading } = useMutation({
    mutationKey: ['navigate-next', props],
    mutationFn: () => navigate('next'),
});
// const navigatePrevious = () => navigate('previous');
// const navigateNext = () => navigate('next');

async function navigate(direction: 'next' | 'previous') {
    const canNavig = await canNavigate(direction);
    if (canNavig != null) {
        selectedBook.value = canNavig.bookInfo;
        selectedChapter.value = canNavig.chapterInfo;
        window.scroll({ top: 0 });
    }
}

onKeyStroke('ArrowRight', () => navigateNext());
onKeyStroke('ArrowLeft', () => navigatePrevious());



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
                :label="previousPossible ? `${cut(previousPossible.bookInfo?.name)} ${previousPossible.chapterInfo?.number}` : 'Eternity'"
                :disabled="previousPossible == null" @click="() => navigatePrevious()" :loading="previousLoading" />
            <!-- Menu toggle button -->
            <Button :icon="menuIcon" class="text-3xl flex-shrink-0" rounded @click="toggleMenu" :text="!isOnMobile" />
            <Button class="w-full max-w-xs" icon="mdi mdi-arrow-right" icon-pos="right" rounded text
                :label="nextPossible ? `${cut(nextPossible.bookInfo?.name)} ${nextPossible.chapterInfo?.number}` : 'Eternity'"
                :disabled="nextPossible == null" @click="() => navigateNext()" :loading="nextLoading" />
        </div>

        <!-- Toggleable menu -->
        <div class="flex w-full gap-2 items-center"
            :class="isOnMobile ? 'flex-col-reverse pb-2.5 pt-1' : 'flex-col pt-2.5 pb-1'" ref="menuElement">
            <div class="flex flex-col w-full md:flex-row gap-2">
                <TranslationDialogue v-model="selectedTranslation" :translations="translations" />
                <BookDialogue v-model="selectedBook" :books="books" />
                <ChapterDialogue v-model="selectedChapter" :chapters="chapters" :book-name="selectedBook?.name" />
            </div>
            {{ nextLoading }}
        </div>
    </div>
</template>