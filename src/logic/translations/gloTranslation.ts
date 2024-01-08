import { Translation } from '../../types/bible/translation';
import json from '@/assets/translations/glo.json';
import { fromTranslation } from '../util/TranslationUtils';

export const gloTranslation: Translation = json as Translation;

export const gloProvider = fromTranslation(gloTranslation);
