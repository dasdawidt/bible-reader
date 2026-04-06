import { useRouteQuery } from '@vueuse/router';

export function fromQuery<Y>(
    queryName: string,
    stringToType: (v: string | undefined) => Y,
    typeToString: (v: Y) => string | undefined,
    defaultValue?: Y,
) {
    const defaultVal = defaultValue === undefined ? undefined : typeToString(defaultValue);
    return useRouteQuery(queryName, defaultVal ?? null, {
        transform: {
            get: (v) => {
                return stringToType(v ?? undefined);
            },
            set: (v) => {
                return typeToString(v) ?? defaultVal ?? null;
            },
        },
    });
}
