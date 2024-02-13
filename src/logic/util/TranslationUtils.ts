import { Translation } from '@/types/bible/translation';
import { getBook, getChapter, getVerse } from './BibleUtils';
import { TranslationProvider } from '@/types/logic/TranslationProvider';

export const fromTranslation = (translation: Translation) =>
    ({
        get info() {
            return {
                id: translation.id,
                language: translation.language,
                name: translation.name,
                localizedName: translation.localizedName,
            };
        },
        get supportedBooks() {
            return translation.books?.map((b) => b);
        },
        getBook(type) {
            return new Promise(() => getBook(translation, type));
        },
        async getChapter(book, chapter) {
            return new Promise(() => getChapter(translation, book, chapter));
        },
        async getVerse(book, chapter, verse) {
            return new Promise(() =>
                getVerse(translation, book, chapter, verse)
            );
        },
    } as TranslationProvider);
