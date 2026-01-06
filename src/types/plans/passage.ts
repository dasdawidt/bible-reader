import type { BookType } from '../bible/bookType';

export type Passage = {
    translationId: string;
    bookType: BookType;
    chapter: number;
    verse: number;
};
