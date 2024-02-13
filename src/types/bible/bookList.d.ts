import { Book } from './book';
import { BookTypeNewTestament } from './bookTypeNewTestament';
import { BookTypeOldTestament } from './bookTypeOldTestament';

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
