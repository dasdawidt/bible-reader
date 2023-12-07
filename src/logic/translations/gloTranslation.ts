import { BookType } from '@/types/bible/bookType';
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
    async getBook(type: BookType) {
        return getBook(gloTranslation, type);
        // return gloTranslation.books.find((b) => b.type === type);
    },
    async supportedChapters(type: BookType) {
        return getBook(gloTranslation, type).chapters;
    },
    async getChapter(book: BookType, chapter: number) {
        return getChapter(gloTranslation, book, chapter);
    },
    async supportedVerses(book: BookType, chapter: number) {
        return getChapter(gloTranslation, book, chapter).verses;
    },
    async getVerse(book: BookType, chapter: number, verse: number) {
        return getVerse(gloTranslation, book, chapter, verse);
    },
};
