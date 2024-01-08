import { Translation } from '../../types/bible/translation';
import json from '@/assets/translations/kjv.json';
import { fromTranslation } from '../util/TranslationUtils';

export const kjvTranslation: Translation = json as Translation;

export const kjvProvider = fromTranslation(kjvTranslation);
