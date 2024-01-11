import { BookType } from '@/types/bible/bookType';
import { BookTypeNewTestament } from '@/types/bible/bookTypeNewTestament';
import { BookTypeOldTestament } from '@/types/bible/bookTypeOldTestament';

export function stringToBookType(type: string) {
    return (
        BookTypeOldTestament[type.toUpperCase()] ??
        BookTypeNewTestament[type.toUpperCase()]
    );
}

export function bookTypeToString(type: BookType) {
    return BookTypeOldTestament[type] ?? BookTypeNewTestament[type];
}
