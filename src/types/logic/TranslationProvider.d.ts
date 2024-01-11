import { UseQueryReturnType } from 'vue-query';
import { Book } from '../bible/book';
import { BookInfo } from '../bible/bookInfo';
import { BookType } from '../bible/bookType';
import { Chapter } from '../bible/chapter';
import { TranslationInfo } from '../bible/translationInfo';
import { Verse } from '../bible/verse';

export type TranslationProvider = {
    info: TranslationInfo;
    supportedBooks: BookInfo[];
    getBook(type: BookType): UseQueryReturnType<Book, string>;
    getChapter(
        book: BookType,
        chapter: number
    ): UseQueryReturnType<Chapter, string>;
    getVerse(
        book: BookType,
        chapter: number,
        verse: number
    ): UseQueryReturnType<Verse, string>;
};
