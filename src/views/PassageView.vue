<script setup lang="ts">
import { useBrowserLocation, useTitle } from '@vueuse/core';
import InputGroup from 'primevue/inputgroup';
import Divider from 'primevue/divider';
import ButtonGroup from 'primevue/buttongroup'
import { computed, nextTick, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteLocation, useRoute, useRouter } from 'vue-router';
import Footer from '@/components/display/Footer.vue';
import InlineVerse from '@/components/display/InlineVerse.vue';
import ReaderNavbar from '@/components/navigation/ReaderNavbar.vue';
import ShareButtons from '@/components/navigation/ShareButtons.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { useTranslationList } from '@/logic/translations';
import { findTranslation, formatPassages, getBook, getChapter } from '@/logic/util/BibleUtils';
import { bookTypeToString, stringToBookType } from '@/logic/util/BookTypeUtils';
import { formatPassageOptionsFromI18n } from '@/logic/util/I18nUtils';
import { fromQuery } from '@/logic/util/QueryUtils';
import { Book } from '@/types/bible/book';
import { Chapter } from '@/types/bible/chapter';
import { Translation } from '@/types/bible/translation';
import Button from 'primevue/button';
import { mdiArrowLeft, mdiPrinter, mdiTextSearchVariant } from '@mdi/js';

const TRANSLATION_QUERY_KEY = 't';
const BOOK_QUERY_KEY = 'b';
const CHAPTER_QUERY_KEY = 'c';
const HIGHLIGHT_QUERY_KEY = 'v';

const props = withDefaults(defineProps<{
    printView?: boolean
}>(), {
    printView: true
})

const { t } = useI18n();

const { translationList, loading: translationListLoading } = useTranslationList();
const selectedTranslation = fromQuery<Translation>(
    TRANSLATION_QUERY_KEY,
    (id: string) => {
        return findTranslation(translationList.value, id);
    },
    (translation: Translation) => translation?.id?.toLowerCase(),
);

const selectedBook = fromQuery<Book>(
    BOOK_QUERY_KEY,
    (id: string) => {
        if (selectedTranslation.value != null) return getBook(selectedTranslation.value, stringToBookType(id));
    },
    (book: Book) => bookTypeToString(book?.type)?.toLowerCase(),
);

const selectedChapter = fromQuery<Chapter>(
    CHAPTER_QUERY_KEY,
    (id: string) => {
        if (selectedTranslation.value != null && selectedBook.value != null)
            return getChapter(selectedTranslation.value, selectedBook.value?.type, Number.parseInt(id, 10));
    },
    (chapter: Chapter) => chapter?.number?.toString(),
);

const highlightedVerseNumbers = fromQuery<number[]>(
    HIGHLIGHT_QUERY_KEY,
    (string: string) => string?.split(',')?.map((s) => Number.parseInt(s, 10)) ?? [],
    (numbers: number[]) => (numbers?.length === 0 ? undefined : numbers?.sort((a, b) => a - b)?.join(',')),
);

const selectedVerses = computed(() => selectedChapter.value.verses.filter(v =>
    highlightedVerseNumbers.value.includes(v.number)
))

const removeHighlight = () => {
    unwatchSelection();
    highlightedVerseNumbers.value = [];
};
const getIsHighlighted = (number: number) => highlightedVerseNumbers.value?.includes(number);
const setIsHighlighted = (number: number, value: boolean) => {
    unwatchSelection();
    if (value) {
        highlightedVerseNumbers.value = highlightedVerseNumbers.value?.concat(number);
    } else {
        highlightedVerseNumbers.value = highlightedVerseNumbers.value?.filter((n) => n !== number);
    }
};
const getHiddenForPrint = (number: number) => highlightedVerseNumbers.value?.length > 0 && !getIsHighlighted(number);

const highlightedVerses = computed(() =>
    selectedChapter.value?.verses?.filter((v) => highlightedVerseNumbers.value?.includes(v.number)),
);
const navigationExpanded = ref(
    ![TRANSLATION_QUERY_KEY, BOOK_QUERY_KEY, CHAPTER_QUERY_KEY].every((v) => Object.keys(useRoute().query).includes(v)),
);
watch(translationListLoading, (value, oldValue) => {
    if (oldValue === true && value === false) {
        navigationExpanded.value = selectedChapter.value == null;
    }
});

const route = useRoute();
const router = useRouter();
const browserLocation = useBrowserLocation();
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
            formatPassageOptionsFromI18n('bible.passage_format_options', t),
        )
        : undefined,
);

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

function printNow() {
    window.print()
}

function readInContext() {
    router.push({
        name: 'reader',
        query: route.query
    })
}
</script>

<template>
    <div class="px-4 pb-[40vh] pt-[20vh] print:p-0 flex flex-col min-h-screen print:min-h-0">
        <div v-if="selectedChapter != null">
            <div class="relative w-full h-0">
                <div class="absolute -bottom-12 px-4 tracking-wider text-lg opacity-25 font-medium w-full text-center">
                    {{ selectedTranslation.localizedName ?? selectedTranslation.name }}
                </div>
            </div>
            <div class="flex flex-row w-full items-center justify-center gap-3 py-12 overflow-hidden">
                <Divider class="flex-shrink" />
                <span
                    class="text-3xl text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0">
                    {{ shareTitle }}
                </span>
                <Divider class="flex-shrink" />
            </div>
            <InlineVerse v-for="(verse, i) of selectedVerses" :id="`verse-${verse.number}`"
                :ref="(el) => verseRefs.set(verse.number, el as InstanceType<typeof InlineVerse>)" :key="i"
                :verse="verse" :show-number="false" />
            <div class="flex flex-row w-full items-center justify-stretch gap-3 py-12 overflow-hidden">
                <Divider class="flex-shrink" />
                <div v-if="printView" class="grow flex flex-row gap-1 print:hidden shrink-0">
                    <Button severity="secondary" rounded outlined @click="readInContext">
                        <template #icon>
                            <SvgIcon class="!scale-125" type="mdi" size="16" :path="mdiArrowLeft" />
                        </template>
                    </Button>
                    <Button :label="$t('prompts.print')" rounded @click="printNow" icon-pos="left" :pt="{
                        root: { class: 'flex flex-row gap-2.5' },
                        label: { class: 'text-ellipsis overflow-hidden' },
                    }">
                        <template #icon>
                            <SvgIcon class="!scale-125" type="mdi" size="16" :path="mdiPrinter" />
                        </template>
                    </Button>
                </div>
                <Button v-else class="grow print:hidden shrink-0" :label="$t('prompts.read_in_context')" outlined
                    rounded @click="readInContext" />
                <Divider class="flex-shrink print:hidden" />
            </div>
        </div>
        <div class="flex-grow" />
        <Footer class="print:hidden" />
    </div>
</template>
