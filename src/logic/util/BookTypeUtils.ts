import { BookType } from '@/types/bible/bookType';
import {
    BookTypeNewTestament,
    KeysNewTestament,
} from '@/types/bible/bookTypeNewTestament';
import {
    BookTypeOldTestament,
    KeysOldTestament,
} from '@/types/bible/bookTypeOldTestament';

export function stringToBookType(type: string) {
    return (
        BookTypeOldTestament[type?.toUpperCase()] ??
        BookTypeNewTestament[type?.toUpperCase()]
    );
}

export function bookTypeToString(type: BookType) {
    return BookTypeOldTestament[type] ?? BookTypeNewTestament[type];
}

export function numberToBookType(type: number) {
    return (
        KeysOldTestament[type] ??
        KeysNewTestament[type - KeysOldTestament.length]
    );
}

export function bookTypeToNumber(type: BookType) {
    const indexOT = KeysOldTestament.indexOf(type);
    if (indexOT !== -1) return indexOT;
    const indexNT = KeysNewTestament.indexOf(type);
    if (indexNT !== -1) return indexNT + KeysOldTestament.length;
    return undefined;
}
