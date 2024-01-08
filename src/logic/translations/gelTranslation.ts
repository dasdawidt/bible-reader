import { Translation } from '../../types/bible/translation';
import json from '@/assets/translations/gel.json';
import { fromTranslation } from '../util/TranslationUtils';

export const gelTranslation: Translation = json as Translation;

export const gelProvider = fromTranslation(gelTranslation);
