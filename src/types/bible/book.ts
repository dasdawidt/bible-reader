import type { BookInfo } from './bookInfo';
import type { Chapter } from './chapter';

export type Book = BookInfo & {
    chapters: Chapter[];
};
