import { BookType } from "../bible/bookType";
import { TranslationInfo } from "../bible/translationInfo";

export type Passage = {
    translationId: string;
    bookType: BookType;
    chapter: number;
    verse: number;
}
