import { Translation } from '@/types/bible/translation';
import { TranslationList } from '@/types/bible/translationList';

const translations = import.meta.glob<Translation>(
    '@/assets/translations/*.json',
    {
        import: 'default',
        eager: false,
    }
);

export const TRANSLATION_LIST = (
    await Promise.all(Object.values(translations).map((t) => t()))
)
    .reduce<TranslationList>((translationList, translation) => {
        let index = translationList.findIndex(
            (language) =>
                language.id.toLowerCase() === translation.language.toLowerCase()
        );
        if (index === -1) {
            index =
                translationList.push({
                    id: translation.language.toLowerCase(),
                    translations: [],
                }) - 1;
        }
        translationList[index].translations.push(translation);
        return translationList;
    }, [])
    .sort((a, b) => a.id.localeCompare(b.id));
