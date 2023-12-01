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
    getBook(type) {
        return new Promise(() => getBook(kjvTranslation, type));
    },
    async getChapter(book, chapter) {
        return new Promise(() => getChapter(kjvTranslation, book, chapter));
    },
    async getVerse(book, chapter, verse) {
        return new Promise(() =>
            getVerse(kjvTranslation, book, chapter, verse)
        );
    },
};
