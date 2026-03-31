import type { BookInfo } from '@/types/bible/bookInfo';
import type { BookType } from '@/types/bible/bookType';
import type { Translation } from '@/types/bible/translation';
import type { TranslationList } from '@/types/bible/translationList';
import type { Verse } from '@/types/bible/verse';
import type { Passage } from '@/types/plans/passage';

export function findTranslation(list: TranslationList, id: string) {
    return list.flatMap((l) => l.translations).find((t) => t.id.toLowerCase() === id?.toLowerCase());
}

export function supportedBooks(translation: Translation): BookInfo[] {
    return translation.books;
}

export function getBook(translation: Translation | undefined, type: BookType | undefined) {
    return translation?.books.find((b) => b.type === type);
}

export function getChapter(
    translation: Translation | undefined,
    book: BookType | undefined,
    chapter: number | undefined,
) {
    return getBook(translation, book)?.chapters.find((c) => c.number === chapter);
}

export function getVerse(
    translation: Translation | undefined,
    book: BookType | undefined,
    chapter: number | undefined,
    verse: number | undefined,
) {
    return getChapter(translation, book, chapter)?.verses.find((v) => v.number === verse);
}

export function getPassage(translation: Translation | undefined, passage: Passage | undefined) {
    return getVerse(translation, passage?.bookType, passage?.chapter, passage?.verse);
}

export function toPassageVerseList(translation: Translation | undefined, bookType: BookType | undefined) {
    return getBook(translation, bookType)?.chapters.map(
        (c) =>
            ({
                chapter: c.number,
                passages: c.verses.map(
                    (v) =>
                        ({
                            translationId: translation?.id,
                            bookType: bookType,
                            chapter: c.number,
                            verse: v.number,
                            number: v.number,
                            text: v.text,
                        }) as Passage & Verse,
                ),
            }) as {
                chapter: number;
                passages: Array<Passage & Verse>;
            },
    );
}

export function sortPassagesAsc(passages: Passage[]) {
    return passages.sort((a, b) => (a.chapter - b.chapter === 0 ? a.verse - b.verse : a.chapter - b.chapter));
}

export type FormatPassageOptions = {
    /**
     * Delimiter between different books.
     */
    booksDelimiter?: string;
    /**
     * Delimiter between different chapters of the same book.
     */
    chaptersDelimiter?: string;
    /**
     * Delimiter between a chapter and its first verse.
     */
    chapterVerseDelimiter?: string;
    /**
     * Delimiter between start and end of a consecutive sequence of verses.
     */
    verseSpan?: string;
    /**
     * Delimiter between non-consecutive verses.
     */
    verseGap?: string;
    /**
     * Whether the book's abbreviation should be used.
     */
    short?: boolean;
    /**
     * Whether the translation's id should be included.
     */
    includeTranslation?: boolean;
};

/**
 * Formats a `Passage` to be readable.
 * Using the options, the formatting style can be configured.
 * @param translation the `Translation` to use (e.g. for the `Book`'s name)
 * @param passages the `Passages` to format
 * @param options options for configuration
 */
export function formatPassages(translation: Translation, passages: Passage[], options?: FormatPassageOptions) {
    const defaultOptions = {
        booksDelimiter: '; ',
        chaptersDelimiter: '; ',
        chapterVerseDelimiter: ':',
        verseSpan: '–',
        verseGap: ', ',
        short: false,
        includeTranslation: false,
    };
    const applicableOptions = {
        ...defaultOptions,
        ...options,
    };

    passages = sortPassagesAsc(passages);
    const groupedByBook = passages.reduce<Map<BookType, Passage[]>>((groups, passage) => {
        const { bookType } = passage;
        groups.set(bookType, (groups.get(bookType) ?? []).concat([passage]));
        return groups;
    }, new Map());

    let formatted = Array.from(groupedByBook.entries())
        .map((entry) => {
            const book = getBook(translation, entry[0]);
            if (book) {
                return formatPassagesSameBook(
                    book,
                    entry[1],
                    applicableOptions.chapterVerseDelimiter,
                    applicableOptions.chaptersDelimiter,
                    applicableOptions.verseSpan,
                    applicableOptions.verseGap,
                    applicableOptions.short,
                );
            }
            return undefined;
        })
        .filter((b) => b !== undefined)
        .join(applicableOptions.booksDelimiter);

    if (applicableOptions.includeTranslation === true) {
        formatted += ` (${translation.id.toUpperCase()})`;
    }

    return formatted;
}

function formatPassagesSameBook(
    book: BookInfo,
    passages: Passage[],
    chapterVerseDelimiter: string,
    chaptersDelimiter: string,
    verseSpan: string,
    verseGap: string,
    short: boolean,
) {
    const bookName = short ? book.abbreviation.toUpperCase() : book.name;
    const groupedByChapter = passages.reduce<Map<number, Passage[]>>((groups, passage) => {
        const { chapter } = passage;
        groups.set(chapter, (groups.get(chapter) ?? []).concat([passage]));
        return groups;
    }, new Map());

    const formatted = Array.from(groupedByChapter.entries())
        .map((entry) => entry[0] + chapterVerseDelimiter + formatPassagesSameChapter(entry[1], verseSpan, verseGap))
        .join(chaptersDelimiter);

    return `${bookName} ${formatted}`;
}

function formatPassagesSameChapter(passages: Passage[], verseSpan: string, verseGap: string) {
    const ranges: number[][] = [];
    let range: number[] = [];
    for (const p of passages) {
        if (range.length === 2 && range[1] + 1 === p.verse) {
            range[1] = p.verse;
            continue;
        }
        if (range.length === 2) {
            ranges.push(range);
        }
        range = [p.verse, p.verse];
    }
    ranges.push(range);

    return ranges
        .filter((r) => r.length === 2)
        .map((r) => (r[0] === r[1] ? `${r[0]}` : r[0] + verseSpan + r[1]))
        .join(verseGap);
}
