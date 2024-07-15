import { IndexedVerse } from '@/types/index/indexedVerse';
import { computedAsync } from '@vueuse/core';
import { ref } from 'vue';

// const indexes = import.meta.glob<object>('@/assets/indexes/*/index.json', { import: 'default' });
const data = import.meta.glob<IndexedVerse[]>(
    '@/assets/indexes/*/verses.json',
    { import: 'default' }
);

const loading = ref(false);
const indexList = computedAsync(
    async () =>
        (await Promise.allSettled(Object.values(data).map((t) => t())))
            .filter(
                (
                    dataResult
                ): dataResult is PromiseFulfilledResult<IndexedVerse[]> => {
                    if (dataResult.status === 'rejected') {
                        console.warn(
                            'Failed to load index data:',
                            dataResult.reason
                        );
                        return false;
                    }
                    return true;
                }
            )
            .map(({ value }) => value),
    // .map(async (verses) => ({
    //     verses,
    //     indexObject: await import(`@/assets/indexes/${verses.at(0).translation.id.toLowerCase()}/index.json`),
    // }))
    // .map(({  }) => {
    //     try {
    //         return Fuse.parseIndex<IndexedVerse[]>(indexResult.value);
    //     } catch {
    //         console.warn('Failed to parse an index.');
    //         return null;
    //     }
    // })
    // .filter((index) => index !== null),
    [],
    loading
);

export const useIndexList = () => ({
    loading,
    indexList,
});
