import { BookInfo } from '../bible/bookInfo';
import { ChapterInfo } from '../bible/chapterInfo';
import { TranslationInfo } from '../bible/translationInfo';
import { Verse } from '../bible/verse';

export type IndexedVerse = {
    translation: TranslationInfo;
    book: BookInfo;
    chapter: ChapterInfo;
    verse: Verse;
};
