import { Translation } from '../../types/bible/translation';
import { TranslationProvider } from '../../types/logic/TranslationProvider';
import { getBook, getChapter, getVerse } from '../util/BibleUtils';
import json from '@/assets/translations/glo.json';

export const gloTranslation: Translation = json as Translation;

export const gloProvider: TranslationProvider = {
    get info() {
        return {
            id: gloTranslation.id,
            language: gloTranslation.language,
            name: gloTranslation.name,
            localizedName: gloTranslation.localizedName,
        };
    },
    get supportedBooks() {
        return gloTranslation.books?.map((b) => b);
    },
    getBook(type) {
        return new Promise(() => getBook(gloTranslation, type));
    },
    async getChapter(book, chapter) {
        return new Promise(() => getChapter(gloTranslation, book, chapter));
    },
    async getVerse(book, chapter, verse) {
        return new Promise(() =>
            getVerse(gloTranslation, book, chapter, verse)
        );
    },
};
