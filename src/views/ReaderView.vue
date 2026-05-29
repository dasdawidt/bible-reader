<script setup lang="ts">
import { useBrowserLocation, useTitle } from '@vueuse/core';
import Divider from 'primevue/divider';
import { computed, nextTick, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Footer from '@/components/display/Footer.vue';
import InlineVerse from '@/components/display/InlineVerse.vue';
import ReaderNavbar from '@/components/navigation/ReaderNavbar.vue';
import ShareButtons from '@/components/navigation/ShareButtons.vue';
import { useTranslationList } from '@/logic/translations';
import { findTranslation, formatPassages, getBook, getChapter } from '@/logic/util/BibleUtils';
import { bookTypeToString, stringToBookType } from '@/logic/util/BookTypeUtils';
import { formatPassageOptionsFromI18n } from '@/logic/util/I18nUtils';
import { fromQuery } from '@/logic/util/QueryUtils';

const TRANSLATION_QUERY_KEY = 't';
const BOOK_QUERY_KEY = 'b';
const CHAPTER_QUERY_KEY = 'c';
const HIGHLIGHT_QUERY_KEY = 'v';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const browserLocation = useBrowserLocation();

const allParamsPresent = [TRANSLATION_QUERY_KEY, BOOK_QUERY_KEY, CHAPTER_QUERY_KEY].every((v) =>
    Object.keys(route.query).includes(v),
);

const { translationList, loading: translationListLoading } = useTranslationList();
const selectedTranslation = fromQuery(
    TRANSLATION_QUERY_KEY,
    (id) => {
        if (id !== undefined) {
            return findTranslation(translationList.value, id);
        }
        return undefined;
    },
    (translation) => translation?.id?.toLowerCase(),
);

const selectedBook = fromQuery(
    BOOK_QUERY_KEY,
    (id) => {
        if (selectedTranslation.value !== undefined && id !== undefined) {
            return getBook(selectedTranslation.value, stringToBookType(id));
        }
        return undefined;
    },
    (book) => bookTypeToString(book?.type)?.toLowerCase(),
);

const selectedChapter = fromQuery(
    CHAPTER_QUERY_KEY,
    (id) => {
        if (selectedTranslation.value !== undefined && selectedBook.value !== undefined && id !== undefined) {
            return getChapter(selectedTranslation.value, selectedBook.value?.type, Number.parseInt(id, 10));
        }
        return undefined;
    },
    (chapter) => chapter?.number?.toString(),
);

const highlightedVerseNumbers = fromQuery(
    HIGHLIGHT_QUERY_KEY,
    (string) =>
        string
            ?.split(',')
            ?.map((s) => Number.parseInt(s, 10))
            .filter((v) => !Number.isNaN(v)) ?? [],
    (numbers: number[]) => (numbers?.length === 0 ? undefined : numbers?.sort((a, b) => a - b)?.join(',')),
);

// Don't expand navigation if all parameters are already set in the URL.
const navigationExpanded = ref(!allParamsPresent);
// But then still expand it if there is no selected chapter after loading (e.g. invalid selection).
watch(translationListLoading, (value, oldValue) => {
    if (oldValue === true && value === false) {
        navigationExpanded.value = selectedChapter.value === undefined;
    }
});

const removeHighlight = () => {
    unwatchSelection();
    highlightedVerseNumbers.value = [];
};
const getIsHighlighted = (number: number) => highlightedVerseNumbers.value?.includes(number);
const setIsHighlighted = (number: number, value: boolean) => {
    unwatchSelection();
    hideUnselected.value = false;
    if (value) {
        highlightedVerseNumbers.value = highlightedVerseNumbers.value?.concat(number);
    } else {
        highlightedVerseNumbers.value = highlightedVerseNumbers.value?.filter((n) => n !== number);
    }
};
const hideUnselected = ref(false);
const getHiddenForPrint = (number: number) =>
    hideUnselected.value && highlightedVerseNumbers.value?.length > 0 && !getIsHighlighted(number);

const highlightedVerses = computed(() =>
    selectedChapter.value?.verses?.filter((v) => highlightedVerseNumbers.value?.includes(v.number)),
);

const shareButtonsVisible = computed(() => highlightedVerses.value && highlightedVerses.value?.length > 0);
const shareUrl = computed(() => new URL(router.resolve(route).href, browserLocation.value.href).href);
const shareText = computed(() => `${highlightedVerses.value?.map((v) => v.text)?.join(' ')}\n${shareTitle.value}\n`);
const shareTitle = computed(() => {
    const [tr, b, c, vs] = [
        selectedTranslation.value,
        selectedBook.value,
        selectedChapter.value,
        highlightedVerses.value,
    ];
    if (tr !== undefined && b !== undefined && c !== undefined && vs !== undefined && vs.length > 0) {
        return formatPassages(
            tr,
            vs.map((v) => ({
                translationId: tr.id,
                bookType: b.type,
                chapter: c.number,
                verse: v.number,
            })),
            formatPassageOptionsFromI18n('bible.passage_format_options', t),
        );
    }
});

const initialTitle = document.title;
useTitle(
    computed(() =>
        selectedChapter.value != null
            ? `${selectedBook.value?.name} ${selectedChapter.value?.number} (${selectedTranslation.value?.id?.toUpperCase()}) | ${initialTitle}`
            : initialTitle,
    ),
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
});
</script>

