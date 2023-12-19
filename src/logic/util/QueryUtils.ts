import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export function fromQuery<Y>(
    queryName: string,
    stringToType: QFunction<string, Y>,
    typeToString: QFunction<Y, string>,
    fallbackValue?: Y
) {
    const router = useRouter();
    const route = useRoute();
    const refValue = ref<Y | undefined>();
    const queryValue = route.query[queryName];
    refValue.value = fallbackValue;
    if (typeof queryValue === 'string') {
        refValue.value = stringToType(queryValue);
    }
    const computedValue = computed<Y | undefined>({
        get: () => refValue.value,
        set: (v) => {
            router.replace({
                ...route,
                query: {
                    ...route.query,
                    [queryName]: typeToString(v),
                },
            });
            refValue.value = v;
        },
    });
    return computedValue;
}

export type QFunction<T, R> = {
    (value: T): R;
};
