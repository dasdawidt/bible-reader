import { TranslationList } from '@/types/bible/translationList';
import { gloTranslation } from './gloTranslation';
import { kjvTranslation } from './kjvTranslation';

export const TRANSLATION_LIST: TranslationList = [
    {
        id: 'de',
        name: 'German',
        translations: [gloTranslation],
    },
    {
        id: 'en',
        name: 'English',
        translations: [kjvTranslation],
    },
];
