import { Translation } from './translation';

export type TranslationList = {
    id: string;
    name: string;
    translations: Translation[];
}[];
