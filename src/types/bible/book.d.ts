import { BookInfo } from './bookInfo';
import { Chapter } from './chapter';

export type Book = BookInfo & {
    chapters: Chapter[];
};
