import { TranslationList } from '@/types/bible/translationList';
import { gloProvider } from './gloTranslation';
import { kjvProvider } from './kjvTranslation';

export const supportedTranslations: TranslationList = [
    {
        id: 'de',
        name: 'German',
        translations: [gloProvider.info],
    },
    {
        id: 'en',
        name: 'English',
        translations: [kjvProvider.info],
    },
];

const translations = [gloProvider, kjvProvider];

export const findTranslation = (id: string) =>
    translations.find((t) => t.info.id === id);
