<script setup lang="ts">
import BookDialogue from '@/components/inputs/BookDialogue.vue';
import TranslationDialogue from '@/components/inputs/TranslationDialogue.vue';
import { Book } from '@/types/bible/book';
import { Translation } from '@/types/bible/translation';
import { ref, computed } from 'vue';
import { getBook } from '@/logic/util/BibleUtils';
import Divider from 'primevue/divider';
import { supportedTranslations } from '@/logic/translations/provider';
import { Chapter } from '@/types/bible/chapter';
import ChapterDialogue from '@/components/inputs/ChapterDialogue.vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import Button from 'primevue/button';

const translationList = supportedTranslations;

const selectedTranslation = ref<Translation | undefined>(undefined);
const selectedBook = ref<Book | undefined>(undefined);
const selectedChapter = ref<Chapter | undefined>(undefined);

const { isOnMobile } = useOnMobile();

const previousPossible = computed(() => canNavigate(-1));
const nextPossible = computed(() => canNavigate(+1));

function canNavigate(diff: 1 | -1): { book: Book, chapter: Chapter } | undefined {
    if (selectedChapter.value == null || selectedBook.value == null || selectedTranslation.value == null) return undefined;
    const toChapter = selectedBook.value?.chapters?.find(c => c.number === selectedChapter.value?.number + diff);
    if (toChapter != null) return { chapter: toChapter, book: selectedBook.value };
    const toBook = selectedTranslation.value?.books?.find(b => b.type === selectedBook.value?.type + diff);
    if (toBook != null) {
        const toChapterIndex = ((toBook.chapters?.length + diff) % toBook.chapters?.length) - (diff > 0 ? 1 : 0);
        console.log(toChapterIndex);
        return { chapter: toBook.chapters?.[toChapterIndex], book: toBook };
    }
    return undefined;
}

const navigatePrevious = () => navigate(-1);
const navigateNext = () => navigate(+1);

function navigate(diff: 1 | -1) {
    const canNavig = canNavigate(diff);
    console.log(canNavig);
    if (canNavig != null) {
        selectedBook.value = canNavig.book;
        selectedChapter.value = canNavig.chapter;
    }
}

</script>

<template>
    <div class="flex flex-col w-full gap-2 z-10 sticky top-0 py-2">
        <div class="flex flex-col w-full md:flex-row gap-2">
            <TranslationDialogue v-model="selectedTranslation" :translations="translationList"
                @update:model-value="selectedChapter = undefined; selectedBook = undefined" />
            <BookDialogue v-model="selectedBook" :books="selectedTranslation?.books"
                @update:model-value="selectedChapter = undefined" />
            <ChapterDialogue v-model="selectedChapter" :chapters="selectedBook?.chapters" />
        </div>
    </div>
    <div v-if="selectedChapter != null" class="text-lg">
        <div>
            <div class="flex flex-row w-full items-center py-12">
                <Divider />
                <span class="text-2xl font-bold whitespace-nowrap px-3">
                    {{ getBook(selectedTranslation, selectedBook?.type).name }} {{ selectedChapter?.number }}
                </span>
                <Divider />
            </div>
            <div v-for="verse of selectedChapter?.verses" class="flex flex-row items-baseline">
                <span class="opacity-50 text-sm w-8 flex-shrink-0">{{ verse.number }}</span>
                <span class="text-justify">{{ verse.text }}</span>
                <span class="opacity-50 text-sm w-8 flex-shrink-0"></span>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-2 z-10 bottom-0 py-2">
        <div class="flex flex-row gap-2">
            <Button class="w-full" icon="mdi mdi-arrow-left"
                :label="previousPossible ? `${previousPossible.book?.name} ${previousPossible.chapter?.number}` : ''"
                @click="navigatePrevious" :disabled="previousPossible == null" />
            <Button class="w-full" icon="mdi mdi-arrow-right" icon-pos="right"
                :label="nextPossible ? `${nextPossible.book?.name} ${nextPossible.chapter?.number}` : ''"
                @click="navigateNext" :disabled="nextPossible == null" />
        </div>
    </div>
</template>