import type { FormatPassageOptions } from './BibleUtils';

/**
 * Reads all keys for a `FormatPassageOptions` object from the i18n instance and returns an object containing them.
 * @param prefixKey the prefix of the i18n key for all properties of the format passage options object
 * @param t the i18n translation function
 * @returns a `FormatPassageOptions`object
 */
export function formatPassageOptionsFromI18n(prefixKey: string, t: (string) => string): FormatPassageOptions {
    return {
        booksDelimiter: t(`${prefixKey}.books_delimiter`),
        chaptersDelimiter: t(`${prefixKey}.chapters_delimiter`),
        chapterVerseDelimiter: t(`${prefixKey}.chapter_verse_delimiter`),
        verseSpan: t(`${prefixKey}.verse_span`),
        verseGap: t(`${prefixKey}.verse_gap`),
    };
}
