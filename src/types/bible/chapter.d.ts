import { ChapterInfo } from './chapterInfo';
import { Verse } from './verse';

export type Chapter = ChapterInfo & {
    verses: Verse[];
};
