import { Translation } from '@/types/bible/translation';
import { TranslationList } from '@/types/bible/translationList';
import { computedAsync } from '@vueuse/core';
import { ref } from 'vue';

const translations = import.meta.glob<Translation>(
    '@/assets/translations/*.json'
);

const loading = ref(false);
const translationList = computedAsync(
    async () =>
        (await Promise.allSettled(Object.values(translations).map((t) => t())))
            .reduce<TranslationList>((translationList, translationResult) => {
                if (translationResult.status === 'rejected') {
                    console.warn(
                        'Failed to load a translation:',
                        translationResult.reason
                    );
                    return translationList;
                }
                let index = translationList.findIndex(
                    (language) =>
                        language.id.toLowerCase() ===
                        translationResult.value.language.toLowerCase()
                );
                if (index === -1) {
                    index =
                        translationList.push({
                            id: translationResult.value.language.toLowerCase(),
                            translations: [],
                        }) - 1;
                }
                translationList[index].translations.push(
                    translationResult.value
                );
                return translationList;
            }, [])
            .sort((a, b) => a.id.localeCompare(b.id)),
    [],
    loading
);

export const useTranslationList = () => ({
    loading,
    translationList,
});
