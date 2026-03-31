import type { BookType } from '@/types/bible/bookType';
import { BookTypeNewTestament, KeysNewTestament } from '@/types/bible/bookTypeNewTestament';
import { BookTypeOldTestament, KeysOldTestament } from '@/types/bible/bookTypeOldTestament';

export function stringToBookType(type: string | undefined) {
    return (
        BookTypeOldTestament[type?.toUpperCase() as BookTypeOldTestament]
        ?? BookTypeNewTestament[type?.toUpperCase() as BookTypeNewTestament]
    );
}

export function bookTypeToString(type: BookType | undefined) {
    return BookTypeOldTestament[type as BookTypeOldTestament] ?? BookTypeNewTestament[type as BookTypeNewTestament];
}

export function numberToBookType(type: number | undefined) {
    if (type === undefined) {
        return undefined;
    }
    return KeysOldTestament[type] ?? KeysNewTestament[type - KeysOldTestament.length];
}

export function bookTypeToNumber(type: BookType | undefined) {
    if (type === undefined) {
        return undefined;
    }
    const indexOT = KeysOldTestament.indexOf(type);
    if (indexOT !== -1) return indexOT;
    const indexNT = KeysNewTestament.indexOf(type);
    if (indexNT !== -1) return indexNT + KeysOldTestament.length;
    return undefined;
}
