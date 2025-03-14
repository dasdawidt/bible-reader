<script setup lang="ts">
import Footer from '@/components/display/Footer.vue';
import InlineVerse from '@/components/display/InlineVerse.vue';
import ReaderNavbar from '@/components/navigation/ReaderNavbar.vue';
import ShareButtons from '@/components/navigation/ShareButtons.vue';
import { useTranslationList } from '@/logic/translations';
import {
    findTranslation,
    formatPassages,
    getBook,
    getChapter,
} from '@/logic/util/BibleUtils';
import { bookTypeToString, stringToBookType } from '@/logic/util/BookTypeUtils';
import { formatPassageOptionsFromI18n } from '@/logic/util/I18nUtils';
import { fromQuery } from '@/logic/util/QueryUtils';
import { Book } from '@/types/bible/book';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import { useBrowserLocation, useTitle } from '@vueuse/core';
import Divider from 'primevue/divider';
import { computed, nextTick, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const TRANSLATION_QUERY_KEY = 't';
const BOOK_QUERY_KEY = 'b';
const CHAPTER_QUERY_KEY = 'c';
const HIGHLIGHT_QUERY_KEY = 'v';

const { t } = useI18n();

const { translationList, loading: translationListLoading } =
    useTranslationList();
const selectedTranslation = fromQuery<Translation>(
    TRANSLATION_QUERY_KEY,
    (id: string) => {
        return findTranslation(translationList.value, id);
    },
    (translation: Translation) => translation?.id?.toLowerCase()
);

const selectedBook = fromQuery<Book>(
    BOOK_QUERY_KEY,
    (id: string) => {
        if (selectedTranslation.value != null)
            return getBook(selectedTranslation.value, stringToBookType(id));
    },
    (book: Book) => bookTypeToString(book?.type)?.toLowerCase()
);

const selectedChapter = fromQuery<Chapter>(
    CHAPTER_QUERY_KEY,
    (id: string) => {
        if (selectedTranslation.value != null && selectedBook.value != null)
            return getChapter(
                selectedTranslation.value,
                selectedBook.value?.type,
                Number.parseInt(id)
            );
    },
    (chapter: Chapter) => chapter?.number?.toString()
);

const highlightedVerseNumbers = fromQuery<number[]>(
    HIGHLIGHT_QUERY_KEY,
    (string: string) =>
        string?.split(',')?.map((s) => Number.parseInt(s)) ?? [],
    (numbers: number[]) =>
        numbers?.length == 0
            ? undefined
            : numbers?.sort((a, b) => a - b)?.join(',')
);

const removeHighlight = () => {
    unwatchSelection();
    highlightedVerseNumbers.value = [];
};
const getIsHighlighted = (number: number) =>
    highlightedVerseNumbers.value?.includes(number);
const setIsHighlighted = (number: number, value: boolean) => {
    unwatchSelection();
    value
        ? (highlightedVerseNumbers.value =
              highlightedVerseNumbers.value?.concat(number))
        : (highlightedVerseNumbers.value =
              highlightedVerseNumbers.value?.filter((n) => n != number));
}
const getHiddenForPrint = (number: number) =>
    highlightedVerseNumbers.value?.length > 0 && !getIsHighlighted(number);

const highlightedVerses = computed(() =>
    selectedChapter.value?.verses?.filter((v) =>
        highlightedVerseNumbers.value?.includes(v.number)
    )
);
const navigationExpanded = ref(
    ![TRANSLATION_QUERY_KEY, BOOK_QUERY_KEY, CHAPTER_QUERY_KEY].every((v) =>
        Object.keys(useRoute().query).includes(v)
    )
);
watch(translationListLoading, (value, oldValue) => {
    if (oldValue === true && value === false) {
        navigationExpanded.value = selectedChapter.value == null;
    }
});

const route = useRoute();
const router = useRouter();
const browserLocation = useBrowserLocation();
const shareUrl = computed(
    () => new URL(router.resolve(route).href, browserLocation.value.href).href
);
const shareText = computed(
    () =>
        highlightedVerses.value?.map((v) => v.text)?.join(' ') +
        '\n' +
        shareTitle.value +
        '\n'
);
const shareTitle = computed(() =>
    highlightedVerses.value?.length > 0
        ? formatPassages(
              selectedTranslation.value,
              highlightedVerses.value?.map((v) => ({
                  translationId: selectedTranslation.value?.id,
                  bookType: selectedBook.value?.type,
                  chapter: selectedChapter.value?.number,
                  verse: v.number,
              })),
              formatPassageOptionsFromI18n('bible.passage_format_options', t)
          )
        : undefined
);
const shareButtonsVisible = computed(() => highlightedVerses.value?.length > 0);

const initialTitle = document.title;
useTitle(
    computed(() =>
        selectedChapter.value != null
            ? `${selectedBook.value?.name} ${selectedChapter.value?.number} (${selectedTranslation.value?.id?.toUpperCase()}) | ${initialTitle}`
            : initialTitle
    )
);

const verseRefs = ref(new Map<number, InstanceType<typeof InlineVerse>>());
const unwatchSelection = watchEffect(() => {
    const firstHighlightedVerseNumber = highlightedVerseNumbers.value?.at(0);
    if (firstHighlightedVerseNumber !== undefined) {
        const verseRef = verseRefs.value.get(firstHighlightedVerseNumber);
        if (verseRef !== undefined) {
            (verseRef.$el as HTMLElement).scrollIntoView({ block: 'center', behavior: 'smooth' });
            nextTick(unwatchSelection);
        }
    }
})
</script>

<template>
    <ReaderNavbar
        :translations="translationList"
        :loading="translationListLoading"
        v-model:translation="selectedTranslation"
        v-model:book="selectedBook"
        v-model:chapter="selectedChapter"
        v-model:expanded="navigationExpanded"
        @navigate="removeHighlight"
        class="print:hidden"
    >
        <template #toast-stack>
            <ShareButtons
                :title="shareTitle"
                :text="shareText"
                :url="shareUrl"
                :visible="shareButtonsVisible"
                @update:visible="removeHighlight"
            />
        </template>
    </ReaderNavbar>
    <div
        class="px-4 pb-[40vh] pt-[20vh] print:p-0 flex flex-col min-h-screen print:min-h-0"
    >
        <div v-if="selectedChapter != null">
            <div class="relative w-full h-0">
                <div
                    class="absolute -bottom-12 px-4 tracking-wider text-lg opacity-25 font-medium w-full text-center"
                >
                    {{ selectedBook?.verboseName ?? selectedBook?.name }}
                </div>
            </div>
            <div
                class="flex flex-row w-full items-center justify-center gap-3 py-12 overflow-hidden"
            >
                <Divider class="flex-shrink" />
                <span
                    class="text-3xl text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0"
                >
                    {{
                        $t('bible.chapter', undefined, {
                            locale: selectedTranslation?.language?.toLowerCase(),
                        })
                    }}
                    {{ selectedChapter?.number }}
                </span>
                <Divider class="flex-shrink" />
            </div>
            <InlineVerse
                v-for="(verse, i) of selectedChapter?.verses"
                :id="`verse-${verse.number}`"
                :ref="(el) => verseRefs.set(verse.number, el as InstanceType<typeof InlineVerse>)"
                :key="i"
                :verse="verse"
                :is-highlighted="getIsHighlighted(verse.number)"
                @update:is-highlighted="
                    (v) => setIsHighlighted(verse.number, v)
                "
                :class="{ 'print:hidden': getHiddenForPrint(verse.number) }"
            />
            <Divider class="py-6" />
        </div>
        <div class="flex-grow" />
        <Footer class="print:hidden" />
    </div>
</template>
