import { TranslationList } from '@/types/bible/translationList';
import { gloTranslation } from './gloTranslation';
import { kjvTranslation } from './kjvTranslation';
import { gscTranslation } from './gscTranslation';
import { gelTranslation } from './gelTranslation';
import { asvTranslation } from './asvTranslation';

export const supportedTranslations: TranslationList = [
    {
        id: 'de',
        name: 'German',
        translations: [gloTranslation, gscTranslation, gelTranslation],
    },
    {
        id: 'en',
        name: 'English',
        translations: [kjvTranslation, asvTranslation],
    },
];
