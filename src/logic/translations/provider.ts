import { TranslationList } from '@/types/bible/translationList';
import { stubTranslation } from './stubTranslation';

export const supportedTranslations: TranslationList = [
    {
        id: 'de',
        name: 'German',
        translations: [stubTranslation],
    },
];
