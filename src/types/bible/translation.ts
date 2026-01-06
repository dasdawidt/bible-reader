import type { Book } from './book';
import type { TranslationInfo } from './translationInfo';

export type Translation = TranslationInfo & {
    books: Book[];
};
