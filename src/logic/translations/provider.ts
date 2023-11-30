import { TranslationList } from '@/types/bible/translationList';
import { stubTranslation } from './stubTranslation';
import { gloTranslation } from './gloTranslation';

export const supportedTranslations: TranslationList = [
    {
        id: 'de',
        name: 'German',
        translations: [stubTranslation, gloTranslation],
    },
];
