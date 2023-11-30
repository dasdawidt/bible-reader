import { BookTypeNewTestament } from './bookTypeNewTestament';
import { BookTypeOldTestament } from './bookTypeOldTestament';
import { Book } from './book';

export type BookList = [
    {
        name: string;
        type: BookTypeOldTestament;
        books: Book[];
    },
    {
        name: string;
        type: BookTypeOldTestament;
        books: Book[];
    }
];
