import { expect, suite, test } from 'vitest';
import { mockTranslation } from '@/../test/Translation';
import { getTargetChapter } from './BibleUtils';

suite('getTargetChapter', () => {
    const cases: {
        title: string;
        input: Parameters<typeof getTargetChapter>;
        result: ReturnType<typeof getTargetChapter>;
    }[] = [
        {
            title: 'previous chapter of undefined is undefined',
            input: [{}, 'previous'],
            result: undefined,
        },
        {
            title: 'next chapter of undefined is undefined',
            input: [{}, 'next'],
            result: undefined,
        },
        {
            title: 'previous chapter of genesis 1 is undefined',
            input: [
                {
                    translation: mockTranslation,
                    book: mockTranslation.books[0],
                    chapter: mockTranslation.books[0].chapters[0],
                },
                'previous',
            ],
            result: undefined,
        },
        {
            title: 'next chapter of genesis 1 ins genesis 2',
            input: [
                {
                    translation: mockTranslation,
                    book: mockTranslation.books[0],
                    chapter: mockTranslation.books[0].chapters[0],
                },
                'next',
            ],
            result: {
                direction: 'next',
                book: mockTranslation.books[0],
                chapter: mockTranslation.books[0].chapters[1],
            },
        },
        {
            title: 'next chapter of genesis 2 is exodus 1',
            input: [
                {
                    translation: mockTranslation,
                    book: mockTranslation.books[0],
                    chapter: mockTranslation.books[0].chapters[1],
                },
                'next',
            ],
            result: {
                direction: 'next',
                book: mockTranslation.books[1],
                chapter: mockTranslation.books[1].chapters[0],
            },
        },
        {
            title: 'previous chapter of exodus 2 is genesis 1',
            input: [
                {
                    translation: mockTranslation,
                    book: mockTranslation.books[1],
                    chapter: mockTranslation.books[1].chapters[0],
                },
                'previous',
            ],
            result: {
                direction: 'previous',
                book: mockTranslation.books[0],
                chapter: mockTranslation.books[0].chapters[1],
            },
        },
        {
            title: 'next chapter of exodus 2 is undefined',
            input: [
                {
                    translation: mockTranslation,
                    book: mockTranslation.books[1],
                    chapter: mockTranslation.books[1].chapters[1],
                },
                'next',
            ],
            result: undefined,
        },
    ];
    for (const c of cases) {
        test(c.title, () => {
            const result = getTargetChapter(...c.input);
            expect(result).toEqual(c.result);
        });
    }
});
