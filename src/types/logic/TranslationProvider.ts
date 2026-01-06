import type { UseQueryReturnType } from 'vue-query';
import type { Book } from '../bible/book';
import type { BookInfo } from '../bible/bookInfo';
import type { BookType } from '../bible/bookType';
import type { Chapter } from '../bible/chapter';
import type { TranslationInfo } from '../bible/translationInfo';
import type { Verse } from '../bible/verse';

export type TranslationProvider = {
    info: TranslationInfo;
    supportedBooks: BookInfo[];
    getBook(type: BookType): UseQueryReturnType<Book, string>;
    getChapter(book: BookType, chapter: number): UseQueryReturnType<Chapter, string>;
    getVerse(book: BookType, chapter: number, verse: number): UseQueryReturnType<Verse, string>;
};
