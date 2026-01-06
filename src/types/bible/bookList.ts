import type { Book } from './book';
import type { BookTypeNewTestament } from './bookTypeNewTestament';
import type { BookTypeOldTestament } from './bookTypeOldTestament';

export type BookList = [
    {
        name: string;
        type: BookTypeOldTestament;
        books: Book[];
    },
    {
        name: string;
        type: BookTypeNewTestament;
        books: Book[];
    },
];
