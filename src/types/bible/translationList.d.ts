import { TranslationInfo } from './translationInfo';

export type TranslationList = {
    id: string;
    name: string;
    translations: TranslationInfo[];
}[];
