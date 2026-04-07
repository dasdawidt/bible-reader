import { BookTypeOldTestament } from '@/types/bible/bookTypeOldTestament';
import type { Translation } from '@/types/bible/translation';

export const mockTranslation: Translation = {
    id: 'mck',
    language: 'en',
    name: 'Mock Translation',
    books: [
        {
            abbreviation: 'MCKGEN',
            name: 'Mock Genesis',
            type: BookTypeOldTestament.GENESIS,
            chapters: [
                {
                    number: 1,
                    verses: [
                        {
                            number: 1,
                            text: 'Mock verse number one.',
                        },
                        {
                            number: 2,
                            text: 'Mock verse number two.',
                        },
                    ],
                },
                {
                    number: 2,
                    verses: [
                        {
                            number: 1,
                            text: 'Mock verse number one.',
                        },
                        {
                            number: 2,
                            text: 'Mock verse number two.',
                        },
                    ],
                },
            ],
        },
        {
            abbreviation: 'MCKEXO',
            name: 'Mock Exodus',
            type: BookTypeOldTestament.EXODUS,
            chapters: [
                {
                    number: 1,
                    verses: [
                        {
                            number: 1,
                            text: 'Mock verse number one.',
                        },
                        {
                            number: 2,
                            text: 'Mock verse number two.',
                        },
                    ],
                },
                {
                    number: 2,
                    verses: [
                        {
                            number: 1,
                            text: 'Mock verse number one.',
                        },
                        {
                            number: 2,
                            text: 'Mock verse number two.',
                        },
                    ],
                },
            ],
        },
    ],
};
