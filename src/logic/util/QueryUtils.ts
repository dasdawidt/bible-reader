import { useRouteQuery } from '@vueuse/router';
import { computed } from 'vue';

export function fromQuery<Y>(
    queryName: string,
    stringToType: (v: string | undefined) => Y,
    typeToString: (v: Y) => string | undefined,
) {
    const query = useRouteQuery(queryName);
    const reference = computed({
        get: () => stringToType(`${query.value}`),
        set: (v) => {
            query.value = typeToString(v);
        },
    });
    return reference;
}