<template>
    <ReaderNavbar
        class="print:hidden"
        :translations="translationList"
        :loading="translationListLoading"
        v-model:translation="selectedTranslation"
        v-model:book="selectedBook"
        v-model:chapter="selectedChapter"
        v-model:expanded="navigationExpanded"
        @navigate="removeHighlight"
    >
        <template #toast-stack>
            <ShareButtons
                v-model:hide-unselected="hideUnselected"
                :title="shareTitle"
                :text="shareText"
                :url="shareUrl"
                :visible="shareButtonsVisible"
                @update:visible="removeHighlight"
            />
        </template>
    </ReaderNavbar>
    <div class="px-4 pb-[40vh] pt-[20vh] print:p-0 flex flex-col min-h-dvh print:min-h-0">
        <article v-if="selectedChapter" :lang="selectedTranslation?.language">
            <header class="contents">
                <div class="relative w-full h-0">
                    <span
                        class="absolute -bottom-12 px-4 tracking-wider text-lg opacity-25 font-medium w-full text-center"
                    >
                        {{ selectedBook?.verboseName ?? selectedBook?.name }}
                    </span>
                </div>
                <div class="flex flex-row w-full items-center justify-center gap-3 py-12 overflow-hidden">
                    <Divider class="shrink" />
                    <h1
                        class="m-0 text-3xl text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis shrink-0"
                    >
                        {{ t('bible.chapter', {}, {
                                locale: selectedTranslation?.language?.toLowerCase(),
                            }) }}
                        {{ selectedChapter?.number }}
                    </h1>
                    <Divider class="shrink" />
                </div>
            </header>
            <section class="contents">
                <InlineVerse
                    v-for="(verse, i) in (selectedChapter?.verses ?? [])"
                    :id="`verse-${verse.number}`"
                    :ref="(el) => verseRefs.set(verse.number, el as InstanceType<typeof InlineVerse>)"
                    :key="i"
                    :verse="verse"
                    :is-highlighted="!hideUnselected && getIsHighlighted(verse.number)"
                    @update:is-highlighted=" (v) => setIsHighlighted(verse.number, v)"
                    :class="{ 'print:hidden': getHiddenForPrint(verse.number) }"
                />
            </section>
            <Divider class="py-10" />
            <footer
                class="not-print:hidden -translate-y-6 px-4 tracking-widest font-medium text-xs opacity-25 w-full text-center"
            >
                {{ selectedTranslation?.localizedName ?? selectedTranslation?.name }}
            </footer>
        </article>
        <div class="grow" />
        <Footer class="print:hidden" />
    </div>
</template>
