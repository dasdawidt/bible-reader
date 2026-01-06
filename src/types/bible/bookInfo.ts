import type { BookType } from './bookType';

export type BookInfo = {
    type: BookType;
    name: string;
    verboseName?: string;
    abbreviation: string;
};
