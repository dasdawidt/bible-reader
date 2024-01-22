import { Translation } from '../../types/bible/translation';
import json from '@/assets/translations/asv.json';
import { fromTranslation } from '../util/TranslationUtils';

export const asvTranslation: Translation = json as Translation;

export const asvProvider = fromTranslation(asvTranslation);
