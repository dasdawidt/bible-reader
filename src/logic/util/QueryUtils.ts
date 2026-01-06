import { useRouteQuery } from '@vueuse/router';
import { computed } from 'vue';

export function fromQuery<Y>(
    queryName: string,
    stringToType: (v: string) => Y,
    typeToString: (v: Y) => string,
    fallbackValue?: Y,
) {
    const fallbackValueString = typeToString(fallbackValue);
    const query = useRouteQuery(queryName, fallbackValueString);
    const reference = computed({
        get: () => stringToType(query.value),
        set: (v) => (query.value = typeToString(v)),
    });
    return reference;
}
