import { BookType } from '@/types/bible/bookType';
import { Translation } from '../../types/bible/translation';
import { TranslationProvider } from '../../types/logic/TranslationProvider';
import { getBook, getChapter, getVerse } from '../util/BibleUtils';
import json from '@/assets/translations/kjv.json';

export const kjvTranslation: Translation = json as Translation;

export const kjvProvider: TranslationProvider = {
    get info() {
        return {
            id: kjvTranslation.id,
            language: kjvTranslation.language,
            name: kjvTranslation.name,
            localizedName: kjvTranslation.localizedName,
        };
    },
    get supportedBooks() {
        return kjvTranslation.books?.map((b) => b);
    },
    async getBook(type: BookType) {
        return getBook(kjvTranslation, type);
    },
    async supportedChapters(type: BookType) {
        return getBook(kjvTranslation, type).chapters;
    },
    async getChapter(book: BookType, chapter: number) {
        return getChapter(kjvTranslation, book, chapter);
    },
    async supportedVerses(book: BookType, chapter: number) {
        return getChapter(kjvTranslation, book, chapter).verses;
    },
    async getVerse(book: BookType, chapter: number, verse: number) {
        return getVerse(kjvTranslation, book, chapter, verse);
    },
};
