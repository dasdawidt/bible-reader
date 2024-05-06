import { FormatPassageOptions } from './BibleUtils';

export function formatPassageOptionsFromI18n(
    prefixKey: string,
    t: (string) => string
): FormatPassageOptions {
    return {
        booksDelimiter: t(`${prefixKey}.books_delimiter`),
        chaptersDelimiter: t(`${prefixKey}.chapters_delimiter`),
        chapterVerseDelimiter: t(`${prefixKey}.chapter_verse_delimiter`),
        verseSpan: t(`${prefixKey}.verse_span`),
        verseGap: t(`${prefixKey}.verse_gap`),
    };
}
