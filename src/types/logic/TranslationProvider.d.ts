import { BookInfo } from '../bible/bookInfo';
import { TranslationInfo } from '../bible/translationInfo';
import { BookType } from '../bible/bookType';
import { Book } from '../bible/book';
import { Chapter } from '../bible/chapter';
import { Verse } from '../bible/verse';

export type TranslationProvider = {
    info: TranslationInfo;
    supportedBooks: BookInfo[];
    getBook(type: BookType): Promise<Book>;
    getChapter(book: BookType, chapter: number): Promise<Chapter>;
    getVerse(book: BookType, chapter: number, verse: number): Promise<Verse>;
};
