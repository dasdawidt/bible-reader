import { Translation } from '../../types/bible/translation';
import json from '@/assets/translations/gsc.json';
import { fromTranslation } from '../util/TranslationUtils';

export const gscTranslation: Translation = json as Translation;

export const gscProvider = fromTranslation(gscTranslation);
