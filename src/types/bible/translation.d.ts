import { Book } from './book';
import { TranslationInfo } from './translationInfo';

export type Translation = TranslationInfo & {
    books: Book[];
};
