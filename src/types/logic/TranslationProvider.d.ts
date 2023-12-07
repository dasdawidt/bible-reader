import { BookInfo } from '../bible/bookInfo';
import { TranslationInfo } from '../bible/translationInfo';
import { BookType } from '../bible/bookType';
import { Book } from '../bible/book';
import { Chapter } from '../bible/chapter';
import { Verse } from '../bible/verse';
import { ChapterInfo } from '../bible/chapterInfo';

export type TranslationProvider = {
    info: TranslationInfo;
    supportedBooks: BookInfo[];
    getBook(type: BookType): Promise<Book>;
    supportedChapters(type: BookType): Promise<ChapterInfo[]>;
    getChapter(book: BookType, chapter: number): Promise<Chapter>;
    supportedVerses(book: BookType, chapter: number): Promise<Verse[]>;
    getVerse(book: BookType, chapter: number, verse: number): Promise<Verse>;
};
