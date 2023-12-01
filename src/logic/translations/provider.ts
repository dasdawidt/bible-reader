import { TranslationList } from '@/types/bible/translationList';
import { gloTranslation } from './gloTranslation';

export const supportedTranslations: TranslationList = [
    {
        id: 'de',
        name: 'German',
        translations: [gloTranslation],
    },
];
