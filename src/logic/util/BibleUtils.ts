import { BookInfo } from '@/types/bible/bookInfo';
import { BookType } from '@/types/bible/bookType';
import { Translation } from '@/types/bible/translation';
import { TranslationList } from '@/types/bible/translationList';
import { Verse } from '@/types/bible/verse';
import { Passage } from '@/types/plans/passage';

export function findTranslation(list: TranslationList, id: string) {
    return list
        .flatMap((l) => l.translations)
        .find((t) => t.id.toLowerCase() === id?.toLowerCase());
}

export function supportedBooks(translation: Translation): BookInfo[] {
    return translation.books;
}

export function getBook(translation: Translation, type: BookType) {
    return translation.books.find((b) => b.type === type);
}

export function getChapter(
    translation: Translation,
    book: BookType,
    chapter: number
) {
    return getBook(translation, book).chapters.find(
        (c) => c.number === chapter
    );
}

export function getVerse(
    translation: Translation,
    book: BookType,
    chapter: number,
    verse: number
) {
    return getChapter(translation, book, chapter).verses.find(
        (v) => v.number === verse
    );
}

export function getPassage(translation: Translation, passage: Passage) {
    return getVerse(
        translation,
        passage.bookType,
        passage.chapter,
        passage.verse
    );
}

export function toPassageVerseList(
    translation: Translation,
    bookType: BookType
) {
    return getBook(translation, bookType).chapters.map(
        (c) =>
            ({
                chapter: c.number,
                passages: c.verses.map(
                    (v) =>
                        ({
                            translationId: translation.id,
                            bookType: bookType,
                            chapter: c.number,
                            verse: v.number,
                            number: v.number,
                            text: v.text,
                        }) as Passage & Verse
                ),
            }) as {
                chapter: number;
                passages: Array<Passage & Verse>;
            }
    );
}

export function sortPassagesAsc(passages: Passage[]) {
    return passages.sort((a, b) =>
        a.chapter - b.chapter === 0 ? a.verse - b.verse : a.chapter - b.chapter
    );
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
export function formatPassages(
    translation: Translation,
    passages: Passage[],
    options?: FormatPassageOptions
) {
    const defaultOptions = {
        booksDelimiter: '; ',
        chaptersDelimiter: '; ',
        chapterVerseDelimiter: ':',
        verseSpan: '–',
        verseGap: ', ',
        short: false,
        includeTranslation: false,
    };
    options = {
        ...defaultOptions,
        ...options,
    };

    passages = sortPassagesAsc(passages);
    const groupedByBook = passages.reduce<Map<BookType, Passage[]>>(
        (groups, passage) => {
            const { bookType } = passage;
            groups.set(
                bookType,
                (groups.get(bookType) ?? []).concat([passage])
            );
            return groups;
        },
        new Map()
    );

    let formatted = Array.from(groupedByBook.entries())
        .map((entry) =>
            formatPassagesSameBook(
                getBook(translation, entry[0]),
                entry[1],
                options.chapterVerseDelimiter,
                options.chaptersDelimiter,
                options.verseSpan,
                options.verseGap,
                options.short
            )
        )
        .join(options.booksDelimiter);

    if (options.includeTranslation == true) {
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
    short: boolean
) {
    const bookName = short ? book.abbreviation.toUpperCase() : book.name;
    const groupedByChapter = passages.reduce<Map<number, Passage[]>>(
        (groups, passage) => {
            const { chapter } = passage;
            groups.set(chapter, (groups.get(chapter) ?? []).concat([passage]));
            return groups;
        },
        new Map()
    );

    const formatted = Array.from(groupedByChapter.entries())
        .map(
            (entry) =>
                entry[0] +
                chapterVerseDelimiter +
                formatPassagesSameChapter(entry[1], verseSpan, verseGap)
        )
        .join(chaptersDelimiter);

    return `${bookName} ${formatted}`;
}

function formatPassagesSameChapter(
    passages: Passage[],
    verseSpan: string,
    verseGap: string
) {
    let ranges = [];
    let range = [];
    ranges.push(passages[0]);
    passages.forEach((p) => {
        if (range.length === 2 && range[1] + 1 === p.verse) {
            range[1] = p.verse;
            return;
        }
        if (range.length === 2) {
            ranges.push(range);
        }
        range = [p.verse, p.verse];
    });
    ranges.push(range);

    return ranges
        .filter((r) => r.length === 2)
        .map((r) => (r[0] === r[1] ? r[0] + '' : r[0] + verseSpan + r[1]))
        .join(verseGap);
}
